import type { Locale } from "./models";

const vernacStorageKey = 'vernac-locale';

export const VernacUtil = {
    getCurrentLocale(): Locale {
        if (typeof window !== 'undefined') {
            const storedLocale = localStorage.getItem(vernacStorageKey) as Locale | null;
            if (storedLocale && ['en', 'jp', 'in'].includes(storedLocale)) {
                return storedLocale;
            }
        }
        return 'en'; // default locale
    },

    setCurrentLocale(locale: Locale): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(vernacStorageKey, locale);
        }
    },

    toggleLocale(): Locale {
        const currentLocale = this.getCurrentLocale();
        let newLocale: Locale;
        switch (currentLocale) {
            case 'en':
                newLocale = 'jp';
                break;
            case 'jp':
                newLocale = 'in';
                break;
            case 'in':
                newLocale = 'en';
                break;
            default:
                newLocale = 'en';
        }
        this.setCurrentLocale(newLocale);
        return newLocale;
    }
};