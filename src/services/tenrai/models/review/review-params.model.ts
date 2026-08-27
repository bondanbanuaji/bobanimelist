export interface ReviewsParams {
	page?: number;
	preliminary?: boolean; // Include ongoing reviews
	spoiler?: boolean;     // Include spoiler reviews
}

export type ReviewType = 'anime' | 'manga';
