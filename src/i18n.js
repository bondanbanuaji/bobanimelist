import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import id from './locales/id/translation.json';
import jp from './locales/jp/translation.json';

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
      jp: { translation: jp }
    },
    lng: 'en',
    fallbackLng: 'en',
    detection: {
      order: ['path'], 
      lookupFromPathIndex: 0,
      caches: [] 
    },
    debug: true, 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;