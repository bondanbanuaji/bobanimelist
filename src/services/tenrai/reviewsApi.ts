import { tenraiApi } from './baseApi';
import type { TenraiResponse, AnimeReview, MangaReview, ReviewsParams, ReviewType } from './models';

const ReviewsEndpoints = {
	animeReviews: '/anime/{id}/reviews',
	mangaReviews: '/manga/{id}/reviews',
	recentAnimeReviews: '/reviews/anime',
	recentMangaReviews: '/reviews/manga',
	topReviews: '/top/reviews',
} as const;

export const reviewsApi = tenraiApi.injectEndpoints({
	endpoints: (builder) => ({
		getAnimeReviews: builder.query<TenraiResponse<AnimeReview[]>, { id: number } & ReviewsParams>({
			query: ({ id, page = 1, preliminary = false, spoiler = false }) => ({
				url: ReviewsEndpoints.animeReviews.replace('{id}', String(id)),
				params: {
					page,
					...(preliminary && { preliminary: true }),
					...(spoiler && { spoiler: true }),
				},
			}),
			keepUnusedDataFor: 60 * 30, // 30 minutes
		}),

		getMangaReviews: builder.query<TenraiResponse<MangaReview[]>, { id: number } & ReviewsParams>({
			query: ({ id, page = 1, preliminary = false, spoiler = false }) => ({
				url: ReviewsEndpoints.mangaReviews.replace('{id}', String(id)),
				params: {
					page,
					...(preliminary && { preliminary: true }),
					...(spoiler && { spoiler: true }),
				},
			}),
			keepUnusedDataFor: 60 * 30, // 30 minutes
		}),

		getRecentAnimeReviews: builder.query<TenraiResponse<AnimeReview[]>, ReviewsParams | void>({
			query: (params) => ({
				url: ReviewsEndpoints.recentAnimeReviews,
				params: params ? {
					page: params.page || 1,
					...(params.preliminary && { preliminary: true }),
					...(params.spoiler && { spoiler: true }),
				} : { page: 1 },
			}),
			keepUnusedDataFor: 60 * 5, // 5 minutes - fresh content
		}),

		getRecentMangaReviews: builder.query<TenraiResponse<MangaReview[]>, ReviewsParams | void>({
			query: (params) => ({
				url: ReviewsEndpoints.recentMangaReviews,
				params: params ? {
					page: params.page || 1,
					...(params.preliminary && { preliminary: true }),
					...(params.spoiler && { spoiler: true }),
				} : { page: 1 },
			}),
			keepUnusedDataFor: 60 * 5, // 5 minutes - fresh content
		}),

		getTopReviews: builder.query<TenraiResponse<(AnimeReview | MangaReview)[]>, { type?: ReviewType; preliminary?: boolean; spoiler?: boolean; page?: number }>({
			query: ({ type, preliminary = false, spoiler = false, page = 1 }) => ({
				url: ReviewsEndpoints.topReviews,
				params: {
					page,
					...(type && { type }),
					...(preliminary && { preliminary: true }),
					...(spoiler && { spoiler: true }),
				},
			}),
			keepUnusedDataFor: 60 * 60, // 60 minutes - top reviews change slowly
		}),
	}),
});

export const {
	useGetAnimeReviewsQuery,
	useGetMangaReviewsQuery,
	useGetRecentAnimeReviewsQuery,
	useGetRecentMangaReviewsQuery,
	useGetTopReviewsQuery,
} = reviewsApi;
