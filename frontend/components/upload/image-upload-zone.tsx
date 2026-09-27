"use client";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { ImageAsset, ImageValidationError } from "@/lib/types";

interface ImageUploadZoneProps {
  className?: string;
  label?: string;
  accept?: string;
  asset: ImageAsset | null;
  error: ImageValidationError;
  isDragging: boolean;
  isProcessing: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export function ImageUploadZone({
  className,
  label = "SOURCE IMAGE",
  accept = "JPEG / PNG / WEBP",
  asset,
  error,
  isDragging,
  isProcessing,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onReset,
}: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (!asset) fileInputRef.current?.click();
  };

  const getErrorText = (err: ImageValidationError) => {
    switch (err) {
      case "INVALID_FORMAT":
        return "Unsupported format. Accepted: JPG · PNG · WEBP";
      case "FILE_TOO_LARGE":
        return "File exceeds limit. Maximum size: 20 MB";
      case "IMAGE_UNREADABLE":
        return "Image could not be read. Please select another file.";
      default:
        return "";
    }
  };

  if (asset) {
    return (
      <div className={cn("border border-border bg-surface p-5 space-y-4", className)}>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
            {label}
          </span>
          <span className="font-mono text-[9px] text-success tracking-widest uppercase">
            Ready
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {[
            [
              "Format",
              asset.metadata.type.split("/")[1]?.toUpperCase() ||
                asset.metadata.type,
            ],
            ["Size", `${(asset.metadata.size / (1024 * 1024)).toFixed(2)} MB`],
            [
              "Dimensions",
              `${asset.metadata.width} × ${asset.metadata.height}`,
            ],
            ["Color", "RGB"],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="block font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                {k}
              </span>
              <span className="block font-mono text-[11px] text-text-primary">
                {v}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-mono uppercase tracking-widest text-text-secondary hover:text-error transition-colors"
        >
          [ Remove Image ]
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      aria-label={`Upload ${label}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={cn(
        "relative flex flex-col items-center justify-center p-12 text-center transition-all cursor-pointer select-none",
        "border border-dashed group",
        error
          ? "border-error bg-[#9E5B5B]/5"
          : isDragging
          ? "border-border-strong bg-surface-soft"
          : "border-border bg-surface hover:border-border-strong hover:bg-surface-soft",
        isProcessing && "opacity-60 cursor-wait",
        className
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="sr-only"
        accept="image/jpeg, image/png, image/webp"
        aria-hidden="true"
      />

      {/* Crop Marks */}
      {[
        "top-0 left-0 border-t border-l",
        "top-0 right-0 border-t border-r",
        "bottom-0 left-0 border-b border-l",
        "bottom-0 right-0 border-b border-r",
      ].map((pos) => (
        <div
          key={pos}
          className={cn(
            "absolute w-3 h-3 transition-colors",
            pos,
            error ? "border-error" : "border-border-strong"
          )}
        />
      ))}

      <div className="space-y-2 relative z-10">
        <p
          className={cn(
            "font-mono text-xs uppercase tracking-widest",
            error ? "text-error" : "text-text-primary"
          )}
        >
          {error ? "Upload Failed" : isDragging ? "Drop Image Here" : label}
        </p>
        {error ? (
          <p className="text-[10px] text-error font-sans">{getErrorText(error)}</p>
        ) : (
          <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">
            {isProcessing ? "Processing..." : accept}
          </p>
        )}
      </div>

      {!error && (
        <p className="mt-5 text-[10px] text-text-secondary font-mono tracking-widest uppercase relative z-10">
          {isDragging ? "Release to upload" : "Click or drag & drop"}
        </p>
      )}
    </div>
  );
}
