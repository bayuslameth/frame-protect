/**
 * FastAPI backend endpoint constants.
 * Outlines the contract for future Phase 2 integration.
 */

export const API_ENDPOINTS = {
  HEALTH: "/api/v1/health",
  WATERMARK: {
    EMBED: "/api/v1/watermark/embed",
    DETECT: "/api/v1/watermark/detect",
    CONFIG_OPTIONS: "/api/v1/watermark/config-options",
  },
  ATTACK: {
    SIMULATE: "/api/v1/attack/simulate",
    PRESETS: "/api/v1/attack/presets",
  },
  METRICS: {
    EVALUATE: "/api/v1/metrics/evaluate",
  },
  IMAGES: {
    UPLOAD: "/api/v1/images/upload",
    DOWNLOAD: (id: string) => `/api/v1/images/${id}/download`,
  },
} as const;

