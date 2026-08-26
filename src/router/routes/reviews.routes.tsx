import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const ReviewsPage = lazy(() => import('../../pages/reviews-page'));
const TopReviewsPage = lazy(() => import('../../pages/top-reviews-page'));

export const reviewsRoutes: RouteObject[] = [
	{
		path: 'reviews',
		element: <ReviewsPage />,
	},
	{
		path: 'top/reviews',
		element: <TopReviewsPage />,
	},
];
