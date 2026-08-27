import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryReturnValue } from '@reduxjs/toolkit/query';
import i18n from '@/i18n';
import { apiLimiter } from './apiLimiter';

// Cache configuration - Tenrai API
const CACHE_TTL = 600 * 1000; // 10 minutes
const STALE_CACHE_TTL = 1800 * 1000; // 30 minutes - return stale data on server errors

// Global cache storage for all Tenrai API data
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
const RETRY_DELAY_429 = 4000; // 4 seconds before retry after 429 (Tenrai: 120 RPM, 4 RPS)
const RETRY_DELAY_5XX = 2000; // 2 seconds before retry after 5xx
const MAX_RETRIES = 3;
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const REQUEST_TIMEOUT_MS = 15000;

// Use proxy in browser (to avoid CORS / connection reset), direct on server
const isBrowser = typeof window !== 'undefined';
const getBaseUrl = () => {
    if (isBrowser) {
        return PROXY_BASE_URL;
    }
    return TENRAI_API_BASE_URL;
};

// Tenrai base query with internationalization headers
const baseQuery = fetchBaseQuery({
    baseUrl: getBaseUrl(),
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

// Global query function with Tenrai-specific error handling
const baseQueryWithTenraiHandling: BaseQueryFn<
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

    // Check global cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && isCacheValid(cachedResult.timestamp)) {
        return { data: cachedResult.data, meta: undefined as Record<string, unknown> | undefined };
    }

    // Check for ongoing identical requests (deduplication)
    if (ongoingRequests.has(cacheKey)) {
        try {
            const ongoingPromise = ongoingRequests.get(cacheKey);
            if (!ongoingPromise) {
                throw new Error('Unexpected missing ongoing request');
            }
            const result = await ongoingPromise;
            return result;
        } catch {
            ongoingRequests.delete(cacheKey);
        }
    }

    // Execute request through the rate limiter
    const executeRequest = async () => {
        // Process request through the rate limiter queue (Tenrai: 4 RPS, 120 RPM)
        let result = await apiLimiter.executeRequest(async () => {
            return baseQuery(args, api, extraOptions);
        });
        
        // Implement retry logic for 429 and 5xx with exponential backoff
        let retryCount = 0;
        while (retryCount < MAX_RETRIES && result.error?.status && RETRYABLE_STATUSES.has(result.error.status as number)) {
            const status = result.error.status as number;
            const delay = status === 429 
                ? RETRY_DELAY_429 * (retryCount + 1)
                : RETRY_DELAY_5XX * (retryCount + 1);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            
            result = await apiLimiter.executeRequest(async () => {
                return baseQuery(args, api, extraOptions);
            });
            
            retryCount++;
        }

        // Store successful responses in global cache
        if (!result.error && result.data) {
            cache.set(cacheKey, {
                data: result.data,
                timestamp: Date.now(),
            });
        }

        // Return stale cache data on server errors as fallback
        const errStatus = result.error?.status;
        const isServerError =
            errStatus === 'FETCH_ERROR' ||
            errStatus === 'TIMEOUT_ERROR' ||
            errStatus === 'PARSING_ERROR' ||
            (typeof errStatus === 'number' && (errStatus as number) >= 500);

        if (isServerError) {
            const staleEntry = cache.get(cacheKey);
            if (staleEntry && isCacheStale(staleEntry.timestamp)) {
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
        ongoingRequests.delete(cacheKey);
    }
};

export const tenraiApi = createApi({
    reducerPath: 'tenraiApi',
    baseQuery: baseQueryWithTenraiHandling,
    endpoints: () => ({}),
    keepUnusedDataFor: 3600,
    refetchOnMountOrArgChange: 3600,
});
