import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import id from './locales/id/translation.json';
import jp from './locales/jp/translation.json';

// Custom language detector untuk localStorage
const customLanguageDetector = {
  type: 'languageDetector',
  async: false,
  detect: () => {
    // Cek localStorage dengan key yang sama dengan VernacUtil
    const storedLocale = localStorage.getItem('vernac-locale');
    if (storedLocale && ['en', 'id', 'jp'].includes(storedLocale)) {
      return storedLocale;
    }
    // Fallback ke browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'id' || browserLang === 'ja') {
      return browserLang === 'ja' ? 'jp' : 'id';
    }
    return 'en';
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    // Simpan ke localStorage
    localStorage.setItem('vernac-locale', lng);
    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng === 'jp' ? 'ja' : lng;
    }
  }
};

i18n
  .use(customLanguageDetector)
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
      jp: { translation: jp }
    },
    lng: undefined, // Let detector decide
    fallbackLng: 'en',
    supportedLngs: ['en', 'id', 'jp'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false 
    },
    react: {
      useSuspense: false // Prevent suspense issues
    }
  });

// Initial html lang attribute setup
if (typeof document !== 'undefined') {
  const currentLang = i18n.language;
  document.documentElement.lang = currentLang === 'jp' ? 'ja' : currentLang;
}

// Listen to language changes and update html lang
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng === 'jp' ? 'ja' : lng;
  }
});

export default i18n;