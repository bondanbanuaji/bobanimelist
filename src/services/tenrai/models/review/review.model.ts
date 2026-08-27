import type { TenraiImages } from '../common';

export interface Review {
	mal_id: number;
	url: string;
	type: 'anime' | 'manga';
	reactions: {
		overall: number;
		nice: number;
		love_it: number;
		funny: number;
		confusing: number;
		informative: number;
		well_written: number;
		creative: number;
	};
	date: string; // ISO8601
	review: string; // Review content
	score: number; // 1-10
	tags: string[]; // ["Recommended", "Funny", etc]
	is_spoiler: boolean;
	is_preliminary: boolean;
	episodes_watched?: number; // For anime only
	chapters_read?: number; // For manga only
	user: {
		username: string;
		url: string;
		images: TenraiImages;
	};
}

export interface AnimeReview extends Review {
	type: 'anime';
	episodes_watched?: number;
	entry?: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}

export interface MangaReview extends Review {
	type: 'manga';
	chapters_read?: number;
	entry?: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}
