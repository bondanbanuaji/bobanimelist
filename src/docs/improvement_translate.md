---
# 🧠 TASK: Implement Global Multi-Language Translation Layer (Auto System)

Goal:
Menerapkan sistem penerjemahan otomatis penuh di project berbasis JavaScript/TypeScript (React/Vite environment)
yang sudah menggunakan i18n, agar semua teks — termasuk data yang diambil dari API (Jikan API) — dapat diterjemahkan
secara otomatis berdasarkan `html lang` saat user mengganti bahasa (EN/ID/JA).

──────────────────────────────
## 🎯 Objectives

1. Semua elemen UI (static text) dan data dinamis (dari Jikan API) akan otomatis berubah bahasa
   ketika `document.documentElement.lang` berubah.

2. Sistem penerjemahan harus:
   - **Reaktif** (otomatis merender ulang halaman setelah bahasa diubah)
   - **Efisien** (menggunakan cache agar tidak menerjemahkan ulang data yang sama)
   - **Akurat** (gunakan DeepL API sebagai prioritas, fallback ke Google Translate API)
   - **Ramah resource** (tidak berat di device mobile atau low-end)

3. Pastikan sistem kompatibel dengan mode gelap/terang, responsive layout, dan struktur proyek eksisting.

──────────────────────────────
## ⚙️ Steps & Implementation Details

### 1. Setup Translation Utility
Buat modul `@src/utils/translateText.ts`:

- Fungsi utama: `translateText(text: string, targetLang: string): Promise<string>`
- Gunakan DeepL API (`deepl-node`) sebagai translator utama.
- Fallback ke `@vitalets/google-translate-api` jika DeepL gagal.
- Implement caching hasil translasi (IndexedDB atau localStorage).
- Tambahkan delay handling biar gak kena rate-limit API.

```ts
import translate from "@vitalets/google-translate-api";
import { createClient } from "deepl-node";

const cacheKey = (text, lang) => `translate_${lang}_${btoa(text)}`;
const deepl = new createClient(process.env.DEEPL_API_KEY);

export async function translateText(text, lang = "en") {
  const cached = localStorage.getItem(cacheKey(text, lang));
  if (cached) return cached;

  try {
    const result = await deepl.translateText(text, null, lang);
    localStorage.setItem(cacheKey(text, lang), result.text);
    return result.text;
  } catch {
    const res = await translate(text, { to: lang });
    localStorage.setItem(cacheKey(text, lang), res.text);
    return res.text;
  }
}
````

──────────────────────────────

### 2. Global Translator Context

Buat context di `@src/context/TranslationContext.tsx`:

* Observasi `document.documentElement.lang`
* Re-render seluruh komponen ketika bahasa berubah
* Sediakan hook `useTranslate()` agar setiap komponen bisa otomatis menerjemahkan data

```ts
import { createContext, useContext, useEffect, useState } from "react";
import { translateText } from "@/utils/translateText";

const TranslationContext = createContext({ lang: "en", t: (t) => t });

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState(document.documentElement.lang || "en");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  return (
    <TranslationContext.Provider value={{ lang, t: translateText }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslate = () => useContext(TranslationContext);
```

──────────────────────────────

### 3. Integrasi di API Layer

Update setiap service API (misal `animeApi.ts`, `mangaApi.ts`) agar hasil datanya diterjemahkan sesuai bahasa aktif.

```ts
import { useTranslate } from "@/context/TranslationContext";

export async function fetchAnimeDetail(id) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  const data = await response.json();

  const { lang, t } = useTranslate();
  data.data.synopsis = await t(data.data.synopsis, lang);

  return data;
}
```

──────────────────────────────

### 4. Integrasi dengan i18n

Sinkronkan `i18next` agar selalu mengikuti `document.documentElement.lang`:

```ts
import i18n from "i18next";

const updateLanguage = () => {
  const lang = document.documentElement.lang || "en";
  i18n.changeLanguage(lang);
};

new MutationObserver(updateLanguage).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});
```

──────────────────────────────

### 5. UX / UI Handling

* Tambahkan dropdown di header untuk ubah bahasa (EN / ID / JP)

* Saat user pilih bahasa:

  ```js
  document.documentElement.lang = "id";
  ```

  -> otomatis trigger translator dan i18n sync.

* Pastikan loading skeleton ditampilkan selama translasi agar UX-nya halus.

* Simpan bahasa terakhir di localStorage untuk session berikutnya.

──────────────────────────────

### 6. Error Handling & Fallback

Jika translasi gagal:

* Gunakan teks asli (Inggris) sebagai fallback
* Log error ke console hanya di development mode
* Jangan sampai nge-crash halaman

──────────────────────────────

### 7. Testing & Validation

* Test di mode offline (cache)
* Test di mobile low-end
* Test di dark/light mode
* Pastikan perbandingan performa <20% degradasi dari versi asli
* Pastikan semua teks (sinopsis, judul, genre, rating, reviews) ikut berubah bahasa

──────────────────────────────

### 8. Output Deliverables

1. `@src/utils/translateText.ts`
2. `@src/context/TranslationContext.tsx`
3. Updated `api/` service files
4. Updated language switcher
5. Documentation update:
   → `@src/docs/TRANSLATION_SYSTEM_GUIDE.md` berisi:

   * Alur kerja sistem translasi
   * Arsitektur & caching
   * Panduan penambahan bahasa baru

──────────────────────────────

### 🚨 Constraints

* Jangan ubah struktur API Jikan.
* Jangan tambahkan dependensi berat selain `deepl-node` dan `@vitalets/google-translate-api`.
* Harus kompatibel dengan build system (Vite + React + TS).
* Harus melewati lint (`eslint`) dan strict mode.

──────────────────────────────

### ✅ Expected Result

* Bahasa otomatis sinkron dengan `html lang`.
* Semua konten (statis & dinamis) ikut berubah bahasa.
* Tidak ada lag atau freeze saat transisi bahasa.
* Sistem aman, efisien, dan mudah dikembangkan.

```

---
