# API EVIDENCE

Dokumentasi endpoint aktual yang terverifikasi aktif pada backend FastAPI (`localhost:8000`) dan digunakan selama eksperimen (Phase 13):

## 1. POST `/api/watermark/embed`
- **Fungsi**: Menerima image (multipart form-data), watermark text, secret key, embedding strength, dan DCT band. Melakukan block-based DCT embedding.
- **Status**: ACTIVE & VERIFIED

## 2. POST `/api/watermark/detect`
- **Fungsi**: Menerima image watermarked (multipart form-data) dan secret key. Melakukan ekstraksi bit watermark secara deterministik.
- **Status**: ACTIVE & VERIFIED

## 3. POST `/api/metrics/verify`
- **Fungsi**: Menghitung metrik baseline (PSNR, NC, BER) antara original image dan watermarked image.
- **Status**: ACTIVE & VERIFIED

## 4. POST `/api/attacks/test`
- **Fungsi**: Mensimulasikan single attack (JPEG, crop, resize, gaussian_noise, brightness, contrast) terhadap watermarked image dan secara internal memanggil fungsi ekstraksi untuk mengkalkulasi ketahanan (NC, BER).
- **Status**: ACTIVE & VERIFIED

*(Catatan: Endpoint lain seperti algoritma DWT atau Logo embedding belum aktif/frozen sesuai kesepakatan spesifikasi).*
