import { tenraiApi } from './baseApi';
import type { TenraiResponse } from './models';
import type { Producer } from './models/producer/producer.model';

const ProducersEndpoints = {
    producers: '/producers',
    producerById: '/producers/{id}',
    producerFullById: '/producers/{id}/full',
    producerExternal: '/producers/{id}/external',
    producersIds: '/producers/ids'
} as const;

export const producersApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducers: builder.query<TenraiResponse<Producer[]>, { page?: number; limit?: number; q?: string; order_by?: string; sort?: string }>({
            query: ({ page = 1, limit = 25, q, order_by = 'mal_id', sort = 'asc' }) => ({
                url: ProducersEndpoints.producers,
                params: { page, limit, ...(q && { q }), order_by, sort },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getProducerById: builder.query<TenraiResponse<Producer>, { id: number }>({
            query: ({ id }) => ({
                url: ProducersEndpoints.producerById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getProducerFullById: builder.query<TenraiResponse<Producer>, { id: number }>({
            query: ({ id }) => ({
                url: ProducersEndpoints.producerFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getProducerExternalLinks: builder.query<TenraiResponse<{ name: string; url: string }[]>, { id: number }>({
            query: ({ id }) => ({
                url: ProducersEndpoints.producerExternal.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60 * 24, // 24 hours
        }),

        getProducerIds: builder.query<{ total: number; data: number[] }, void>({
            query: () => ({
                url: ProducersEndpoints.producersIds,
            }),
            keepUnusedDataFor: 60 * 60 * 24, // 24 hours
        }),
    }),
});

export const {
    useGetProducersQuery,
    useGetProducerByIdQuery,
    useGetProducerFullByIdQuery,
    useGetProducerExternalLinksQuery,
    useGetProducerIdsQuery,
} = producersApi;