/**
 * Attack Laboratory domain types.
 * Prepared for future integration with Python FastAPI image distortion suite.
 */

export type AttackType =
  | "jpeg"
  | "crop"
  | "resize"
  | "gaussian_noise"
  | "brightness"
  | "contrast";

export interface JpegAttackParams {
  quality: number; // 1 - 100 (e.g. 50% compression)
}

export interface CropAttackParams {
  cropRatio: number; // 0.05 - 0.90 (fraction of frame removed)
  position: "center" | "top_left" | "top_right" | "bottom_left" | "bottom_right";
}

export interface ResizeAttackParams {
  scale: number; // 0.25 - 2.0 (scaling factor before restoring dimensions)
  interpolation: "nearest" | "bilinear" | "bicubic";
}

export interface GaussianNoiseAttackParams {
  stdDev: number; // Standard deviation / noise variance (e.g. 5 - 50)
  mean: number; // Default 0
}

export interface BrightnessAttackParams {
  factor: number; // < 1.0 darker, > 1.0 brighter (e.g. 0.5 - 1.5)
}

export interface ContrastAttackParams {
  factor: number; // < 1.0 lower contrast, > 1.0 higher contrast (e.g. 0.5 - 1.5)
}

export type AttackParamsMap = {
  jpeg: JpegAttackParams;
  crop: CropAttackParams;
  resize: ResizeAttackParams;
  gaussian_noise: GaussianNoiseAttackParams;
  brightness: BrightnessAttackParams;
  contrast: ContrastAttackParams;
};

export interface AttackConfig<T extends AttackType = AttackType> {
  type: T;
  params: AttackParamsMap[T];
}

export interface AttackSimulationRequest {
  imageId: string;
  attacks: AttackConfig[];
}

export interface AttackSimulationResponse {
  jobId: string;
  sourceImageId: string;
  attackedImageUrl: string;
  attacksApplied: AttackConfig[];
  timestamp: string;
}

