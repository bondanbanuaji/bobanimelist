import type { TenraiImages } from '../common';

export interface CharacterMangaAppearance {
	role: string;
	manga: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}
