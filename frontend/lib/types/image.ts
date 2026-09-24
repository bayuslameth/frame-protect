export type ImageMetadata = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  aspectRatio: number;
  lastModified?: number;
};

export type ImageAsset = {
  file: File;
  previewUrl: string;
  metadata: ImageMetadata;
};

export type ImageValidationError =
  | "INVALID_FORMAT"
  | "FILE_TOO_LARGE"
  | "IMAGE_UNREADABLE"
  | null;
