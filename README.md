# Loan Monitoring System

Aplikasi Next.js 14 untuk mencatat dan memantau pinjaman pribadi. Admin mengelola peminjam, pembayaran, dan membagikan halaman read-only melalui link unik.

## Menjalankan lokal

1. Buat project Firebase dan aktifkan **Authentication > Email/Password** serta Firestore.
2. Salin nilai Firebase Web App dan Service Account ke `.env.local`.
3. Instal dependensi dan jalankan:

   ```bash
   npm install
   npm run dev
   ```

4. Buat user admin di Firebase Authentication, salin UID-nya, lalu set custom claim:

   ```bash
   npm run set-admin -- UID_FIREBASE
   ```

5. Deploy rules dengan Firebase CLI bila tersedia: `firebase deploy --only firestore`.

### Vercel Blob untuk bukti transfer

1. Di Vercel project, buka **Storage** → **Create Database** → **Blob**.
2. Pilih akses **Private** lalu hubungkan store ke project.
3. Vercel otomatis menambahkan `BLOB_READ_WRITE_TOKEN` ke environment production.
4. Untuk lokal, salin token dari pengaturan Blob store ke `.env.local`.

File bukti disimpan di private Blob. Firestore hanya menyimpan metadata dan pathname; file disajikan melalui route aplikasi setelah autentikasi pemberi pinjaman atau validasi share token peminjam.

## Environment

Gunakan `.env.example` sebagai referensi. Untuk `FIREBASE_ADMIN_PRIVATE_KEY`, simpan newline sebagai `\\n` (umumnya format yang cocok untuk Vercel). Ubah `NEXT_PUBLIC_BASE_URL` ke domain produksi saat deploy.

## Pemeriksaan

```bash
npm run typecheck
npm run build
```

Halaman utama: `/`, `/login`, `/onboarding`, `/admin/dashboard`, `/admin/borrowers/new`, dan `/p/[shareToken]`.

Peminjam dapat masuk tanpa link melalui `/onboarding` memakai nama lengkap dan kode verifikasi 4 digit. Pencarian serta verifikasi dilakukan server-side; dokumen borrower menyimpan `nameNormalized` untuk pencarian case-insensitive dan `verifyCode` untuk verifikasi.
