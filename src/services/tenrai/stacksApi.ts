import { tenraiApi } from './baseApi';
import type { TenraiResponse } from './models';

interface StackEntry {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
    type: 'anime' | 'manga';
}

interface Stack {
    mal_id: number;
    name: string;
    url: string;
    description: string;
    tags: string[];
    is_public: boolean;
    created_at: string;
    updated_at: string;
    entries: StackEntry[];
}

const StacksEndpoints = {
    stacks: '/stacks',
    stackById: '/stacks/{id}'
} as const;

export const stacksApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getStacks: builder.query<TenraiResponse<Stack[]>, { page?: number; limit?: number; q?: string }>({
            query: ({ page = 1, limit = 25, q }) => ({
                url: StacksEndpoints.stacks,
                params: { page, limit, ...(q && { q }) },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getStackById: builder.query<TenraiResponse<Stack>, { id: number }>({
            query: ({ id }) => ({
                url: StacksEndpoints.stackById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),
    }),
});

export const { useGetStacksQuery, useGetStackByIdQuery } = stacksApi;