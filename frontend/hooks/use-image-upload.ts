"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageAsset, ImageValidationError } from "@/lib/types";
import { validateImageFile, extractImageMetadata } from "@/lib/image-utils";

export function useImageUpload() {
  const [asset, setAsset] = useState<ImageAsset | null>(null);
  const [error, setError] = useState<ImageValidationError>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cleanup object URL when component unmounts or asset changes
  useEffect(() => {
    return () => {
      if (asset?.previewUrl) {
        URL.revokeObjectURL(asset.previewUrl);
      }
    };
  }, [asset]);

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      setIsProcessing(false);
      return;
    }

    try {
      const metadata = await extractImageMetadata(file);
      const previewUrl = URL.createObjectURL(file);
      
      setAsset({
        file,
        previewUrl,
        metadata,
      });
    } catch (error) {
      console.error(error);
      setError("IMAGE_UNREADABLE");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
    // Reset input value to allow selecting the same file again if it was removed
    e.target.value = '';
  }, []);

  const reset = useCallback(() => {
    if (asset?.previewUrl) {
      URL.revokeObjectURL(asset.previewUrl);
    }
    setAsset(null);
    setError(null);
  }, [asset]);

  return {
    asset,
    error,
    isDragging,
    isProcessing,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
    reset,
  };
}
