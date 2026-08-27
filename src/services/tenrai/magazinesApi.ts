import { tenraiApi } from './baseApi';
import type { TenraiResponse } from './models';
import type { Magazine, MagazineSearchParams } from './models/magazine/magazine.model';

const MagazinesEndpoints = {
    magazines: '/magazines'
} as const;

export const magazinesApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getMagazines: builder.query<TenraiResponse<Magazine[]>, MagazineSearchParams>({
            query: ({ page = 1, limit = 25, q, order_by = 'mal_id', sort = 'asc', letter }) => ({
                url: MagazinesEndpoints.magazines,
                params: { page, limit, ...(q && { q }), order_by, sort, ...(letter && { letter }) },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),
    }),
});

export const { useGetMagazinesQuery } = magazinesApi;