import { tenraiApi } from './baseApi';
import type { Genre, TenraiResponse, Manga, MangaSearchParams, MangaTopParams, MangaCharacter, MangaStatistics, MangaRecommendation, MangaPicture } from './models';

const MangaEndpoints = {
    topManga: '/top/manga',
    mangaFullById: '/manga/{id}',
    mangaGenres: '/genres/manga',
    mangaSearch: '/manga',
    mangaCharacters: '/manga/{id}/characters',
    mangaStatistics: '/manga/{id}/statistics',
    mangaRecommendations: '/manga/{id}/recommendations',
    mangaPictures: '/manga/{id}/pictures',
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
} = mangaApi;