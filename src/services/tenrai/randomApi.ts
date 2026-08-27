import { tenraiApi } from './baseApi';
import type { TenraiResponse, Anime } from './models';
import type { Manga } from './models/manga/manga.model';
import type { Character } from './models/character/character.model';
import type { TenraiPerson } from './models/common/person.model';

const RandomEndpoints = {
	randomAnime: '/random/anime',
	randomManga: '/random/manga',
	randomCharacter: '/random/characters',
	randomPeople: '/random/people',
} as const;

export const randomApi = tenraiApi.injectEndpoints({
	endpoints: (builder) => ({
		getRandomAnime: builder.query<TenraiResponse<Anime>, void>({
			query: () => ({
				url: RandomEndpoints.randomAnime,
			}),
			// Don't cache random results - always fresh
			keepUnusedDataFor: 0,
		}),

		getRandomManga: builder.query<TenraiResponse<Manga>, void>({
			query: () => ({
				url: RandomEndpoints.randomManga,
			}),
			keepUnusedDataFor: 0,
		}),

		getRandomCharacter: builder.query<TenraiResponse<Character>, void>({
			query: () => ({
				url: RandomEndpoints.randomCharacter,
			}),
			keepUnusedDataFor: 0,
		}),

		getRandomPeople: builder.query<TenraiResponse<TenraiPerson>, void>({
			query: () => ({
				url: RandomEndpoints.randomPeople,
			}),
			keepUnusedDataFor: 0,
		}),
	}),
});

export const {
	useLazyGetRandomAnimeQuery,
	useLazyGetRandomMangaQuery,
	useLazyGetRandomCharacterQuery,
	useLazyGetRandomPeopleQuery,
} = randomApi;
