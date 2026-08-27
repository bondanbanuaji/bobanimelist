import type { TenraiImages } from '../common';

export interface PersonVoiceRole {
	role: string;
	anime: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
	character: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		name: string;
	};
}
