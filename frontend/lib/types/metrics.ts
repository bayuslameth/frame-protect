/**
 * Quality & Authenticity Metrics domain types.
 * Prepared for future integration with Python FastAPI analysis engine.
 */

export interface QualityMetrics {
  /**
   * Peak Signal-to-Noise Ratio (in dB).
   * Measures visual fidelity between original and watermarked/attacked image.
   * Typically > 35-40 dB represents visually imperceptible distortion.
   */
  psnr: number;

  /**
   * Normalized Correlation (0.0 to 1.0).
   * Measures correlation between original watermark payload and extracted watermark.
   * NC >= 0.70-0.90 typically signifies confident watermark identification.
   */
  nc: number;

  /**
   * Bit Error Rate (0.0 to 1.0).
   * Fraction of erroneous bits in the recovered watermark compared to original.
   * BER = 0.0 indicates 100% perfect watermark recovery.
   */
  ber: number;

  /**
   * Structural Similarity Index Measure (-1.0 to 1.0, optional).
   */
  ssim?: number;
}

export type AuthenticityVerdict =
  | "authentic" // High confidence watermark verified, low BER, high NC
  | "altered" // Watermark recovered despite distortions / attacks
  | "tampered" // Watermark severely corrupted or missing
  | "unverified"; // Analysis pending or not yet tested

export interface AnalysisResult {
  jobId: string;
  originalImageId: string;
  testedImageId: string;
  metrics: QualityMetrics;
  verdict: AuthenticityVerdict;
  notes?: string;
  timestamp: string;
}

