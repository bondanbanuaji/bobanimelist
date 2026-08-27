import type { TenraiImages } from '../common';

export interface AnimeStaff {
	person: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		name: string;
	};
	positions: string[];
}

export interface AnimeStreaming {
	name: string;
	url: string;
}
