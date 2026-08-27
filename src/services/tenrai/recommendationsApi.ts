import { tenraiApi } from './baseApi';
import type { TenraiResponse, Recommendation } from './models';

const RecommendationsEndpoints = {
    animeRecommendations: '/recommendations/anime',
    mangaRecommendations: '/recommendations/manga'
} as const;

export const recommendationsApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnimeRecommendations: builder.query<TenraiResponse<Recommendation[]>, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 25 }) => ({
                url: RecommendationsEndpoints.animeRecommendations,
                params: { page, limit },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getGeneralMangaRecommendations: builder.query<TenraiResponse<Recommendation[]>, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 25 }) => ({
                url: RecommendationsEndpoints.mangaRecommendations,
                params: { page, limit },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),
    }),
});

export const { useGetAnimeRecommendationsQuery, useGetGeneralMangaRecommendationsQuery } = recommendationsApi;