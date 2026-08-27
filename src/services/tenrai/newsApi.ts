import { tenraiApi } from './baseApi';
import type { TenraiResponse, TenraiNews } from './models';

const NewsEndpoints = {
    news: '/news',
    newsTags: '/news/tags',
    newsById: '/news/{id}'
} as const;

export const newsApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getNews: builder.query<TenraiResponse<TenraiNews[]>, { page?: number; limit?: number; q?: string }>({
            query: ({ page = 1, limit = 25, q }) => ({
                url: NewsEndpoints.news,
                params: { page, limit, ...(q && { q }) },
            }),
            keepUnusedDataFor: 60 * 5, // 5 minutes - news updates frequently
        }),

        getNewsTags: builder.query<TenraiResponse<{ name: string; count: number }[]>, void>({
            query: () => ({
                url: NewsEndpoints.newsTags,
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getNewsById: builder.query<TenraiResponse<TenraiNews>, { id: number }>({
            query: ({ id }) => ({
                url: NewsEndpoints.newsById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),
    }),
});

export const { useGetNewsQuery, useGetNewsTagsQuery, useGetNewsByIdQuery } = newsApi;