import { ImageMetadata, ImageValidationError } from "./types";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): ImageValidationError {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return "INVALID_FORMAT";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "FILE_TOO_LARGE";
  }
  return null;
}

export function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        lastModified: file.lastModified,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("IMAGE_UNREADABLE"));
    };
    
    img.src = url;
  });
}

export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}
