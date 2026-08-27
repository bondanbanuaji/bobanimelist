import { tenraiApi } from './baseApi';
import type {
    TenraiResponse, Anime, AnimeTopParams, SeasonNowParams, TenraiSeasonsParams,
    AnimeSearchParams, Genre, AnimeStaff, AnimeStreaming, AnimeEpisode,
    EpisodesParams, AnimeCharacter, AnimeVideos, AnimePicture,
    TenraiMoreInfo, TenraiRelation, AnimeTheme, TenraiExternalLink, TenraiNews
} from './models';

const AnimeEndpoints = {
    animeEpisodes: '/anime/{id}/episodes',
    animeEpisodeById: '/anime/{id}/episodes/{episode_id}',
    topAnime: '/top/anime',
    animeById: '/anime/{id}',
    animeFullById: '/anime/{id}/full',
    animeSeasonsNow: '/seasons/now',
    animeSeasonsUpcoming: '/seasons/upcoming',
    animeSearch: '/anime',
    animeRecommendations: '/anime/{id}/recommendations',
    animeStatistics: '/anime/{id}/statistics',
    animeReviews: '/anime/{id}/reviews',
    animeCharacters: '/anime/{id}/characters',
    animeStaff: '/anime/{id}/staff',
    animeStreaming: '/anime/{id}/streaming',
    animeVideos: '/anime/{id}/videos',
    animeEpisodeVideos: '/anime/{id}/videos/episodes',
    animePictures: '/anime/{id}/pictures',
    animeMoreInfo: '/anime/{id}/moreinfo',
    animeRelations: '/anime/{id}/relations',
    animeThemes: '/anime/{id}/themes',
    animeExternal: '/anime/{id}/external',
    animeNews: '/anime/{id}/news',
    animeArticles: '/anime/{id}/articles',
    animeForum: '/anime/{id}/forum',
    animeGenres: '/genres/anime',
    animeDeleted: '/anime/deleted',
    animeIds: '/anime/ids'
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

        getAnimeFullById: builder.query<TenraiResponse<Anime>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes for full anime data
        }),

        getAnimeVideos: builder.query<TenraiResponse<AnimeVideos>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeVideos.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes - videos rarely change
        }),

        getAnimeEpisodeVideos: builder.query<TenraiResponse<AnimeVideos>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeEpisodeVideos.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getAnimePictures: builder.query<TenraiResponse<AnimePicture[]>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animePictures.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes - pictures rarely change
        }),

        getAnimeMoreInfo: builder.query<TenraiResponse<TenraiMoreInfo>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeMoreInfo.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getAnimeRelations: builder.query<TenraiResponse<TenraiRelation[]>, { id: number; sfw?: boolean }>({
            query: ({ id, sfw = true }) => ({
                url: AnimeEndpoints.animeRelations.replace('{id}', String(id)),
                params: { sfw },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getAnimeThemes: builder.query<TenraiResponse<AnimeTheme>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeThemes.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getAnimeExternalLinks: builder.query<TenraiResponse<TenraiExternalLink[]>, { id: number }>({
            query: ({ id }) => ({
                url: AnimeEndpoints.animeExternal.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 60 * 24, // 24 hours
        }),

        getAnimeNews: builder.query<TenraiResponse<TenraiNews[]>, { id: number; page?: number }>({
            query: ({ id, page = 1 }) => ({
                url: AnimeEndpoints.animeNews.replace('{id}', String(id)),
                params: { page },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes - news updates frequently
        }),

        getAnimeArticles: builder.query<TenraiResponse<TenraiNews[]>, { id: number; page?: number }>({
            query: ({ id, page = 1 }) => ({
                url: AnimeEndpoints.animeArticles.replace('{id}', String(id)),
                params: { page },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes
        }),

        getAnimeForum: builder.query<TenraiResponse<TenraiNews[]>, { id: number; page?: number }>({
            query: ({ id, page = 1 }) => ({
                url: AnimeEndpoints.animeForum.replace('{id}', String(id)),
                params: { page },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes
        }),

        getAnimeEpisodeById: builder.query<TenraiResponse<AnimeEpisode>, { id: number; episodeId: number }>({
            query: ({ id, episodeId }) => ({
                url: AnimeEndpoints.animeEpisodeById.replace('{id}', String(id)).replace('{episode_id}', String(episodeId)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getDeletedAnime: builder.query<TenraiResponse<Anime[]>, { page?: number; limit?: number; order_by?: string; sort?: string }>({
            query: ({ page = 1, limit = 25, order_by = 'mal_id', sort = 'desc' }) => ({
                url: AnimeEndpoints.animeDeleted,
                params: { page, limit, order_by, sort },
            }),
            keepUnusedDataFor: 60 * 60, // 60 minutes
        }),

        getAnimeIds: builder.query<{ total: number; data: number[] }, { type?: string[]; status?: string; rating?: string[]; sfw?: boolean }>({
            query: (params) => ({
                url: AnimeEndpoints.animeIds,
                params,
            }),
            keepUnusedDataFor: 60 * 60 * 24, // 24 hours - IDs list changes slowly
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
    useGetAnimeFullByIdQuery,
    useGetAnimeVideosQuery,
    useGetAnimeEpisodeVideosQuery,
    useGetAnimePicturesQuery,
    useGetAnimeMoreInfoQuery,
    useGetAnimeRelationsQuery,
    useGetAnimeThemesQuery,
    useGetAnimeExternalLinksQuery,
    useGetAnimeNewsQuery,
    useGetAnimeArticlesQuery,
    useGetAnimeForumQuery,
    useGetAnimeEpisodeByIdQuery,
    useGetDeletedAnimeQuery,
    useGetAnimeIdsQuery,
} = animeApi;