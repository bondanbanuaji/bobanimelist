import type { AnimeType } from '../anime';
import type { MangaType } from '../manga';

type TopFilter = 'upcoming' | 'bypopularity' | 'favorite';

export type TopAnimeFilter = 'airing' | TopFilter;

export type TopMangaFilter = 'publishing' | TopFilter;

export interface TenraiTopParams {
	page?: number;
	limit?: number;
}

/**
 * QueryParams used in **getTopAnime** call
 *
 * See also: [Tenrai API Documentation](https://api.tenrai.org/documentation/#tag/top/operation/getTopAnime)
 */
export interface AnimeTopParams extends TenraiTopParams {
	type?: AnimeType;
	filter?: TopAnimeFilter;
	sfw?: boolean;
}

/**
 * QueryParams used in **getTopManga** call
 *
 * See also: [Tenrai API Documentation](https://api.tenrai.org/documentation/#tag/top/operation/getTopManga)
 */
export interface MangaTopParams extends TenraiTopParams {
	type?: MangaType;
	filter?: TopMangaFilter;
}
