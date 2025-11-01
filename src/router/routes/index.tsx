import type { RouteObject } from 'react-router';
import { animeRoutes } from './anime.routes';
import { AppLayout } from '../../layouts/app-layout';
import { mangaRoutes } from './manga.routes';
import { ErrorPage } from '../../pages/error-page';
import { entityRoutes } from './entity.routes';
import { searchRoutes } from './search.routes';
import React from 'react';

const HomePage = React.lazy(() => import('../../pages/home-page'));

// Definisikan child routes utama sekali saja
const mainChildRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  animeRoutes,
  mangaRoutes,
  entityRoutes,
  searchRoutes,
  // Rute 404 untuk child
  {
    path: '*',
    element: <ErrorPage is404 />,
  }
];

// Rute untuk bahasa spesifik ID
const idRoutes: RouteObject = {
  path: 'id',
  element: <AppLayout />,
  errorElement: <ErrorPage isRoot />,
  children: mainChildRoutes,
};

// Rute untuk bahasa spesifik JP
const jpRoutes: RouteObject = {
  path: 'jp',
  element: <AppLayout />,
  errorElement: <ErrorPage isRoot />,
  children: mainChildRoutes,
};

// Rute root untuk default (tanpa awalan)
const defaultRoutes: RouteObject = {
  path: '', // Path root
  element: <AppLayout />,
  errorElement: <ErrorPage isRoot />,
  children: mainChildRoutes,
};

// Rute catch-all 404 global
const notFoundRoute: RouteObject = {
  path: '*',
  element: <ErrorPage is404 />,
};

// Gabungkan rute dalam urutan: spesifik dulu, lalu default, lalu catch-all
// Urutan penting di react-router!
export const routes: RouteObject[] = [
  idRoutes,         // /id/*
  jpRoutes,         // /jp/*
  defaultRoutes,    // / (dan semua child tanpa awalan)
  notFoundRoute     // *
];