import type { AnimeType } from '../anime';

export interface TenraiSeasonsParams {
	page?: number;
	limit?: number;
	filter?: AnimeType;
}

/**
 * QueryParams used in **getSeasonNow** call
 */
export type SeasonNowParams = Omit<TenraiSeasonsParams, 'filter'>;
