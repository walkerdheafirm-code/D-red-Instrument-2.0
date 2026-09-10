# 🎹 D'red Instrument 2.0
> **UAS React Fundamental Project** — Aplikasi Web Musik Virtual Interaktif dengan Visual Identity Dark & Bold ("Bloody Red").

---

## 📖 Deskripsi Proyek

**D'red Instrument 2.0** adalah aplikasi web virtual instrument yang dibangun menggunakan React JS dan didesain secara modern dengan nuansa dark-aesthetic (*#0A0A0B* background, *#151417* panel, dan aksen merah darah *#C81E3A*). Aplikasi ini memungkinkan pengguna untuk memainkan instrumen virtual secara responsif, merekam hasil permainan, mengelola koleksi rekaman, melatih ketepatan nada dan ritme, hingga merancang pola ketukan drum sendiri.

---

## ✨ Fitur Utama

### 1. 🎹 Virtual Instruments
- **Piano Virtual**: 2 oktaf tuts interaktif (C3 - B4) dengan sampling realistis (*Salamander Grand Piano* via Tone.js Sampler) dan fallback synth, support klik, touch, dan shortcut keyboard PC.
- **Launchpad (Soundboard)**: Grid 4x4 (16 pad) dengan sound synthesis beragam (Kick, Snare, Hi-Hat, 808 Bass, Synth Lead, FX, dsb.) dilengkapi visual animasi saat ditekan.
- **Drum Kit**: Pad drum elektrik interaktif (Kick, Snare, Hi-Hat Open/Closed, Toms, Crash, Ride) dengan feedback sentuhan yang responsif.
- **Metronome**: Pengatur tempo interaktif (BPM 40–240), visual beat indicators (1-4), dan suara tik audio metronom yang akurat.
- **Orientation Prompt**: Otomatis mendeteksi perangkat mobile portrait dan menganjurkan memutar ke mode landscape untuk pengalaman instrumen terbaik.

### 2. 🎙️ Perekam & Manajemen Rekaman (Full CRUD)
- **Audio Recorder**: Terintegrasi langsung di instrumen untuk merekam audio permainan (via Web Audio MediaRecorder) dengan batas aman 60 detik.
- **Daftar Rekaman & Audio Player**: Mendengarkan kembali hasil rekaman, kontrol play/pause, dan progress playback.
- **Pencarian & Filter Multi-Kategori**: Cari rekaman berdasarkan judul, filter berdasarkan instrumen (Piano, Launchpad, Drum Kit) dan kategori (Latihan, Cover, Eksperimen, Lainnya).
- **Pengurutan (Sorting)**: Urutkan berdasarkan Terbaru, Terlama, Judul A-Z, dan Judul Z-A.
- **Paginasi Dinamis**: Navigasi halaman rapi dengan dynamic page buttons dan status disabled di ujung data.
- **Edit & Favorit**: Ubah judul/kategori/tempo rekaman serta tandai rekaman favorit.

### 3. 🎯 Practice Mode (Mode Latihan Interaktif)
- **Follow the Melody (Piano)**: Game mengingat dan mengulang melodi tuts piano yang dicontohkan secara visual & audio dengan sistem skor.
- **Follow the Rhythm (Drum)**: Latihan ritme ketukan drum dengan hitungan ronde dan akurasi skor.
- **Riwayat Skor**: Skor tersimpan ke `localStorage` dan terintegrasi dengan data profil/pencapaian.

### 4. 🥁 Beat Pattern Library (Step Sequencer)
- **16-Step Beat Grid**: Buat dan dengarkan loop ketukan 16-step interaktif dengan tempo yang dapat disesuaikan.
- **Pola Bawaan & Custom Pattern**: Preset bawaan (Rock, Hip Hop, Trap, House) serta kemampuan membuat pola ketukan baru (Full CRUD).

### 5. 📊 Dashboard & 🏆 Achievement System
- **Statistik Cepat**: Total rekaman, durasi total, rekaman favorit, dan rekor skor latihan.
- **Pintasan Cepat**: Akses instan ke instrumen dan mode latihan.
- **Rekaman Terakhir**: Akses dan putar langsung rekaman terbaru dari dashboard.
- **Badge Pencapaian**: Unlock badge otomatis berdasarkan aktivitas bermain (rekaman pertama, skor latihan tinggi, beatmaker, dsb.).

---

## 🛠️ Tech Stack & Library

