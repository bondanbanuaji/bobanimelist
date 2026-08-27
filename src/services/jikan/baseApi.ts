import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryReturnValue } from '@reduxjs/toolkit/query';
import i18n from '@/i18n';
import { apiLimiter } from './apiLimiter';

// Cache configuration - following requirements (5-10 minutes TTL)
const CACHE_TTL = 600 * 1000; // 10 minutes (maximum as per requirements)
const STALE_CACHE_TTL = 1800 * 1000; // 30 minutes - return stale data on server errors

// Global cache storage for all Jikan API data
const cache = new Map<string, { data: unknown; timestamp: number }>();
// Track ongoing requests globally to prevent duplicate requests
const ongoingRequests = new Map<string, Promise<QueryReturnValue<unknown, FetchBaseQueryError, Record<string, unknown>>>>();

// Check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_TTL;
};

// Check if cached data is stale but usable (for fallback on server errors)
const isCacheStale = (timestamp: number): boolean => {
    return Date.now() - timestamp < STALE_CACHE_TTL;
};

const TENRAI_API_BASE_URL = 'https://api.tenrai.org/v1';
const PROXY_BASE_URL = '/api/proxy';
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4'; // Fallback
const RETRY_DELAY_429 = 4000; // 4 seconds before retry after 429
const RETRY_DELAY_5XX = 2000; // 2 seconds before retry after 5xx (faster for Tenrai)
const MAX_RETRIES = 3; // Maximum number of retries for server errors
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const REQUEST_TIMEOUT_MS = 15000; // 15 second timeout per request

// Build the base URL: use proxy in browser, direct in server
const isBrowser = typeof window !== 'undefined';
const getTenraiBaseUrl = () => {
    if (isBrowser) {
        return PROXY_BASE_URL;
    }
    return TENRAI_API_BASE_URL;
};

// Custom base query with internationalization headers and request timeout
// Primary: Tenrai API (via proxy), Fallback: Jikan API
const baseQuery = fetchBaseQuery({
    baseUrl: getTenraiBaseUrl(),
    prepareHeaders: (headers) => {
        const currentLng = i18n.language;
        let acceptLanguageValue = 'en-US';

        if (currentLng === 'jp') acceptLanguageValue = 'ja-JP';
        else if (currentLng === 'id') acceptLanguageValue = 'id-ID';

        headers.set('Accept-Language', acceptLanguageValue);
        return headers;
    },
    timeout: REQUEST_TIMEOUT_MS,
});

// Fallback query using Jikan API
const fallbackQuery = fetchBaseQuery({
    baseUrl: JIKAN_API_BASE_URL,
    prepareHeaders: (headers) => {
        const currentLng = i18n.language;
        let acceptLanguageValue = 'en-US';

        if (currentLng === 'jp') acceptLanguageValue = 'ja-JP';
        else if (currentLng === 'id') acceptLanguageValue = 'id-ID';

        headers.set('Accept-Language', acceptLanguageValue);
        return headers;
    },
    timeout: REQUEST_TIMEOUT_MS,
});

