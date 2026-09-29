/**
 * Application constants for FRAME PROTECT.
 * Reflects project identity and Phase 1 scope.
 */

export const APP_NAME = "FRAME PROTECT";
export const APP_TAGLINE = "Lindungi Citra. Buktikan Keaslian.";
export const APP_DESCRIPTION =
  "Aplikasi web watermarking digital dan autentikasi citra untuk fotografer, kreator, dan mahasiswa bidang keamanan informasi.";

export const CURRENT_PHASE = "Fase 1 — Fondasi Antarmuka";

export interface NavRoute {
  label: string;
  href: string;
  description: string;
  badge?: string;
}

export const MAIN_NAV_ROUTES: NavRoute[] = [
  {
    label: "Beranda",
    href: "/",
    description: "Halaman utama & ringkasan proyek",
  },
  {
    label: "Workspace",
    href: "/app",
    description: "Pusat kendali aplikasi",
  },
  {
    label: "Lindungi",
    href: "/app/protect",
    description: "Alur kerja penyisipan watermark",
  },
  {
    label: "Deteksi",
    href: "/app/detect",
    description: "Alur kerja deteksi watermark",
  },
  {
    label: "Uji Ketahanan",
    href: "/app/attack-lab",
    description: "Laboratorium pengujian ketahanan citra terhadap distorsi",
  },
  {
    label: "Hasil",
    href: "/app/results",
    description: "Analisis, status verifikasi, dan metrik",
  },
];

