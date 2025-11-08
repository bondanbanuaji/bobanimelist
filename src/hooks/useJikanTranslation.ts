import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JikanTranslator } from '../utils/translateJikanData';

type DataType = 'anime' | 'manga' | 'character' | 'review';

interface UseJikanTranslationOptions {
  enabled?: boolean;
  dataType?: DataType;
}

/**
 * Custom hook untuk auto-translate Jikan API responses
 * 
 * @example
 * const { data: animeData } = useGetAnimeByIdQuery(id);
 * const translatedData = useJikanTranslation(animeData, { dataType: 'anime' });
 */
export function useJikanTranslation<T>(
  data: T | undefined,
  options: UseJikanTranslationOptions = {}
): T | undefined {
  const { i18n } = useTranslation();
  const { enabled = true, dataType = 'anime' } = options;
  const [translatedData, setTranslatedData] = useState<T | undefined>(data);

  useEffect(() => {
    // Jika disabled atau tidak ada data, return as-is
    if (!enabled || !data) {
      setTranslatedData(data);
      return;
    }

    // Jika bahasa English, tidak perlu translate
    const currentLang = i18n.language as 'en' | 'id' | 'jp';
    if (currentLang === 'en') {
      setTranslatedData(data);
      return;
    }

    // Lakukan translasi secara async
    const translateData = async () => {
      try {
        const translated = await JikanTranslator.translateJikanResponse(
          data,
          currentLang,
          dataType
        );
        setTranslatedData(translated);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useJikanTranslation] Translation error:', error);
        }
        // Fallback ke data original jika translation gagal
        setTranslatedData(data);
      }
    };

    translateData();
  }, [data, i18n.language, enabled, dataType]);

  return translatedData;
}

/**
 * Hook untuk translate anime list
 */
export function useAnimeListTranslation<T extends unknown[]>(
  animeList: T | undefined
): T | undefined {
  return useJikanTranslation(animeList, { dataType: 'anime' });
}

/**
 * Hook untuk translate manga list
 */
export function useMangaListTranslation<T extends unknown[]>(
  mangaList: T | undefined
): T | undefined {
  return useJikanTranslation(mangaList, { dataType: 'manga' });
}

/**
 * Hook untuk translate character data
 */
export function useCharacterTranslation<T>(
  character: T | undefined
): T | undefined {
  return useJikanTranslation(character, { dataType: 'character' });
}

/**
 * Hook untuk translate review data
 */
export function useReviewTranslation<T>(
  review: T | undefined
): T | undefined {
  return useJikanTranslation(review, { dataType: 'review' });
}
