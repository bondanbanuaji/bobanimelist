import { jikanApi } from './baseApi';
import type { JikanResponse, Anime, SeasonArchive, SeasonParams } from './models';

const SeasonsEndpoints = {
	seasons: '/seasons',
	seasonAnime: '/seasons/{year}/{season}',
} as const;

export const seasonsApi = jikanApi.injectEndpoints({
	endpoints: (builder) => ({
		getSeasonsList: builder.query<JikanResponse<SeasonArchive[]>, void>({
			query: () => ({
				url: SeasonsEndpoints.seasons,
			}),
			keepUnusedDataFor: 60 * 60 * 24, // 24 hours - season list rarely changes
		}),

		getSeasonAnime: builder.query<JikanResponse<Anime[]>, SeasonParams>({
			query: ({ year, season, filter, sfw = true, unapproved, continuing, page = 1, limit = 10 }) => ({
				url: SeasonsEndpoints.seasonAnime.replace('{year}', String(year)).replace('{season}', season),
				params: {
					filter,
					sfw,
					unapproved,
					continuing,
					page,
					limit,
				},
			}),
			keepUnusedDataFor: 60 * 10, // 10 minutes
		}),
	}),
});

export const {
	useGetSeasonsListQuery,
	useGetSeasonAnimeQuery,
} = seasonsApi;
