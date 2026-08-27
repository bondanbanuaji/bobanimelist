import type { TenraiImages } from './image.model';

export interface TenraiPerson {
	mal_id: number;
	url: string;
	images: TenraiImages;
	name: string,
	favorites: number;
	alternate_names?: string[];
	birthday?: string;
	about?: string;
}

export interface TenraiPersonFull extends TenraiPerson {
	anime: PersonAnime[];
	manga: PersonManga[];
	voices: PersonVoiceActor[];
}

export interface PersonAnime {
	position: string;
	anime: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}

export interface PersonManga {
	position: string;
	manga: {
		mal_id: number;
		url: string;
		images: TenraiImages;
		title: string;
	};
}

export interface PersonVoiceActor {
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
	role: string;
}