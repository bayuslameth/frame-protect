/**
 * Experiment session and result types for Phase 7 Results Analysis.
 * All values must originate from real backend computations.
 */

export type ExperimentAttackType =
  | "baseline"
  | "jpeg"
  | "crop"
  | "resize"
  | "gaussian_noise"
  | "brightness"
  | "contrast";

export type ExtractionStatus = "DETECTED" | "FAILED";

export interface ExperimentResult {
  experimentId: string;
  sessionId: string;
  timestamp: string;

  // Watermark info
  watermarkType: "text";
  watermarkPayloadDescription: string; // text content — NOT the secret key

  // Original image dimensions (before any attack)
  imageWidth: number;
  imageHeight: number;

  // Attack applied
  attackType: ExperimentAttackType;
  attackParameter: number | null; // null for baseline

  // Attacked image dimensions (same as original for non-dimension-changing attacks)
  attackedWidth: number;
  attackedHeight: number;

  // Extraction result
  extractionStatus: ExtractionStatus;
  extractedWatermark: string;

  // Metrics
  psnr: number | null;  // null when dimensions differ or unavailable
  nc: number | null;
  ber: number | null;

  // Error message if the experiment failed outright
  error: string | null;

  // Optional processing duration in ms
  duration: number | null;
}

export interface ExperimentSession {
  sessionId: string;
  createdAt: string;
  imageFileName: string;
  imageWidth: number;
  imageHeight: number;
  watermarkText: string;
  // Contains baseline (attackType="baseline") and all attack results
  results: ExperimentResult[];
}
