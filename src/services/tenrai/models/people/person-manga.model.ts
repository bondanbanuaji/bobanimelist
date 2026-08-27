import type { TenraiImages } from '../common';

export interface PersonMangaWork {
	position: string;
	manga: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}
