# UAS-PemwebLanjut-Juli

---
# Farrel Laogi Murjitama
# 202231096

Backlink ke kampus
# Kampus saya di **\[[https://itpln.ac.id/](linkto:https://itpln.ac.id/)]**.

# EcoConnect - Platform Donasi Proyek SDGs

**EcoConnect** adalah platform untuk mendukung proyek-proyek yang terkait dengan **Sustainable Development Goals (SDGs)**. Aplikasi ini memungkinkan pengguna untuk mengajukan proyek, memberikan donasi, berkomunikasi dengan admin, dan melihat peta interaktif proyek.

## **Fitur Utama**

* **Login/Register** menggunakan akun biasa atau Google OAuth
* **Pengajuan Proyek** untuk SDGs
* **Donasi** menggunakan Tripay API (QRIS, transfer bank, e-wallet)
* **Peta Interaktif** untuk melihat lokasi proyek
* **Forum Diskusi** untuk berkomunikasi antar pengguna
* **Chat dengan Admin** untuk konsultasi terkait proyek
* **Leaderboard** untuk melihat peringkat donasi pengguna
* **Pencairan Donasi** untuk proyek yang sudah mencapai target

## **Prasyarat**

Sebelum menjalankan aplikasi ini, pastikan bahwa Anda sudah menginstal **Node.js** dan **npm** (Node Package Manager) di sistem Anda.

* **Node.js**: [Download Node.js](https://nodejs.org/)
* **npm**: npm sudah terinstal bersama Node.js

## **Langkah-langkah Instalasi**

1. **Clone Repository**

   Clone repository ini ke mesin lokal Anda menggunakan Git:

   ```bash
   git clone https://github.com/username/ecoconnect.git
   ```

2. **Masuk ke Direktori Proyek**

   Pindah ke direktori proyek yang baru saja di-clone:

   ```bash
   cd ecoconnect
   ```

3. **Instalasi Dependensi**

   Install dependensi yang diperlukan menggunakan npm:

   ```bash
   npm install
   ```

4. **Mengatur File `.env`**

   Salin file `.env.example` menjadi `.env` dan sesuaikan variabel-variabel yang ada di dalamnya. Berikut adalah langkah-langkahnya:

   * Salin file `.env.example` menjadi `.env`:

     ```bash
     cp .env.example .env
     ```

   * Edit file `.env` menggunakan editor teks favorit Anda (seperti VSCode, Sublime Text, dll).

     Sesuaikan variabel-variabel berikut dengan nilai yang sesuai:

     ```
     # Server
     PORT=3000
     SESSION_SECRET=sesi_rahasia_kamu
     BASE_URL=http://localhost:3000

     # Database
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=
     DB_NAME=ecoconnect2

     # Google OAuth
     GOOGLE_CLIENT_ID=xxx
     GOOGLE_CLIENT_SECRET=xxx

     # Cloudinary
     CLOUDINARY_CLOUD_NAME=xxx
     CLOUDINARY_API_KEY=xxx
     CLOUDINARY_API_SECRET=xxx

     # Azure Maps
     AZURE_MAPS_KEY=xxx

     # Tripay
     TRIPAY_API_KEY=xxx
     TRIPAY_PRIVATE_KEY=xxx
     TRIPAY_MERCHANT_CODE=xxx
     TRIPAY_CALLBACK_URL=http://localhost:3000/donasi/callback
     ```

   * Pastikan Anda sudah memiliki akun dan API key untuk **Google OAuth**, **Cloudinary**, **Azure Maps**, dan **Tripay**.

5. **Menyiapkan Database**

   Buat database di MySQL dengan nama **ecoconnect2** (atau sesuai dengan yang ada di file `.env`).

   * Gunakan tool MySQL seperti phpMyAdmin atau command line untuk membuat database:

     ```sql
     CREATE DATABASE ecoconnect2;
     ```

   * Impor file SQL yang ada di dalam proyek (jika ada skema awal) untuk membuat tabel-tabel yang dibutuhkan.

6. **Menjalankan Aplikasi**

   Setelah semua konfigurasi selesai, Anda bisa menjalankan aplikasi dengan perintah berikut:

   ```bash
   node app.js
   ```

   Aplikasi akan berjalan di **[http://localhost:3000](http://localhost:3000)**. Buka browser Anda dan kunjungi URL tersebut untuk mengakses aplikasi.

## **Struktur Proyek**

```
/EcoConnect
├── /public/                    # Folder untuk file statis (CSS, JS, dll)
│   ├── css/styles.css
│   └── js/main.js
├── /views/                     # Folder untuk file HTML
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── adminDashboard.html
│   ├── formPengajuanProyek.html
│   ├── detailProyek.html
│   ├── checkout.html
│   ├── forum.html
│   ├── forumDetail.html
│   ├── map.html
│   ├── mapAdmin.html
│   ├── leaderboard.html
│   ├── chat.html
│   ├── adminChat.html
│   ├── withdraw.html
│   ├── laporanProyek.html
│   └── 404.html
├── /routes/                    # Folder untuk routing API
├── /controllers/               # Folder untuk controllers (logika backend)
├── /middleware/                # Folder untuk middleware (auth, session)
├── /config/                    # Folder untuk konfigurasi (database, API)
├── /database/ecoconnect_schema.sql  # File skema database
├── app.js                      # File utama aplikasi
├── .env.example                # Contoh file .env
├── package.json                # Daftar dependensi proyek
└── README.md                   # File README ini
```

## **Catatan Tambahan**

* **Google OAuth**: Anda perlu mengonfigurasi kredensial OAuth di [Google Developer Console](https://console.developers.google.com/) dan mendapatkan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`.
* **Tripay**: Pastikan untuk mendaftar di [Tripay](https://tripay.co.id/) dan dapatkan kredensial API untuk **TRIPAY\_API\_KEY**, **TRIPAY\_PRIVATE\_KEY**, dan **TRIPAY\_MERCHANT\_CODE**.
* **Cloudinary**: Daftar di [Cloudinary](https://cloudinary.com/) untuk mendapatkan **CLOUDINARY\_CLOUD\_NAME**, **CLOUDINARY\_API\_KEY**, dan **CLOUDINARY\_API\_SECRET**.
* **Azure Maps**: Daftar di [Azure Portal](https://portal.azure.com/) untuk mendapatkan **AZURE\_MAPS\_KEY**.

---

### **Masalah Umum**

* **Error "Cannot find module"**: Pastikan untuk menginstal dependensi dengan benar menggunakan `npm install`.
* **Error Koneksi Database**: Periksa apakah database sudah dibuat dan konfigurasi di file `.env` sudah benar.

---

### **Kontak**

Untuk pertanyaan lebih lanjut atau dukungan, silakan hubungi saya di **\[[farrel2231096@itpln.ac.id](mailto:farrel2231096_itpln_ac_id)]**.

---
