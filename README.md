# <img src="/public/zero.gif" width="55" height="auto" ></img> bobanimelist

**bobanimelist** adalah platform modern untuk menjelajahi anime dan manga, dibangun dari awal dengan fokus pada performa, skalabilitas, dan pengalaman pengembang. Versi 2.0 ini menampilkan keahlian saya dalam React, TypeScript, manajemen state, dan praktik terbaik UI/UX dengan sentuhan animasi yang menarik.

**Dipublikasikan di https://suriyakishoreks.github.io/bobanimelist/**

---

## 🚀 Teknologi yang Digunakan

- **React** (didukung Vite)
- **TypeScript** (dengan tiping ketat)
- **Redux Toolkit** (RTK Query & Redux Persist)
- **React Router**
- **SCSS** (modular & dapat di-tema)
- **motion** (framework animasi)

---

## ✨ Fitur-fitur Menarik

- **Beranda & widget interaktif** untuk penjelajahan cepat anime, manga, manhwa, manhua
- **Halaman Detail** untuk informasi mendalam tentang konten
- **Animasi Halus & Responsif** (transisi halaman, interaksi mikro, efek typing)
- **Layer Data Lanjutan**
  - RTK Query untuk mengambil/menyimpan data API secara efisien
  - Redux Persist untuk kontinuitas sesi yang mulus
- **Komponen UI Kustom**
  - Desain atomik: Atom, Molekul, Organisme
  - Komponen yang dapat digunakan kembali (Label, Box, Image, dll.)
- **Sistem Desain**
  - Toggle tema Gelap/Cerah (variabel SCSS & token)
  - Layout responsif, HTML semantik
- **Lokalisasi** (didukung vernac, siap multi-bahasa)
- **Penanganan Error yang Kuat** (error boundaries, state loading)
- **Peralatan Modern**
  - ESLint & Stylelint untuk kualitas kode
  - Vite untuk build yang cepat luar biasa
- **Animasi Keren** - termasuk efek typing pada logo dengan cursor berkedip

---

## 🎨 Tampilan & Interaksi

- **Efek Typing** pada logo aplikasi dengan cursor berkedip
- **Animasi Transisi** yang halus antar halaman
- **Efek Hover** dan interaksi mikro yang menarik
- **Animasi Loading** yang menyenangkan
- **Toggle Tema** yang responsif

---

## 🛠️ Sorotan Implementasi

- **Struktur Proyek yang Dapat Diskalakan**
  - `atoms`, `molecules`, `organisms`: Desain atomik untuk UI yang dapat digunakan kembali
  - `pages`, `layouts`: Pemisahan tanggung jawab yang jelas
  - `services`: Abstraksi API (Jikan API)
  - `shared`: Utilitas, hooks, model (contoh: `useIntersectionObserver`, `useTypingEffect`)
  - `store`: State Redux terpusat
  - `styles`: SCSS modular, token desain
- **Pola React Modern**
  - Komponen fungsional, hooks, custom hooks (contoh: `useIntersectionObserver`)
  - TypeScript ketat untuk kemudahan pemeliharaan
- **UI/UX yang Hebat**
  - Transisi halus, desain responsif, aksesibilitas
  - Toggle tema, lokalisasi, animasi mikro yang halus

---

## 🏆 Capaian & Milestone

### ✅ Milestone 1 (Selesai)

- Setup inti & struktur proyek
- Integrasi API Jikan
- Halaman beranda, anime, dan manga
- Fitur pencarian & detail konten
- Dukungan tema & lokalisasi
- State loading dan error handling
- Efek animasi typing pada logo

### 🔜 Milestone 2 (Dalam Pengembangan)

- Dukungan PWA
- Infinite feed
- Scroll restoration kustom
- Optimasi - lazy loading, SEO, dll
- Layanan analytics sederhana
- Unit relatif untuk spasi & font
- Animasi interaktif tambahan

---

## 🎯 Animasi & Interaksi Keren

bobanimelist menampilkan berbagai animasi dan efek visual menarik:

- **Efek typing pada logo** - menampilkan nama aplikasi dengan cara mengetik dan cursor berkedip
- **Transisi halaman yang halus** - perpindahan antar halaman dengan animasi
- **Efek hover pada kartu** - efek visual saat mengarahkan kursor
- **Animasi loading widget** - menampilkan konten dengan animasi saat memuat

---

## 🚩 Memulai

```bash
# Instal dependensi
npm install

# Jalankan server development
npm run dev
```

Aplikasi berjalan di [http://localhost:5173](http://localhost:5173)

```bash
# Build untuk produksi
npm run build
```

File produksi akan tersedia di direktori `dist`.

---

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas. Silakan buat issue atau pull request untuk:
- Menambahkan fitur baru
- Memperbaiki bug
- Meningkatkan dokumentasi
- Menambahkan animasi & efek visual

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---
