import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../services/vernac/models';

interface LanguageContextType {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [locale, setLocaleState] = React.useState<Locale>((i18n.language as Locale) || 'en');

  // Sync i18n language changes dengan local state
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLocaleState(lng as Locale);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const toggleLocale = () => {
    let newLocale: Locale;
    switch (locale) {
      case 'en':
        newLocale = 'jp';
        break;
      case 'jp':
        newLocale = 'in'; // VernacUtil uses 'in' for Indonesian
        break;
      case 'in':
        newLocale = 'en';
        break;
      default:
        newLocale = 'en';
    }
    // Map 'in' to 'id' for i18next
    const i18nLocale = newLocale === 'in' ? 'id' : newLocale;
    i18n.changeLanguage(i18nLocale);
    setLocaleState(newLocale);
  };

  const setLocale = (newLocale: Locale) => {
    // Map 'in' to 'id' for i18next
    const i18nLocale = newLocale === 'in' ? 'id' : newLocale;
    i18n.changeLanguage(i18nLocale);
    setLocaleState(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};