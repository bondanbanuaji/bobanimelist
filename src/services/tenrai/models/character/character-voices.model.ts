import type { TenraiImages } from '../common';

export interface CharacterVoiceActorData {
	language: string;
	person: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		name: string;
	};
}
