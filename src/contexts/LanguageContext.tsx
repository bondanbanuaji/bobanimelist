import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { VernacUtil } from '../services/vernac/vernac-util';
import type { Locale } from '../services/vernac/models';

interface LanguageContextType {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = React.useState<Locale>(VernacUtil.getCurrentLocale());

  const toggleLocale = () => {
    const newLocale = VernacUtil.toggleLocale();
    setLocaleState(newLocale);
  };

  const setLocale = (newLocale: Locale) => {
    VernacUtil.setCurrentLocale(newLocale);
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