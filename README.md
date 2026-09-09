# BISA (Bisa Insani Smart Academy) — PKBM Bina Insani

> **Platform Pembelajaran Digital PKBM Bina Insani**  
> Motto: **Hebat • Mandiri • Kreatif**  
> Strategi Implementasi: **Android-First Mobile Application** (React Native & Expo SDK 52 + Express Backend + Prisma ORM)

---

## 1. Identitas Resmi Aplikasi

- **Nama Singkat**: BISA
- **Nama Lengkap**: Bisa Insani Smart Academy
- **Lembaga**: PKBM Bina Insani
- **Deskripsi**: Platform Pembelajaran Digital PKBM Bina Insani
- **Tagline**: *"Belajar, Berkembang, dan Berkarya Bersama."*
- **Motto**: **Hebat • Mandiri • Kreatif**
- **Fokus Platform**: **Android Mobile Application** (Laptop/Desktop untuk Development, Backend, Database, Android Emulator, dan Demo).

Aplikasi melayani 3 (tiga) peran pengguna:
1. **ADMINISTRATOR**: Kelola sistem, data akademik, tahun ajaran, kelas, dan aktivitas pembelajaran. Login via Email & Password internal.
2. **GURU (TEACHER)**: Kelola kelas pengajaran, modul belajar, materi digital, dan tugas siswa. Login via Email & Password internal.
3. **SISWA (STUDENT)**: Belajar materi digital, pantau progres modul, dan selesaikan tugas. **Login eksklusif menggunakan Google Sign-In** dan aktivasi akun via **Sistem Kode Kelas (Class Invitation Code)**.

---

## 2. Arsitektur & Teknologi

