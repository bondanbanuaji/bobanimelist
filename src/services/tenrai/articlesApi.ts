import { tenraiApi } from './baseApi';
import type { TenraiResponse, TenraiNews } from './models';

const ArticlesEndpoints = {
    articles: '/articles',
    articlesTags: '/articles/tags',
    articleById: '/articles/{id}'
} as const;

export const articlesApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getArticles: builder.query<TenraiResponse<TenraiNews[]>, { page?: number; limit?: number; q?: string }>({
            query: ({ page = 1, limit = 25, q }) => ({
                url: ArticlesEndpoints.articles,
                params: { page, limit, ...(q && { q }) },
            }),
            keepUnusedDataFor: 60 * 5, // 5 minutes
        }),

        getArticlesTags: builder.query<TenraiResponse<{ name: string; count: number }[]>, void>({
            query: () => ({
                url: ArticlesEndpoints.articlesTags,
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getArticleById: builder.query<TenraiResponse<TenraiNews>, { id: number }>({
            query: ({ id }) => ({
                url: ArticlesEndpoints.articleById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),
    }),
});

export const { useGetArticlesQuery, useGetArticlesTagsQuery, useGetArticleByIdQuery } = articlesApi;