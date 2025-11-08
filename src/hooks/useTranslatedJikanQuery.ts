import { useJikanTranslation } from './useJikanTranslation';

/**
 * Wrapper hook untuk auto-translate hasil query Jikan API
 * Simplifies the pattern of fetching + translating
 * 
 * @example
 * const { data, isLoading } = useGetAnimeByIdQuery(id);
 * const translatedData = useTranslatedAnime(data);
 */

export function useTranslatedAnime<T>(data: T | undefined): T | undefined {
  return useJikanTranslation(data, { dataType: 'anime' });
}

export function useTranslatedManga<T>(data: T | undefined): T | undefined {
  return useJikanTranslation(data, { dataType: 'manga' });
}

export function useTranslatedCharacter<T>(data: T | undefined): T | undefined {
  return useJikanTranslation(data, { dataType: 'character' });
}

export function useTranslatedReview<T>(data: T | undefined): T | undefined {
  return useJikanTranslation(data, { dataType: 'review' });
}
