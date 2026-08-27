import type { TenraiImages } from '../common';

export interface PersonAnimeWork {
	position: string;
	anime: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}
