/**
 * Application constants for FRAME PROTECT.
 * Reflects project identity and Phase 1 scope.
 */

export const APP_NAME = "FRAME PROTECT";
export const APP_TAGLINE = "Protect the Image. Prove the Origin.";
export const APP_DESCRIPTION =
  "Digital watermarking and image-authenticity web application for photographers, creators, and students studying information security.";

export const CURRENT_PHASE = "Phase 1 — Frontend Foundation";

export interface NavRoute {
  label: string;
  href: string;
  description: string;
  badge?: string;
}

export const MAIN_NAV_ROUTES: NavRoute[] = [
  {
    label: "Home",
    href: "/",
    description: "Landing page & project overview",
  },
  {
    label: "Dashboard",
    href: "/app",
    description: "Application control center",
  },
  {
    label: "Protect",
    href: "/app/protect",
    description: "Watermark protection workflow",
  },
  {
    label: "Detect",
    href: "/app/detect",
    description: "Watermark detection workflow",
  },
  {
    label: "Attack Lab",
    href: "/app/attack-lab",
    description: "Image attack and resilience testing laboratory",
  },
  {
    label: "Results",
    href: "/app/results",
    description: "Analysis, verification verdict, and metrics",
  },
];

