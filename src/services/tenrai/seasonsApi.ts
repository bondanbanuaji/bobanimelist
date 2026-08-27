import { tenraiApi } from './baseApi';
import type { TenraiResponse, Anime, SeasonArchive } from './models';

const SeasonsEndpoints = {
	seasons: '/seasons',
	seasonNow: '/seasons/now',
	seasonUpcoming: '/seasons/upcoming',
} as const;

export const seasonsApi = tenraiApi.injectEndpoints({
	endpoints: (builder) => ({
		getSeasonsList: builder.query<TenraiResponse<SeasonArchive[]>, void>({
			query: () => ({
				url: SeasonsEndpoints.seasons,
			}),
			keepUnusedDataFor: 60 * 60 * 24, // 24 hours - season list rarely changes
		}),

		// Tenrai only supports /seasons/now and /seasons/upcoming
		// For current season, use /seasons/now
		getSeasonAnime: builder.query<TenraiResponse<Anime[]>, { page?: number; limit?: number; sfw?: boolean }>({
			query: ({ page = 1, limit = 10, sfw = true }) => ({
				url: SeasonsEndpoints.seasonNow,
				params: {
					page,
					limit,
					sfw,
				},
			}),
			keepUnusedDataFor: 60 * 10, // 10 minutes
		}),

		getSeasonUpcoming: builder.query<TenraiResponse<Anime[]>, { page?: number; limit?: number; sfw?: boolean }>({
			query: ({ page = 1, limit = 10, sfw = true }) => ({
				url: SeasonsEndpoints.seasonUpcoming,
				params: {
					page,
					limit,
					sfw,
				},
			}),
			keepUnusedDataFor: 60 * 10, // 10 minutes
		}),
	}),
});

export const {
	useGetSeasonsListQuery,
	useGetSeasonAnimeQuery,
	useGetSeasonUpcomingQuery,
} = seasonsApi;
