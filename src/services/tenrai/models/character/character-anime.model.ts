import type { TenraiImages } from '../common';

export interface CharacterAnimeAppearance {
	role: string;
	anime: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}
