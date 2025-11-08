import { TranslationCache } from './translationCache';

// Menggunakan LibreTranslate API (open-source, self-hosted atau public instance)
// Atau bisa diganti dengan Google Translate API / DeepL
const TRANSLATION_API_URL = 'https://libretranslate.com/translate';

// Map locale ke language code
const LOCALE_TO_LANG_CODE: Record<string, string> = {
  'en': 'en',
  'id': 'id',
  'jp': 'ja'
};

// Rate limiting untuk API calls
class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private lastCallTime = 0;
  private readonly minInterval = 100; // 100ms between calls

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;
      
      if (timeSinceLastCall < this.minInterval) {
        await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall));
      }
      
      const fn = this.queue.shift();
      if (fn) {
        await fn();
        this.lastCallTime = Date.now();
      }
    }
    
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter();

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;
  
  // Jika target language adalah english, return as-is (API Jikan default English)
  if (targetLang === 'en') return text;

  // Check cache first
  const cached = await TranslationCache.get(text, targetLang);
  if (cached) return cached;

  try {
    // Gunakan LibreTranslate API
    const response = await rateLimiter.add(() => 
      fetch(TRANSLATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: LOCALE_TO_LANG_CODE[targetLang] || targetLang,
          format: 'text'
        })
      })
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.translatedText || text;

    // Cache hasil translasi
    await TranslationCache.set(text, translated, targetLang);

    return translated;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[TranslateJikanData] Translation error:', error);
    }
    // Fallback to original text jika translation gagal
    return text;
  }
}

// Helper untuk translate object dengan nested fields
async function translateObject<T extends Record<string, unknown>>(
  obj: T,
  targetLang: string,
  fieldsToTranslate: string[]
): Promise<T> {
  if (!obj) return obj;
  
  const translated = { ...obj } as Record<string, unknown>;
  
  for (const field of fieldsToTranslate) {
    if (field in translated && typeof translated[field] === 'string') {
      translated[field] = await translateText(translated[field] as string, targetLang);
    }
  }
  
  return translated as T;
}

// Helper untuk translate array of objects
async function translateArray<T extends Record<string, unknown>>(
  arr: T[],
  targetLang: string,
  fieldsToTranslate: string[]
): Promise<T[]> {
  if (!arr || arr.length === 0) return arr;
  
  return Promise.all(
    arr.map(item => translateObject(item, targetLang, fieldsToTranslate))
  );
}

export class JikanTranslator {
  // Translate anime data
  static async translateAnime(anime: Record<string, unknown>, targetLang: 'id' | 'jp' | 'en'): Promise<Record<string, unknown>> {
    if (targetLang === 'en' || !anime) return anime;

    const fieldsToTranslate = ['title', 'title_english', 'title_japanese', 'synopsis', 'background'];
    const translated = await translateObject(anime, targetLang, fieldsToTranslate) as Record<string, unknown>;

    // Translate nested arrays
    if (anime.genres && Array.isArray(anime.genres)) {
      translated.genres = await translateArray(anime.genres as Record<string, unknown>[], targetLang, ['name']);
    }
    if (anime.themes && Array.isArray(anime.themes)) {
      translated.themes = await translateArray(anime.themes as Record<string, unknown>[], targetLang, ['name']);
    }
    if (anime.demographics && Array.isArray(anime.demographics)) {
      translated.demographics = await translateArray(anime.demographics as Record<string, unknown>[], targetLang, ['name']);
    }

    return translated;
  }