// Global query function applying rate limiting to all Jikan API requests
const baseQueryWithRateLimiting: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, unknown>
> = async (args, api, extraOptions) => {
    // Generate consistent cache key for endpoint + parameters
    let cacheKey = '';
    if (typeof args === 'string') {
        cacheKey = args;
    } else if (args && typeof args === 'object' && 'url' in args) {
        const url = (args as { url: string }).url;
        const params = (args as FetchArgs).params
            ? Object.keys((args as FetchArgs).params!)
                  .sort()
                  .map(key => `${key}=${(args as FetchArgs).params?.[key]}`)
                  .join('&')
            : '';
        cacheKey = `${url}${params ? `?${params}` : ''}`;
    } else {
        cacheKey = JSON.stringify(args);
    }

    // Check global cache first (applies to all components using this API)
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && isCacheValid(cachedResult.timestamp)) {
        console.log(`[GLOBAL API] Cache hit for: ${cacheKey}`);
        return { data: cachedResult.data, meta: undefined as Record<string, unknown> | undefined };
    }

    // Check for ongoing identical requests (global request deduplication)
    if (ongoingRequests.has(cacheKey)) {
        console.log(`[GLOBAL API] Waiting for ongoing request for: ${cacheKey}`);
        try {
            const ongoingPromise = ongoingRequests.get(cacheKey);
            if (!ongoingPromise) {
                // This should not happen due to the .has() check above, but for type safety
                throw new Error('Unexpected missing ongoing request');
            }
            const result = await ongoingPromise;
            return result;
        } catch {
            // If ongoing request fails, remove from map and continue with new request
            ongoingRequests.delete(cacheKey);
        }
    }

    // Execute request through the global rate limiter
    const executeRequest = async () => {
        let endpoint = 'unknown';
        if (typeof args === 'string') {
            endpoint = args.split('?')[0];
        } else if (args && typeof args === 'object' && 'url' in args) {
            endpoint = (args as { url: string }).url.split('?')[0];
        }

        console.log(`[GLOBAL API] Processing request to: ${endpoint} at ${new Date().toISOString()}`);

        // Process request through the global rate limiter queue
        let result = await apiLimiter.executeRequest(async () => {
            return baseQuery(args, api, extraOptions);
        });
        
        // Implement retry logic for 429 and 5xx errors with exponential backoff
        let retryCount = 0;
        while (retryCount < MAX_RETRIES && result.error?.status && RETRYABLE_STATUSES.has(result.error.status as number)) {
            const status = result.error.status as number;
            const delay = status === 429 
                ? RETRY_DELAY_429 * (retryCount + 1)  // Exponential backoff: 4s, 8s, 12s
                : RETRY_DELAY_5XX * (retryCount + 1); // Exponential backoff: 2s, 4s, 6s
            
            console.warn(`[GLOBAL API] ${status} ${status === 429 ? 'Rate Limited' : 'Server Error'} for endpoint: ${endpoint}, retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms...`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            
            result = await apiLimiter.executeRequest(async () => {
                return baseQuery(args, api, extraOptions);
            });
            
            retryCount++;
        }

        // If Tenrai fails with server or network errors, try Jikan as fallback
        // Covers: network errors (FETCH_ERROR etc), 400 from proxy bug, and 5xx
        const status = result.error?.status;
        const isNetworkError =
            status === 'FETCH_ERROR' ||
            status === 'TIMEOUT_ERROR' ||
            status === 'PARSING_ERROR';
        const isHttpError =
            typeof status === 'number' && status >= 400 && status !== 429;
        const shouldFallback = !!result.error && (isNetworkError || isHttpError);

        if (shouldFallback) {
            console.warn(`[GLOBAL API] Tenrai failed (status: ${status}), trying Jikan fallback for: ${endpoint}`);
            const fallbackResult = await apiLimiter.executeRequest(async () => {
                return fallbackQuery(args, api, extraOptions);
            });

            // If fallback succeeds, use its result
            if (!fallbackResult.error && fallbackResult.data) {
                console.log(`[GLOBAL API] Jikan fallback succeeded for: ${endpoint}`);
                result = fallbackResult;
            } else if (fallbackResult.error) {
                console.warn(`[GLOBAL API] Jikan fallback also failed for: ${endpoint}`, fallbackResult.error);
            }
        }

        // Store successful responses in global cache
        if (!result.error && result.data) {
            cache.set(cacheKey, {
                data: result.data,
                timestamp: Date.now(),
            });
            console.log(`[GLOBAL API] Cached result for: ${cacheKey}`);
        }

        // Return stale cache data on server or network errors as fallback
        const errStatus = result.error?.status;
        const isNetworkOrServerError =
            errStatus === 'FETCH_ERROR' ||
            errStatus === 'TIMEOUT_ERROR' ||
            errStatus === 'PARSING_ERROR' ||
            (typeof errStatus === 'number' && (errStatus as number) >= 500);

        if (isNetworkOrServerError) {
            const staleEntry = cache.get(cacheKey);
            if (staleEntry && isCacheStale(staleEntry.timestamp)) {
                console.warn(`[GLOBAL API] Returning stale cache for: ${cacheKey} (error: ${errStatus})`);
                return {
                    data: staleEntry.data,
                    meta: { isStale: true, originalError: result.error }
                };
            }
        }

        return result;
    };

    // Create the request promise and track it globally
    const requestPromise = executeRequest();
    ongoingRequests.set(cacheKey, requestPromise);

    try {
        const result = await requestPromise;
        return result;
    } finally {
        // Clean up the ongoing request tracking
        ongoingRequests.delete(cacheKey);
    }
};

export const jikanApi = createApi({
    reducerPath: 'jikanApi',
    baseQuery: baseQueryWithRateLimiting,
    endpoints: () => ({}),
    keepUnusedDataFor: 3600, // 1 hour
    refetchOnMountOrArgChange: 3600,
});