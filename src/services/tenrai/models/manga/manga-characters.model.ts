import type { TenraiImages } from '../common';

export interface MangaCharacter {
	character: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		name: string;
	};
	role: string;
}
