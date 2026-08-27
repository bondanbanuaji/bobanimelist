import type { TenraiImages, TenraiImagesCollection } from '../common';

export interface AnimeVideos {
	promo: AnimePromoVideo[];
	episodes: AnimeEpisodeVideo[];
	music_videos: AnimeMusicVideo[];
}

export type AnimePromoVideo = {
	title: string;
	trailer: AnimeYoutubeVideo;
};

export interface AnimeYoutubeVideo {
	youtube_id: string;
	url: string;
	embed_url: string;
	images?: TenraiImagesCollection;
}

export interface AnimeEpisodeVideo {
	mal_id: number;
	url: string;
	title: string;
	episode: string;
	images: TenraiImages;
}

export interface AnimeMusicVideo {
	title: string;
	video: AnimeYoutubeVideo;
	meta: AnimeVideoMeta;
}

export interface AnimeVideoMeta {
	title: string;
	author: string;
}
