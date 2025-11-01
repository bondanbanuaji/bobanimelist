import enVernacConfig from "./en";
import jpVernacConfig from "./jp";
import inVernacConfig from "./in";
import type { VernacConfig, Locale } from "./models";

export default class Vernac {
    public static getVernac(key: keyof VernacConfig, locale: Locale = 'en'): string {
        const config = this.getVernacConfig(locale);
        return config[key] !== undefined ? config[key] : '';
    }

    private static getVernacConfig(locale: Locale): VernacConfig {
        switch (locale) {
            case 'en':
            default:
                return enVernacConfig;
            case 'jp':
                return jpVernacConfig;
            case 'in':
                return inVernacConfig;
        }
    }
}