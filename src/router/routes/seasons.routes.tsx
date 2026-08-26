import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const SeasonsPage = lazy(() => import('../../pages/seasons-page'));

export const seasonsRoutes: RouteObject[] = [
	{
		path: 'seasons',
		element: <SeasonsPage />,
	},
];
