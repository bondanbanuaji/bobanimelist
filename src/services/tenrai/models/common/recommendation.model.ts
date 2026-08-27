import type { TenraiImages } from './image.model'

export interface Recommendation {
	entry: RecommendationEntry
}

export interface RecommendationEntry {
	mal_id: number
	url: string
	images: TenraiImages
	title: string
}
