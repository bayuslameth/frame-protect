/**
 * Watermarking domain types.
 * Prepared for future integration with Python FastAPI DCT watermark engine.
 */

export type WatermarkAlgorithm = "dct";

export type WatermarkPayloadType = "text" | "signature" | "binary";

export interface WatermarkConfig {
  algorithm: WatermarkAlgorithm;
  strength: number; // Embedding factor (alpha), e.g. 0.05 - 0.5
  frequencyBand: "low" | "mid" | "high";
  blockSize?: number; // Standard 8x8 DCT block size
  redundancy?: number; // Repetition/spread-spectrum redundancy factor
}

export interface WatermarkEmbedRequest {
  imageId: string;
  payloadType: WatermarkPayloadType;
  payload: string; // Plaintext or encoded binary string
  config: WatermarkConfig;
}

export interface WatermarkEmbedResponse {
  jobId: string;
  originalImageId: string;
  watermarkedImageUrl: string;
  watermarkHash: string;
  timestamp: string;
}

export interface WatermarkDetectRequest {
  imageId: string;
  expectedPayloadLength?: number;
  config: WatermarkConfig;
}

export interface WatermarkDetectResponse {
  jobId: string;
  isWatermarkDetected: boolean;
  extractedPayload?: string;
  confidenceScore: number; // 0.0 - 1.0
  timestamp: string;
}