| Kategori | Teknologi / Library |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Package Manager** | `pnpm` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **Audio Engine** | [Tone.js](https://tonejs.github.io/) |
| **State Management** | React Context API & React Hooks |
| **Penyimpanan Data** | Browser `localStorage` |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📋 Pemenuhan Rubrik Penilaian UAS

| Kriteria Rubrik | Implementasi dalam Aplikasi |
|---|---|
| **Fitur ES6** | Menggunakan `const`/`let`, arrow functions, template literals, destructuring, spread operator (`...`), dan **rest parameter** (`combineAndSortRecordings` di `src/utils/sortHelpers.js`). |
| **Struktur Folder Rapi** | Terpisah jelas antara `pages/`, `components/`, `context/`, `data/`, dan `utils/`. |
| **Komponen Modular** | `Sidebar`, `PageLayout`, `RecordingCard`, `PatternCard`, `RecordingForm`, `Pagination`, `Metronome`, dsb. |
| **Pengiriman Props** | Terdistribusi dari parent ke child untuk callback handler, state kontrol, dan data list. |
| **Styling & Responsif** | Tailwind CSS penuh dengan layout responsif mobile (overlay drawer & flex-wrap) dan desktop. |
| **Rendering List** | `.map()` dengan unique `key` pada daftar rekaman, step sequencer, daftar badge, dan riwayat latihan. |
| **Conditional Rendering** | State kosong (*Empty State*), indikator rekam/stop, loading sampel suara, dan pesan konfirmasi. |
| **Event Handling** | Penerapan `onClick`, `onChange`, `onSubmit`, serta keyboard event listener untuk tuts instrumen. |
| **Full CRUD** | Create, Read, Update, Delete pada modul Rekaman (`RecordingContext`) dan Beat Pattern (`BeatPatternContext`). |
| **Search & Filter** | Pencarian teks judul rekaman dengan pesan "Tidak ditemukan", serta filter kategori dan jenis instrumen. |
| **Sorting** | Pengurutan dinamis berdasarkan Terbaru, Terlama, A-Z, dan Z-A. |
| **Paginasi** | Paginasi dinamis dengan `Math.ceil()`, tombol nomor halaman, serta prev/next button. |
| **Form Pre-filled** | Form edit otomatis terisi dengan data rekaman yang sedang diedit. |
| **Context API** | `RecordingContext`, `BeatPatternContext`, `PracticeContext`, `AchievementContext`, dan `MetronomeContext`. |
| **Routing SPA** | `BrowserRouter`, `Routes`, `Route`, `NavLink`, `useParams()`, dan halaman khusus 404 (`NotFoundPage`). |

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js (versi 18+ disarankan)
- pnpm (atau npm / yarn)

### Langkah Instalasi
1. Clone repository ini:
   ```bash
   git clone https://github.com/username/dred-instrument.git
   cd dred-instrument
   ```

2. Install dependensi:
   ```bash
   pnpm install
   ```

3. Jalankan server development:
   ```bash
   pnpm dev
   ```
   Aplikasi dapat diakses di browser pada URL `http://localhost:5173`.

4. Build untuk produksi:
   ```bash
   pnpm build
   ```

---

## 📁 Struktur Direktori

```text
dred-instrument/
├── public/                  # Static assets & audio samples
├── src/
│   ├── assets/              # Gambar / aset ikon
│   ├── components/
│   │   ├── achievements/    # Komponen lencana & pencapaian
│   │   ├── beat-patterns/   # Komponen step sequencer & modal pola
│   │   ├── common/          # SearchBar, Pagination, EmptyState, ConfirmDialog
│   │   ├── dashboard/       # StatCard, RecentRecordings, QuickShortcuts
│   │   ├── instruments/     # Piano, Launchpad, DrumKit, Metronome, Recorder
│   │   ├── layout/          # PageLayout, Sidebar navigasi
│   │   └── recordings/      # RecordingCard, RecordingForm, AudioPlayer
│   ├── context/             # Global Context Providers
│   ├── data/                # Data preset bawaan (patterns, achievements)
│   ├── pages/               # Halaman utama aplikasi (Dashboard, Instruments, CRUD, dsb.)
│   ├── utils/               # Helper format durasi, tanggal, pengurutan
│   ├── App.jsx              # Router & Root Providers
│   └── main.jsx             # Entry point React
├── PRD.md                   # Product Requirement Document & Checklist
├── vercel.json              # Konfigurasi SPA Routing untuk Vercel
└── package.json
```

---

## 🌐 Deployment (Vercel)

Aplikasi ini sudah dilengkapi file konfigurasi `vercel.json` untuk mendukung routing Single Page Application (SPA). Untuk deploy ke Vercel:
1. Hubungkan repository GitHub ke dashboard Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `pnpm build` (atau `npm run build`).
4. Output Directory: `dist`.
5. Klik **Deploy**.