### Mobile Application (Android Native First)
- **Framework**: React Native with [Expo SDK 52](https://expo.dev)
- **Routing & Navigasi**: Expo Router v4 (File-based routing & role-based bottom tabs)
- **Autentikasi Siswa**: Google Sign-In Android-compatible ID Token verification
- **Sistem Aktivasi Siswa**: Class Invitation Code (`PENDING` -> `ACTIVE`)
- **Secure Token Storage**: `expo-secure-store`
- **Networking**: Axios dengan interceptor JWT Bearer & standard error handling
- **Desain & Theme**: Palet warna resmi BISA (Navy `#1E3A8A`, Cyan `#0284C7`, Emerald `#059669`, Gold `#D97706`), typography proporsional, mikro animasi elegan

### Backend REST API
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Google Auth Service**: Google OAuth2 Client token verification (`google-auth-library`)
- **Class Invitation Service**: Kode kelas unik 8-16 karakter, pelacakan kuota (`maxUses`, `usedCount`), masa berlaku (`expiresAt`), dan status aktivasi
- **Keamanan**: JWT, `bcrypt` password hashing, `helmet`, `cors`, Zod schema validation

---

## 3. Alur Autentikasi & Registrasi Siswa BISA

```
┌────────────────────────────────────────────────────────┐
│                   SISWA BISA                           │
└──────────────────────────┬─────────────────────────────┘
                           │
                 [Lanjutkan dengan Google]
                           │
             ┌─────────────▼─────────────┐
             │ POST /api/auth/student/google
             │     with Google idToken   │
             └─────────────┬─────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
[Akun Baru / PENDING]               [Akun Lama / ACTIVE]
requiresClassCode: true             requiresClassCode: false
        │                                     │
        ▼                                     ▼
Layar Lengkapi Pendaftaran            Dashboard Siswa BISA
- Tampil Foto Google Siswa            - Ringkasan Progres
- Input Kode Kelas                    - Continue Learning Modul
        │                             - Akses Materi Digital
        ▼
POST /api/student/join-class
  with { code: "BISA-..." }
        │
Status Siswa -> ACTIVE
Terhubung ke Kelas & Rombel
        │
        ▼
Dashboard Siswa BISA
```

---

## 4. Akun Pengguna Development & Testing

Berikut adalah daftar akun yang tersedia setelah menjalankan seed database:

| Peran | Alamat Email | Kata Sandi | Keterangan / Status |
| :--- | :--- | :--- | :--- |
| **ADMINISTRATOR** | `admin@pkbmbinainsani.sch.id` | `Admin123!` | Administrator Utama Sistem |
| **GURU** | `guru.budi@pkbmbinainsani.sch.id` | `Guru123!` | Wali Kelas & Pengajar (NIP: 198501152010011001) |
| **GURU** | `guru.siti@pkbmbinainsani.sch.id` | `Guru123!` | Pengajar (NIP: 198803202012022002) |
| **SISWA (Aktif)** | `siswa.ahmad@pkbmbinainsani.sch.id` | Google Sign-In | Status: `ACTIVE` (Kelas X-A) |
| **SISWA (Aktif)** | `siswa.dewi@pkbmbinainsani.sch.id` | Google Sign-In | Status: `ACTIVE` (Kelas XI-B) |
| **SISWA (Baru)** | `rizky.siswa.baru@gmail.com` | Google Sign-In | Status: `PENDING` (Uji Coba Kode Undangan) |

*(Catatan: Sistem login Administrator dan Guru juga mendukung alias domain lama `sekolahmodel.sch.id` secara mulus tanpa mengganggu data yang sudah berjalan).*

---

## 5. Menjalankan Project secara Lokal

### A. Persiapan Backend & Database
1. Salin file environment:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Jalankan migrasi dan seeding data:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
3. Jalankan backend server:
   ```bash
   npm run dev
   ```
   Backend aktif di `http://localhost:5000/api`.

### B. Menjalankan Mobile App pada Android Emulator
1. Konfigurasi URL API:
   Pada Android Emulator, `localhost` komputer host diakses melalui IP `10.0.2.2`. Konfigurasi default di `mobile/constants/config.ts` sudah mendeteksi `Platform.OS === 'android'` secara otomatis.
2. Jalankan Expo Development Server:
   ```bash
   cd mobile
   npx expo start --android
   ```
3. Tekan `a` pada terminal Expo untuk langsung membuka aplikasi di Android Emulator.

---

## 6. Konfigurasi Google Sign-In Android

Untuk deployment production atau pengujian Google Sign-In mandiri di Android Studio:

1. **Google Cloud Console**:
   - Buat OAuth 2.0 Client ID jenis **Android**.
   - Masukkan Package Name Android: `com.binainsani.bisaacademy`.
   - Masukkan SHA-1 Fingerprint dari debug/release keystore:
     ```bash
     cd android && ./gradlew signingReport
     ```
   - Buat OAuth 2.0 Client ID jenis **Web Application** untuk backend verification (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` dan `GOOGLE_CLIENT_ID`).

2. **File Environment**:
   - Backend (`server/.env`):
     ```env
     GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
     ```
   - Mobile (`mobile/.env`):
     ```env
     EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
     EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id.apps.googleusercontent.com
     ```

---

## 7. Validasi Tahap 4.5 Selesai

- [x] **Branding Resmi BISA**: Logo, nama BISA, Bisa Insani Smart Academy, PKBM Bina Insani, dan motto Hebat • Mandiri • Kreatif.
- [x] **Splash & Welcome Screen**: Transisi berurutan logo -> BISA -> nama lembaga -> motto.
- [x] **Login Multi-Role**: Card interaktif Administrator, Guru, dan Siswa.
- [x] **Siswa Google Sign-In**: Akses tanpa password internal, verifikasi token di backend.
- [x] **Sistem Kode Kelas (Class Invitation Code)**: Manajemen kode oleh Admin, aktivasi instan dari status `PENDING` ke `ACTIVE`.
- [x] **Layar Lengkapi Pendaftaran**: Input kode kelas terintegrasi data profil Google siswa.
- [x] **Dashboard Siswa Interaktif**: Motivasi, ringkasan progres, dan modul Continue Learning.
- [x] **Pembersihan Branding Lama**: Pembaruan referensi sekolahmodel ke pkbmbinainsani dengan backwards-compatibility yang aman.
