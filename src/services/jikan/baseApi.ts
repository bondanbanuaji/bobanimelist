import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import i18n from '@/i18n';
import { apiLimiter } from './apiLimiter';

// Cache configuration - following requirements (5-10 minutes TTL)
const CACHE_TTL = 600 * 1000; // 10 minutes (maximum as per requirements)

// Global cache storage for all Jikan API data
const cache = new Map<string, { data: unknown; timestamp: number }>();
// Track ongoing requests globally to prevent duplicate requests
const ongoingRequests = new Map<string, Promise<{ data?: unknown; error?: FetchBaseQueryError }>>();

// Check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_TTL;
};

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';
const RETRY_DELAY = 3000; // 3 seconds before retry after 429

// Custom base query with internationalization headers
const baseQuery = fetchBaseQuery({
    baseUrl: JIKAN_API_BASE_URL,
    prepareHeaders: (headers) => {
        const currentLng = i18n.language;
        let acceptLanguageValue = 'en-US';

        if (currentLng === 'jp') acceptLanguageValue = 'ja-JP';
        else if (currentLng === 'id') acceptLanguageValue = 'id-ID';

        headers.set('Accept-Language', acceptLanguageValue);
        return headers;
    },
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
        return { data: cachedResult.data };
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
        
        // Implement retry logic only when 429 occurs
        if (result.error?.status === 429) {
            console.warn(`[GLOBAL API] 429 Too Many Requests for endpoint: ${endpoint}, waiting ${RETRY_DELAY}ms before retrying...`);
            
            // Wait before retry, but ensure this also goes through the rate limiter
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            
            result = await apiLimiter.executeRequest(async () => {
                return baseQuery(args, api, extraOptions);
            });
        }

        // Store successful responses in global cache
        if (!result.error && result.data) {
            cache.set(cacheKey, {
                data: result.data,
                timestamp: Date.now(),
            });
            console.log(`[GLOBAL API] Cached result for: ${cacheKey}`);
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