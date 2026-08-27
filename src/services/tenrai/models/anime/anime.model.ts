import type {
	TenraiImages,
	TenraiNamedResource,
	TenraiResource,
	TenraiResourcePeriod,
	TenraiResourceRelation,
	TenraiResourceTitle
} from '../common';
import type { AnimeYoutubeVideo } from './anime-video.model';

export interface Anime {
	mal_id: number;
	url: string;
	images: TenraiImages;
	trailer: AnimeYoutubeVideo;
	approved: boolean;
	titles: TenraiResourceTitle[];
	title: string;
	title_english?: string;
	title_japanese: string;
	title_synonyms: string[];
	type: AnimeType;
	source: string;
	episodes: number;
	status: AnimeStatus;
	airing: boolean;
	aired: TenraiResourcePeriod;
	duration: string;
	rating: AnimeRating;
	score: number | null;
	scored_by: number;
	rank: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis?: string;
	background: string;
	season?: AnimeSeason;
	year: number;
	broadcast: AnimeBroadcast;
	producers: TenraiResource[];
	licensors: TenraiResource[];
	studios: TenraiResource[];
	genres: TenraiResource[];
	explicit_genres: TenraiResource[];
	themes: TenraiResource[];
	demographics: TenraiResource[];
	relations?: TenraiResourceRelation[];
	theme?: AnimeTheme;
	external?: TenraiNamedResource[];
	streaming: TenraiNamedResource[];
}

export interface AnimeBroadcast {
	day: string;
	time: string;
	timezone: string;
	string: string;
}

export interface AnimeTheme {
	openings: string[];
	endings: string[];
}

export type AnimeType = 'TV' | 'Movie' | 'Ova' | 'Special' | 'Ona' | 'Music';
export type AnimeStatus =
	| 'Finished Airing'
	| 'Currently Airing'
	| 'Complete'
	| 'Not yet aired';
export type AnimeRating = 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
export type AnimeSeason = 'spring' | 'summer' | 'fall' | 'winter';