  // Translate manga data
  static async translateManga(manga: Record<string, unknown>, targetLang: 'id' | 'jp' | 'en'): Promise<Record<string, unknown>> {
    if (targetLang === 'en' || !manga) return manga;

    const fieldsToTranslate = ['title', 'title_english', 'title_japanese', 'synopsis', 'background'];
    const translated = await translateObject(manga, targetLang, fieldsToTranslate) as Record<string, unknown>;

    // Translate nested arrays
    if (manga.genres && Array.isArray(manga.genres)) {
      translated.genres = await translateArray(manga.genres as Record<string, unknown>[], targetLang, ['name']);
    }
    if (manga.themes && Array.isArray(manga.themes)) {
      translated.themes = await translateArray(manga.themes as Record<string, unknown>[], targetLang, ['name']);
    }
    if (manga.authors && Array.isArray(manga.authors)) {
      translated.authors = await translateArray(manga.authors as Record<string, unknown>[], targetLang, ['name']);
    }

    return translated;
  }

  // Translate character data
  static async translateCharacter(character: Record<string, unknown>, targetLang: 'id' | 'jp' | 'en'): Promise<Record<string, unknown>> {
    if (targetLang === 'en' || !character) return character;

    const fieldsToTranslate = ['name', 'name_kanji', 'about'];
    return translateObject(character, targetLang, fieldsToTranslate);
  }

  // Translate array of anime/manga (untuk list/grid)
  static async translateAnimeList(animeList: Record<string, unknown>[], targetLang: 'id' | 'jp' | 'en'): Promise<Record<string, unknown>[]> {
    if (targetLang === 'en' || !animeList || animeList.length === 0) return animeList;

    return Promise.all(
      animeList.map(anime => this.translateAnime(anime, targetLang))
    );
  }

  // Translate review
  static async translateReview(review: Record<string, unknown>, targetLang: 'id' | 'jp' | 'en'): Promise<Record<string, unknown>> {
    if (targetLang === 'en' || !review) return review;

    const fieldsToTranslate = ['review'];
    return translateObject(review, targetLang, fieldsToTranslate);
  }

  // Generic translate untuk response API Jikan
  static async translateJikanResponse<T>(
    response: T,
    targetLang: 'id' | 'jp' | 'en',
    dataType: 'anime' | 'manga' | 'character' | 'review' = 'anime'
  ): Promise<T> {
    if (targetLang === 'en' || !response) return response;

    const responseCopy = { ...response } as Record<string, unknown>;

    // Handle pagination response dengan data array
    if (responseCopy.data && Array.isArray(responseCopy.data)) {
      switch (dataType) {
        case 'anime':
          responseCopy.data = await this.translateAnimeList(responseCopy.data, targetLang);
          break;
        case 'manga':
          responseCopy.data = await Promise.all(
            (responseCopy.data as Record<string, unknown>[]).map((item) => this.translateManga(item, targetLang))
          );
          break;
        case 'character':
          responseCopy.data = await Promise.all(
            (responseCopy.data as Record<string, unknown>[]).map((item) => this.translateCharacter(item, targetLang))
          );
          break;
        case 'review':
          responseCopy.data = await Promise.all(
            (responseCopy.data as Record<string, unknown>[]).map((item) => this.translateReview(item, targetLang))
          );
          break;
      }
    }
    // Handle single item response
    else if (responseCopy.data) {
      switch (dataType) {
        case 'anime':
          responseCopy.data = await this.translateAnime(responseCopy.data as Record<string, unknown>, targetLang);
          break;
        case 'manga':
          responseCopy.data = await this.translateManga(responseCopy.data as Record<string, unknown>, targetLang);
          break;
        case 'character':
          responseCopy.data = await this.translateCharacter(responseCopy.data as Record<string, unknown>, targetLang);
          break;
        case 'review':
          responseCopy.data = await this.translateReview(responseCopy.data as Record<string, unknown>, targetLang);
          break;
      }
    }

    return responseCopy as T;
  }
}

// Export standalone functions
export const translateAnime = JikanTranslator.translateAnime.bind(JikanTranslator);
export const translateManga = JikanTranslator.translateManga.bind(JikanTranslator);
export const translateCharacter = JikanTranslator.translateCharacter.bind(JikanTranslator);
export const translateJikanResponse = JikanTranslator.translateJikanResponse.bind(JikanTranslator);
