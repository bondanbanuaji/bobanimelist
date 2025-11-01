import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import i18n from '../../i18n'; // Impor i18n kita

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

const baseQuery = fetchBaseQuery({
    baseUrl: JIKAN_API_BASE_URL,
    prepareHeaders: (headers) => {
        // Ambil bahasa dari i18n
        const currentLng = i18n.language;

        // Mapping bahasa untuk header Accept-Language
        // 'id' di i18n kita -> 'id-ID' atau 'in' untuk header (walaupun 'in' tidak resmi, beberapa API memakainya)
        // 'jp' di i18n kita -> 'ja-JP'
        // 'en' di i18n kita -> 'en-US' atau 'en-GB', 'en'
        let acceptLanguageValue = 'en-US'; // Default ke en-US

        if (currentLng === 'jp') {
            acceptLanguageValue = 'ja-JP';
        } else if (currentLng === 'id') {
            // Header Accept-Language sering menggunakan 'in' untuk Indonesia, meskipun kode bahasa ISO adalah 'id'
            // Kita bisa coba keduanya, atau hanya 'id'. Mari coba 'id' dulu.
            acceptLanguageValue = 'id-ID';
            // Jika API tidak merespon dengan konten bahasa Indonesia, kita bisa coba 'in'
            // acceptLanguageValue = 'in';
        }
        // Jika currentLng === 'en', biarkan default 'en-US'

        headers.set('Accept-Language', acceptLanguageValue);
        return headers;
    }
});

const baseQueryWithRetry = retry(baseQuery, {
    maxRetries: 3,
    backoff: async () => {
        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }
});

export const jikanApi = createApi({
    reducerPath: 'jikanApi',
    baseQuery: baseQueryWithRetry,
    endpoints: () => ({}),
    keepUnusedDataFor: 60 * 60,
    refetchOnMountOrArgChange: 60 * 60
});