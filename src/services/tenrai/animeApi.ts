import { tenraiApi } from './baseApi';
import type { TenraiResponse, Anime, AnimeTopParams, SeasonNowParams, TenraiSeasonsParams, AnimeSearchParams, Genre, AnimeStaff, AnimeStreaming, AnimeEpisode, EpisodesParams, AnimeCharacter } from './models';

const AnimeEndpoints = {
    animeEpisodes: '/anime/{id}/episodes',
    topAnime: '/top/anime',
    animeFullById: '/anime/{id}',
    animeSeasonsNow: '/seasons/now',
    animeSeasonsUpcoming: '/seasons/upcoming',
    animeSearch: '/anime',
    animeRecommendations: '/anime/{id}/recommendations',
    animeStatistics: '/anime/{id}/statistics',
    animeReviews: '/anime/{id}/reviews',
    animeCharacters: '/anime/{id}/characters',
    animeStaff: '/anime/{id}/staff',
    animeStreaming: '/anime/{id}/streaming',
    animeGenres: '/genres/anime'
} as const;

export const animeApi = tenraiApi.injectEndpoints({
    endpoints: (builder) => ({
        getTopAnime: builder.query<TenraiResponse<Anime[]>, AnimeTopParams>({
            query: ({ sfw = true, limit = 10, filter = 'bypopularity', type }) => {
                return {
                    url: AnimeEndpoints.topAnime,
                    params: {
                        sfw,
                        limit,
                        filter,
                        type
                    },
                };
            },
            // Set stale time to 5 minutes to avoid refetching too often
            keepUnusedDataFor: 60 * 5, // 5 minutes
        }),

        getAnimeById: builder.query<TenraiResponse<Anime>, { id: number; }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes for detailed anime data
        }),

        getAnimeSeasonsNow: builder.query<TenraiResponse<Anime[]>, SeasonNowParams>({
            query: ({ limit = 10, }) => {
                return {
                    url: AnimeEndpoints.animeSeasonsNow,
                    params: {
                        limit,
                    },
                };
            },
            keepUnusedDataFor: 60 * 10, // 10 minutes for seasonal data
        }),

        getAnimeSeasonsUpcoming: builder.query<TenraiResponse<Anime[]>, TenraiSeasonsParams>({
            query: ({ limit = 10 }) => {
                return {
                    url: AnimeEndpoints.animeSeasonsUpcoming,
                    params: {
                        limit
                    },
                };
            },
            keepUnusedDataFor: 60 * 10, // 10 minutes for seasonal data
        }),

        getAnimeSearch: builder.query<TenraiResponse<Anime[]>, AnimeSearchParams>({
            query: (data) => {
                return {
                    url: AnimeEndpoints.animeSearch,
                    params: data,
                };
            },
            keepUnusedDataFor: 60 * 5, // 5 minutes for search results
        }),

        // TODO: remove
        getAnimeGenres: builder.query<TenraiResponse<Genre[]>, void>({
            query: () => {
                return {
                    url: AnimeEndpoints.animeGenres
                };
            },
            keepUnusedDataFor: 60 * 60, // 60 minutes for genres (rarely change)
        }),
        
        getRandomAnime: builder.query<TenraiResponse<Anime[]>, { page?: number; limit?: number; sfw?: boolean; } | void>({
            query: (params) => {
                const { page = 1, limit = 10, sfw = true } = params || {};
                return {
                    url: AnimeEndpoints.animeSearch,
                    params: {
                        page,
                        limit,
                        sfw,
                        order_by: 'popularity', // Get popular anime and then shuffle on client
                        sort: 'desc'
                    },
                };
            },
            keepUnusedDataFor: 60 * 5, // 5 minutes for random anime
        }),

        getAnimeStaff: builder.query<TenraiResponse<AnimeStaff[]>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeStaff.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes - staff rarely changes
        }),

        getAnimeStreaming: builder.query<TenraiResponse<AnimeStreaming[]>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeStreaming.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes - streaming links rarely change
        }),

        getAnimeCharacters: builder.query<TenraiResponse<AnimeCharacter[]>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeCharacters.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes - characters rarely change
        }),

        getAnimeEpisodes: builder.query<TenraiResponse<AnimeEpisode[]>, { id: number } & EpisodesParams>({
            query: ({ id, page = 1, limit = 100 }) => ({
                url: AnimeEndpoints.animeEpisodes.replace('{id}', String(id)),
                params: { page, limit },
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes - episodes rarely change
        }),
    }),
});

export const {
    useGetTopAnimeQuery,
    useGetAnimeByIdQuery,
    useGetAnimeSeasonsNowQuery,
    useGetAnimeSeasonsUpcomingQuery,
    useGetAnimeSearchQuery,
    useGetAnimeGenresQuery,
    useGetRandomAnimeQuery,
    useGetAnimeStaffQuery,
    useGetAnimeStreamingQuery,
    useGetAnimeCharactersQuery,
    useGetAnimeEpisodesQuery,
} = animeApi;