import localforage from 'localforage';

// Configure IndexedDB untuk translation cache
const translationCache = localforage.createInstance({
  name: 'bobanimelist',
  storeName: 'translation_cache',
  description: 'Cache untuk hasil translasi API Jikan'
});

interface CachedTranslation {
  text: string;
  translated: string;
  timestamp: number;
  targetLang: string;
}

// Cache expiry: 30 hari
const CACHE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

export class TranslationCache {
  private static generateKey(text: string, targetLang: string): string {
    return `${targetLang}:${text.substring(0, 100)}`; // Use first 100 chars sebagai key
  }

  static async get(text: string, targetLang: string): Promise<string | null> {
    try {
      const key = this.generateKey(text, targetLang);
      const cached = await translationCache.getItem<CachedTranslation>(key);
      
      if (cached) {
        const now = Date.now();
        if (now - cached.timestamp < CACHE_EXPIRY_MS) {
          return cached.translated;
        } else {
          // Cache expired, hapus
          await translationCache.removeItem(key);
        }
      }
      return null;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TranslationCache] Error getting cache:', error);
      }
      return null;
    }
  }

  static async set(text: string, translated: string, targetLang: string): Promise<void> {
    try {
      const key = this.generateKey(text, targetLang);
      const cached: CachedTranslation = {
        text,
        translated,
        timestamp: Date.now(),
        targetLang
      };
      await translationCache.setItem(key, cached);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TranslationCache] Error setting cache:', error);
      }
    }
  }

  static async clear(): Promise<void> {
    try {
      await translationCache.clear();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TranslationCache] Error clearing cache:', error);
      }
    }
  }
}
