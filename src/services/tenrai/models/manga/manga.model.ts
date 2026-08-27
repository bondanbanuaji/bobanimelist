import type {
	TenraiImages,
	TenraiNamedResource,
	TenraiResource,
	TenraiResourcePeriod,
	TenraiResourceRelation,
	TenraiResourceTitle
} from '../common';

export interface Manga {
	mal_id: number;
	url: string;
	images: TenraiImages;
	approved: boolean;
	titles: TenraiResourceTitle[];
	title: string;
	title_english?: string;
	title_japanese: string;
	title_synonyms?: string[];
	type: MangaType;
	chapters: number;
	volumes: number;
	status: MangaStatus;
	publishing: boolean;
	published: TenraiResourcePeriod;
	score: number | null;
	scored_by: number;
	rank: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis: string;
	background: string;
	authors: TenraiResource[];
	serializations: TenraiResource[];
	genres: TenraiResource[];
	explicit_genres: TenraiResource[];
	themes: TenraiResource[];
	demographics: TenraiResource[];
	relations?: TenraiResourceRelation[];
	external?: TenraiNamedResource[];
}

export type MangaType =
	| 'Manga'
	| 'Novel'
	| 'Lightnovel'
	| 'Oneshot'
	| 'Doujin'
	| 'Manhwa'
	| 'Manhua';
export type MangaStatus =
	| 'Publishing'
	| 'Complete'
	| 'On Hiatus'
	| 'Discontinued'
	| 'Upcoming';
