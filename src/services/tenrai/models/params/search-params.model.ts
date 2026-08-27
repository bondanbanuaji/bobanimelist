import type { AnimeRating, AnimeType } from '../anime';
import type { MangaType } from '../manga';

export type SortOptions = 'asc' | 'desc';

export type SearchOrder =
	| 'mal_id'
	| 'title'
	| 'start_date'
	| 'end_date'
	| 'score'
	| 'scored_by'
	| 'rank'
	| 'popularity'
	| 'members'
	| 'favorites';

export type AnimeSearchOrder = 'type' | 'episodes' | SearchOrder;

export type AnimeSearchStatus = 'airing' | 'complete' | 'upcoming';

export type MangaSearchOrder = 'chapters' | 'volumes' | SearchOrder;

export type MangaSearchStatus =
	| 'publishing'
	| 'complete'
	| 'hiatus'
	| 'discontinued'
	| 'upcoming';

export interface TenraiSearchParams {
	q?: string;
	page?: number;
	limit?: number;
	score?: number;
	min_score?: number;
	max_score?: number;
	sfw?: boolean;
	genres?: string;
	genres_exclude?: string;
	sort?: SortOptions;
	letter?: string;
	producers?: string;
	start_date?: string;
	end_date?: string;
	unapproved?: boolean;
}

/**
 * QueryParams used in **getMangaSearch** call
 *
 * See also: [Tenrai API Documentation](https://api.tenrai.org/documentation/#tag/manga/operation/getMangaSearch)
 */
export interface MangaSearchParams extends TenraiSearchParams {
	type?: MangaType;
	status?: MangaSearchStatus;
	order_by?: MangaSearchOrder;
	magazines?: string;
}

/**
 * QueryParams used in **getAnimeSearch** call
 *
 * See also: [Tenrai API Documentation](https://api.tenrai.org/documentation/#tag/anime/operation/getAnimeSearch)
 */
export interface AnimeSearchParams extends TenraiSearchParams {
	type?: AnimeType;
	status?: AnimeSearchStatus;
	rating?: AnimeRating;
	order_by?: AnimeSearchOrder;
}
