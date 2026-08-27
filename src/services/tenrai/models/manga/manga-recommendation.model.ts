import type { TenraiImages } from '../common';

export interface MangaRecommendation {
	entry: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
	url: string;
	votes: number;
}
