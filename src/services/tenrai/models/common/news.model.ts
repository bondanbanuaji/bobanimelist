import type { TenraiImages } from './image.model'

export interface TenraiNews {
	mal_id: number
	url: string
	title: string
	date: string
	author_username: string
	author_url: string
	forum_url: string
	images: TenraiImages
	comments: number
	excerpt: string
}
