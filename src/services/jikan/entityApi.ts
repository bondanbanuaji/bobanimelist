import { jikanApi } from './baseApi';
import type { Character, CharacterFull, CharactersSearchParams, JikanPerson, JikanPersonFull, JikanResponse, PeopleSearchParams, CharacterAnimeAppearance, CharacterMangaAppearance, CharacterVoiceActorData, PersonAnimeWork, PersonMangaWork, PersonVoiceRole } from './models';

const EntityEndpoints = {
    topPeople: '/top/people',
    topCharacters: '/top/characters',
    characterFullById: '/characters/{id}/full',
    personFullById: '/people/{id}/full',
    characterSearch: '/characters',
    peopleSearch: '/people',
    characterAnime: '/characters/{id}/anime',
    characterManga: '/characters/{id}/manga',
    characterVoices: '/characters/{id}/voices',
    personAnime: '/people/{id}/anime',
    personManga: '/people/{id}/manga',
    personVoices: '/people/{id}/voices',
} as const;

export const entityApi = jikanApi.injectEndpoints({
    endpoints: (builder) => ({
        getTopPeople: builder.query<JikanResponse<JikanPerson[]>, { limit?: number; }>({
            query: ({ limit = 15 }) => {
                return {
                    url: EntityEndpoints.topPeople,
                    params: {
                        limit,
                    },
                };
            },
            // Set stale time to 5 minutes to avoid refetching too often
            keepUnusedDataFor: 60 * 5, // 5 minutes
        }),

        getTopCharacters: builder.query<JikanResponse<Character[]>, { limit?: number; }>({
            query: ({ limit = 15, }) => {
                return {
                    url: EntityEndpoints.topCharacters,
                    params: {
                        limit,
                    },
                };
            },
            // Set stale time to 5 minutes to avoid refetching too often
            keepUnusedDataFor: 60 * 5, // 5 minutes
        }),

        getCharacterById: builder.query<JikanResponse<CharacterFull>, { id: number; }>({
            query: ({ id }) => ({
                url: EntityEndpoints.characterFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes for detailed character data
        }),


        getPersonById: builder.query<JikanResponse<JikanPersonFull>, { id: number; }>({
            query: ({ id }) => ({
                url: EntityEndpoints.personFullById.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes for detailed person data
        }),

        getCharacterSearch: builder.query<JikanResponse<Character[]>, CharactersSearchParams>({
            query: (params) => {
                return {
                    url: EntityEndpoints.characterSearch,
                    params
                };
            },
            keepUnusedDataFor: 60 * 5, // 5 minutes for search results
        }),

        getPeopleSearch: builder.query<JikanResponse<JikanPerson[]>, PeopleSearchParams>({
            query: (params) => {
                return {
                    url: EntityEndpoints.peopleSearch,
                    params
                };
            },
            keepUnusedDataFor: 60 * 5, // 5 minutes for search results
        }),

        getCharacterAnime: builder.query<JikanResponse<CharacterAnimeAppearance[]>, { id: number }>({
            query: ({ id }) => ({
                url: EntityEndpoints.characterAnime.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getCharacterManga: builder.query<JikanResponse<CharacterMangaAppearance[]>, { id: number }>({
            query: ({ id }) => ({
                url: EntityEndpoints.characterManga.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getCharacterVoices: builder.query<JikanResponse<CharacterVoiceActorData[]>, { id: number }>({
            query: ({ id }) => ({
                url: EntityEndpoints.characterVoices.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getPersonAnime: builder.query<JikanResponse<PersonAnimeWork[]>, { id: number }>({
            query: ({ id }) => ({
                url: EntityEndpoints.personAnime.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getPersonManga: builder.query<JikanResponse<PersonMangaWork[]>, { id: number }>({
            query: ({ id }) => ({
                url: EntityEndpoints.personManga.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),

        getPersonVoices: builder.query<JikanResponse<PersonVoiceRole[]>, { id: number }>({
            query: ({ id }) => ({
                url: EntityEndpoints.personVoices.replace('{id}', String(id)),
            }),
            keepUnusedDataFor: 60 * 30, // 30 minutes
        }),
    }),
});

export const {
    useGetTopCharactersQuery,
    useGetTopPeopleQuery,
    useGetCharacterByIdQuery,
    useGetPersonByIdQuery,
    useGetCharacterSearchQuery,
    useGetPeopleSearchQuery,
    useGetCharacterAnimeQuery,
    useGetCharacterMangaQuery,
    useGetCharacterVoicesQuery,
    useGetPersonAnimeQuery,
    useGetPersonMangaQuery,
    useGetPersonVoicesQuery,
} = entityApi;