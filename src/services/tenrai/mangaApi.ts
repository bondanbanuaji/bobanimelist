import { tenraiApi } from './baseApi';
import type {
    Genre, TenraiResponse, Manga, MangaSearchParams, MangaTopParams,
    MangaCharacter, MangaStatistics, MangaRecommendation, MangaPicture,
    TenraiMoreInfo, TenraiRelation, TenraiExternalLink, TenraiNews
} from './models';

const MangaEndpoints = {
    topManga: '/top/manga',
    mangaById: '/manga/{id}',
    mangaFullById: '/manga/{id}/full',
    mangaGenres: '/genres/manga',
    mangaSearch: '/manga',
    mangaCharacters: '/manga/{id}/characters',
    mangaStatistics: '/manga/{id}/statistics',
    mangaRecommendations: '/manga/{id}/recommendations',
    mangaPictures: '/manga/{id}/pictures',
    mangaMoreInfo: '/manga/{id}/moreinfo',
    mangaRelations: '/manga/{id}/relations',
    mangaExternal: '/manga/{id}/external',
    mangaNews: '/manga/{id}/news',
    mangaArticles: '/manga/{id}/articles',
    mangaDeleted: '/manga/deleted',
    mangaIds: '/manga/ids'
} as const;

export const mangaApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getTopManga: builder.query<TenraiResponse<Manga[]>, MangaTopParams>({
            query: ({ limit = 10, filter = 'bypopularity', type }) => {
                return {
                    url: MangaEndpoints.topManga,
                    params: {
                        limit,
                        filter,
                        type
                    },
                };
            },
            // Set stale time to 5 minutes to avoid refetching too often
            keepUnusedDataFor: 60 * 5, // 5 minutes
        }),

        getMangaById: builder.query<TenraiResponse<Manga>, { id: number; }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes for detailed manga data
        }),

        getMangaGenres: builder.query<TenraiResponse<Genre[]>, void>({
            query: () => {
                return {
                    url: MangaEndpoints.mangaGenres
                };
            },
            keepUnusedDataFor: 60 * 60, // 60 minutes for genres (rarely change)
        }),

        getMangaSearch: builder.query<TenraiResponse<Manga[]>, MangaSearchParams>({
            query: (data) => {
                return {
                    url: MangaEndpoints.mangaSearch,
                    params: data,
                };
            },
            keepUnusedDataFor: 60 * 5, // 5 minutes for search results
        }),

        getMangaCharacters: builder.query<TenraiResponse<MangaCharacter[]>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaCharacters.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getMangaStatistics: builder.query<TenraiResponse<MangaStatistics>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaStatistics.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes - statistics update more frequently
        }),

        getMangaRecommendations: builder.query<TenraiResponse<MangaRecommendation[]>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaRecommendations.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getMangaPictures: builder.query<TenraiResponse<MangaPicture[]>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaPictures.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes - pictures rarely change
        }),

        getMangaFullById: builder.query<TenraiResponse<Manga>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes for full manga data
        }),

        getMangaMoreInfo: builder.query<TenraiResponse<TenraiMoreInfo>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaMoreInfo.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getMangaRelations: builder.query<TenraiResponse<TenraiRelation[]>, { id: number; sfw?: boolean }>({
            query: ({ id, sfw = true }) => ({
                url: MangaEndpoints.mangaRelations.replace('{id}', String(id)),
                params: { sfw },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getMangaExternalLinks: builder.query<TenraiResponse<TenraiExternalLink[]>, { id: number }>({
            query: ({ id }) => ({
                url: MangaEndpoints.mangaExternal.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60 * 24, // 24 hours
        }),

        getMangaNews: builder.query<TenraiResponse<TenraiNews[]>, { id: number; page?: number }>({
            query: ({ id, page = 1 }) => ({
                url: MangaEndpoints.mangaNews.replace('{id}', String(id)),
                params: { page },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes
        }),

        getMangaArticles: builder.query<TenraiResponse<TenraiNews[]>, { id: number; page?: number }>({
            query: ({ id, page = 1 }) => ({
                url: MangaEndpoints.mangaArticles.replace('{id}', String(id)),
                params: { page },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes
        }),

        getDeletedManga: builder.query<TenraiResponse<Manga[]>, { page?: number; limit?: number; order_by?: string; sort?: string }>({
            query: ({ page = 1, limit = 25, order_by = 'mal_id', sort = 'desc' }) => ({
                url: MangaEndpoints.mangaDeleted,
                params: { page, limit, order_by, sort },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getMangaIds: builder.query<{ total: number; data: number[] }, { type?: string[]; status?: string; rating?: string[]; sfw?: boolean }>({
            query: (params) => ({
                url: MangaEndpoints.mangaIds,
                params,
            }),
            keepUnusedDataFor: 60 * 60 * 24, // 24 hours
        }),
    }),
});

export const {
    useGetTopMangaQuery,
    useGetMangaByIdQuery,
    useGetMangaGenresQuery,
    useGetMangaSearchQuery,
    useGetMangaCharactersQuery,
    useGetMangaStatisticsQuery,
    useGetMangaRecommendationsQuery,
    useGetMangaPicturesQuery,
    useGetMangaFullByIdQuery,
    useGetMangaMoreInfoQuery,
    useGetMangaRelationsQuery,
    useGetMangaExternalLinksQuery,
    useGetMangaNewsQuery,
    useGetMangaArticlesQuery,
    useGetDeletedMangaQuery,
    useGetMangaIdsQuery,
} = mangaApi;