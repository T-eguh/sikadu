# SEKOLAH MODEL - Learning Management System (LMS) Mobile

> **Tahap 1**: Fondasi Aplikasi Mobile, Backend REST API, Database PostgreSQL Prisma, Autentikasi JWT, Multi-Role Authorization, Protected Routing, dan Role-Based Dashboard.

---

## 1. Deskripsi Aplikasi

**SEKOLAH MODEL** adalah aplikasi mobile Learning Management System (LMS) modern lintas platform (Android & iOS) yang dirancang untuk mendukung proses pembelajaran digital di lingkungan sekolah secara aman, terintegrasi, dan mudah digunakan.

Aplikasi melayani 3 (tiga) peran pengguna utama melalui satu aplikasi terpadu:
1. **ADMINISTRATOR**: Mengelola data sekolah, hak akses pengguna, serta memantau status operasional sistem.
2. **GURU (TEACHER)**: Mengelola jadwal kelas pengajaran, bahan ajar, dan memfasilitasi aktivitas belajar mengajar.
3. **SISWA (STUDENT)**: Mengakses modul digital, materi pelajaran, dan memantau tugas harian.

---

## 2. Teknologi

### Mobile Frontend
- **Framework**: React Native with [Expo SDK 52](https://expo.dev)
- **Routing & Navigasi**: Expo Router v4 (File-based routing & role-based bottom tabs)
- **Language**: TypeScript (Strict type safety)
- **Secure Token Storage**: `expo-secure-store`
- **Networking**: Axios (dengan Interceptor JWT Bearer & standard error handling)
- **Icons & UI**: `@expo/vector-icons` (Ionicons), `react-native-safe-area-context`

### Backend REST API
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database & ORM**: PostgreSQL & Prisma ORM v6
- **Autentikasi & Keamanan**:
  - JSON Web Tokens (`jsonwebtoken`)
  - Password Hashing (`bcrypt`)
  - HTTP Header Security (`helmet`)
  - Cross-Origin Resource Sharing (`cors`)
  - Rate Limiter (`express-rate-limit` pada endpoint login)
  - Input Validation (`zod`)

---

## 3. Struktur Project

```
sekolah-model/
│
├── mobile/                               # Aplikasi React Native Expo (Android & iOS)
│   ├── app/                              # File-based routing (Expo Router)
│   │   ├── _layout.tsx                   # Root Stack layout & AuthProvider
│   │   ├── index.tsx                     # Splash Screen & Session check
│   │   ├── login.tsx                     # Login Screen dengan KeyboardAvoidingView
│   │   ├── admin/                        # Area Administrator
│   │   │   ├── _layout.tsx               # Admin Bottom Tab Navigation
│   │   │   ├── dashboard.tsx             # Dashboard Admin (Stats & System)
│   │   │   ├── users.tsx                 # Pengelolaan Guru & Siswa
│   │   │   └── profile.tsx               # Profil Admin
│   │   ├── guru/                         # Area Guru (Teacher)
│   │   │   ├── _layout.tsx               # Teacher Bottom Tab Navigation
│   │   │   ├── dashboard.tsx             # Dashboard Guru (NIP & Menu)
│   │   │   ├── kelas.tsx                 # Jadwal Kelas yang Diampu
│   │   │   ├── modul.tsx                 # Bahan Ajar & Modul
│   │   │   └── profile.tsx               # Profil Guru
│   │   └── siswa/                        # Area Siswa (Student)
│   │       ├── _layout.tsx               # Student Bottom Tab Navigation
│   │       ├── dashboard.tsx             # Dashboard Siswa (NIS/NISN & Menu)
│   │       ├── modul.tsx                 # Modul Belajar
│   │       ├── tugas.tsx                 # Daftar Tugas & Ujian
│   │       └── profile.tsx               # Profil Siswa
│   ├── components/                       # Komponen Reusable (Button, Input, Card, dll.)
│   ├── constants/                        # Konstanta warna, tema, dan config
│   ├── context/                          # AuthContext (State user, token, session)
│   ├── hooks/                            # Custom hooks (useAuth, useProtectedRoute)
│   ├── services/                         # Axios instance & Auth API service
│   ├── types/                            # TypeScript interfaces & types
│   ├── utils/                            # SecureStore adapter & formatters
│   ├── app.json                          # Konfigurasi Expo project
│   └── package.json                      # Dependency aplikasi mobile
│
├── server/                               # Backend REST API
│   ├── prisma/
│   │   ├── schema.prisma                 # Skema relational PostgreSQL
│   │   └── seed.ts                       # Seeding 1 Admin, 2 Guru, 5 Siswa
│   ├── src/
│   │   ├── controllers/                  # Controller login & getMe
│   │   ├── middleware/                   # Authenticate, authorize, errorHandler, validation
│   │   ├── routes/                       # Express router (/api/health, /api/auth, dll.)
│   │   ├── services/                     # Business logic auth & database query
│   │   ├── types/                        # DTO & types
│   │   ├── utils/                        # Prisma client, JWT signer, bcrypt
│   │   └── server.ts                     # Entry point Express
│   ├── .env.example                      # Template variabel lingkungan
│   ├── package.json                      # Dependency backend
│   └── tsconfig.json                     # Konfigurasi TypeScript backend
│
├── README.md                             # Dokumentasi lengkap
└── .gitignore                            # Berkas yang diabaikan Git
```

---

## 4. Persyaratan Sistem

Pastikan perangkat pengembangan Anda telah terinstal:
- **Node.js**: Versi 18.x atau 20.x LTS
- **npm** (v9+) atau **yarn**
- **PostgreSQL**: Versi 14, 15, atau 16
- **Expo CLI**: `npx expo`
- **Aplikasi Expo Go** (pada ponsel fisik Android / iOS) atau Simulator/Emulator:
  - **Android Studio** (Android Emulator dengan SDK 34+)
  - **Xcode** (iOS Simulator macOS)

---

## 5. Cara Install Backend

Masuk ke direktori `server`:
```bash
cd server
npm install
```

---

## 6. Setup PostgreSQL

1. Buat database baru bernama `sekolah_model` di server PostgreSQL lokal atau cloud Anda:
```sql
CREATE DATABASE sekolah_model;
```

2. Buat file `.env` di dalam folder `server/` dengan menyalin template `.env.example`:
```bash
cp .env.example .env
```

3. Sesuaikan connection string `DATABASE_URL` di dalam `server/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/sekolah_model?schema=public"
JWT_SECRET="sekolah-model-super-secret-jwt-key-2025"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

---

## 7. Prisma Migration & Generate

Jalankan perintah berikut di dalam direktori `server/`:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Terapkan migration database ke PostgreSQL
npm run prisma:migrate
```

Perintah di atas akan membuat tabel `users`, `teachers`, dan `students` beserta relasi 1-ke-1 dan foreign key yang valid.

---

## 8. Seed Database Development

Jalankan seeding development untuk mengisi data awal:

```bash
npm run prisma:seed
```

### Akun Development yang Dibuat:

| Peran | Email | Kata Sandi | Identitas Tambahan |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@sekolahmodel.sch.id` | `Admin123!` | Administrator Utama |
| **TEACHER** | `guru.budi@sekolahmodel.sch.id` | `Guru123!` | NIP: 198501152010011001 |
| **TEACHER** | `guru.siti@sekolahmodel.sch.id` | `Guru123!` | NIP: 198803202012022002 |
| **STUDENT** | `siswa.ahmad@sekolahmodel.sch.id` | `Siswa123!` | NIS: 24001, NISN: 0071234561 |
| **STUDENT** | `siswa.dewi@sekolahmodel.sch.id` | `Siswa123!` | NIS: 24002, NISN: 0071234562 |
| **STUDENT** | `siswa.reza@sekolahmodel.sch.id` | `Siswa123!` | NIS: 24003, NISN: 0071234563 |
| **STUDENT** | `siswa.anisa@sekolahmodel.sch.id` | `Siswa123!` | NIS: 24004, NISN: 0071234564 |
| **STUDENT** | `siswa.fajar@sekolahmodel.sch.id` | `Siswa123!` | NIS: 24005, NISN: 0071234565 |

> **Catatan Keamanan**: Seluruh kata sandi di-hash menggunakan algoritma `bcrypt` dengan salt 10 rounds. Password hash tidak pernah dikembalikan dalam response API apapun.

---

## 9. Menjalankan Backend Server

```bash
npm run dev
```
Backend akan aktif di `http://localhost:5000`.
- Health Check: `GET http://localhost:5000/api/health`
- Login: `POST http://localhost:5000/api/auth/login`
- Profil: `GET http://localhost:5000/api/auth/me`

---

## 10. Cara Install Mobile

Buka terminal baru dan masuk ke direktori `mobile`:
```bash
cd mobile
npm install
```

---

## 11. Konfigurasi Environment Mobile

Buat file `.env` di dalam folder `mobile/`:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

> **Perhatian Khusus Emulator & Perangkat Fisik**:
> - **Android Emulator**: Gunakan `http://10.0.2.2:5000/api` karena Android emulator memetakan host machine ke IP `10.0.2.2`.
> - **iOS Simulator**: Dapat langsung menggunakan `http://localhost:5000/api`.
> - **Perangkat Fisik (Expo Go via WiFi)**: Gunakan IP LAN komputer Anda, contoh: `http://192.168.1.100:5000/api`.

---

## 12. Cara Menjalankan Expo

Jalankan perintah:
```bash
npx expo start
```

Pilihan menjalankan:
- **Scan QR Code**: Buka aplikasi **Expo Go** pada iPhone (gunakan Camera bawaan) atau Android (gunakan aplikasi Expo Go) lalu scan QR Code di terminal.
- **Android Emulator**: Tekan huruf `a` di terminal (pastikan emulator aktif).
- **iOS Simulator**: Tekan huruf `i` di terminal (pada macOS dengan Xcode).
- **Web Browser**: Tekan huruf `w` di terminal.

---

## 13. Cara Build Aplikasi Mobile (Production)

Gunakan **EAS Build** (Expo Application Services) untuk menghasilkan file APK/AAB (Android) dan IPA (iOS):

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login ke akun Expo:
```bash
eas login
```

3. Konfigurasi project EAS:
```bash
eas build:configure
```

4. Jalankan build:
- **Android APK (Testing)**:
  ```bash
  eas build --platform android --profile preview
  ```
- **Android AAB (Google Play Store)**:
  ```bash
  eas build --platform android --profile production
  ```
- **iOS (Apple App Store / TestFlight)**:
  ```bash
  eas build --platform ios --profile production
  ```

---

## 14. Cara Konfigurasi API Production

Saat aplikasi mobile dan backend dideploy ke production:
1. Pasang SSL/TLS (HTTPS) pada server backend Express (contoh: `https://api.sekolahmodel.sch.id/api`).
2. Update variabel `EXPO_PUBLIC_API_URL` pada mobile build:
   ```env
   EXPO_PUBLIC_API_URL=https://api.sekolahmodel.sch.id/api
   ```
3. Atur CORS origin di `server/src/server.ts` agar menerima domain/request resmi aplikasi.
4. Pastikan `JWT_SECRET` production menggunakan string acak berkekuatan tinggi minimal 64 karakter.

---

## 15. Validasi Tahap 1 Selesai

- [x] Struktur aplikasi mobile React Native & Expo Router
- [x] Backend Express REST API terpisah & modular
- [x] Database PostgreSQL & Prisma ORM dengan relasi valid
- [x] Autentikasi JWT & bcrypt hashing
- [x] Penyimpanan token via `expo-secure-store`
- [x] Restorasi sesi otomatis saat aplikasi dibuka
- [x] Splash screen dengan logo dan branding Sekolah Model
- [x] Login screen dengan KeyboardAvoidingView dan error handling
- [x] Route protection di level frontend & middleware authorize di backend
- [x] Tiga dashboard role khusus (Admin, Guru, Siswa) tanpa blank screen
- [x] Seeding data development lengkap (1 Admin, 2 Guru, 5 Siswa)
- [x] Kompatibel penuh untuk Android dan iOS
