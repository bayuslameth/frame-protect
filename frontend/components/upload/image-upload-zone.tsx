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
  label = "CITRA SUMBER",
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
        return "Format tidak didukung. Format yang diterima: JPG · PNG · WEBP";
      case "FILE_TOO_LARGE":
        return "Ukuran file melebihi batas. Maksimum: 20 MB";
      case "IMAGE_UNREADABLE":
        return "Citra tidak dapat dibaca. Silakan pilih file lain.";
      default:
        return "";
    }
  };

  // Loaded state
  if (asset) {
    return (
      <div className={cn("border border-[#000000] bg-surface", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#000000] bg-surface-soft">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-primary font-semibold">
            {label}
          </span>
          <span className="font-mono text-[8px] text-success tracking-widest uppercase">
            ● Siap
          </span>
        </div>

        {/* Metadata grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {[
            ["Format", asset.metadata.type.split("/")[1]?.toUpperCase() || asset.metadata.type],
            ["Ukuran", `${(asset.metadata.size / (1024 * 1024)).toFixed(2)} MB`],
            ["Dimensi", `${asset.metadata.width} × ${asset.metadata.height}`],
            ["Ruang Warna", "RGB"],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="block font-mono text-[8px] text-text-tertiary uppercase tracking-widest">
                {k}
              </span>
              <span className="block font-mono text-[10px] text-text-primary mt-0.5">
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Remove */}
        <div className="px-4 py-2.5 border-t border-border">
          <button
            onClick={onReset}
            className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary hover:text-error transition-colors duration-150"
          >
            [ Hapus Citra ]
          </button>
        </div>
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
      aria-label={`Unggah ${label}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={cn(
        "relative flex flex-col items-center justify-center p-12 text-center transition-colors duration-150 cursor-pointer select-none",
        "border border-dashed",
        error
          ? "border-error bg-error/5"
          : isDragging
          ? "border-text-primary bg-surface-soft"
          : "border-[#000000] bg-background hover:border-text-tertiary hover:bg-surface-soft",
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

      {/* Corner crop marks */}
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
            error ? "border-error" : "border-text-tertiary"
          )}
        />
      ))}

      <div className="space-y-1.5 relative z-10">
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest",
            error ? "text-error" : "text-text-primary"
          )}
        >
          {error ? "Gagal Mengunggah" : isDragging ? "Lepaskan Citra di Sini" : label}
        </p>
        {error ? (
          <p className="text-[9px] text-error font-sans max-w-[200px]">
            {getErrorText(error)}
          </p>
        ) : (
          <p className="text-[9px] text-text-tertiary font-mono uppercase tracking-wider">
            {isProcessing ? "Memproses..." : accept}
          </p>
        )}
      </div>

      {!error && (
        <p className="mt-6 text-[9px] text-text-tertiary font-mono tracking-widest uppercase relative z-10">
          {isDragging ? "Lepaskan untuk mengunggah" : "Klik atau seret & lepas citra di sini"}
        </p>
      )}
    </div>
  );
}
