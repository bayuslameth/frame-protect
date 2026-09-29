"use client";
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface WatermarkConfigPanelProps {
  className?: string;
  watermarkType: "text" | "logo";
  setWatermarkType: (v: "text" | "logo") => void;
  watermarkText: string;
  setWatermarkText: (v: string) => void;
  watermarkFile?: File | null;
  setWatermarkFile?: (v: File | null) => void;
  secretKey: string;
  setSecretKey: (v: string) => void;
  strength: number;
  setStrength: (v: number) => void;
  dctBand: "low" | "mid" | "high";
  setDctBand: (v: "low" | "mid" | "high") => void;
}

export function WatermarkConfigPanel({
  className,
  watermarkType,
  setWatermarkType,
  watermarkText,
  setWatermarkText,
  watermarkFile,
  setWatermarkFile,
  secretKey,
  setSecretKey,
  strength,
  setStrength,
  dctBand,
  setDctBand,
}: WatermarkConfigPanelProps) {
  const [showKey, setShowKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full h-10 bg-white border border-[#000000] px-3 text-[11px] font-mono font-bold text-[#000000] placeholder:text-[#555555] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-1 transition-colors";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (setWatermarkFile) setWatermarkFile(e.target.files[0]);
    }
  };

  return (
    <div className={cn("border border-[#000000] bg-surface p-6 space-y-6", className)}>
      <div className="flex items-end justify-between border-b border-[#000000] pb-4">
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest text-text-primary font-semibold">
            Konfigurasi Watermark
          </h4>
          <p className="text-[10px] text-text-secondary font-mono tracking-wider mt-1 uppercase">
            Domain Frekuensi DCT
          </p>
        </div>
        <span className="font-mono text-[9px] text-black tracking-widest uppercase font-semibold">
          Blok 8 × 8
        </span>
      </div>

      <div className="space-y-5">
        {/* Type Toggle */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
            Jenis Watermark
          </label>
          <div className="flex bg-surface border border-[#000000] h-9">
            {(["text", "logo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setWatermarkType(t)}
                className={cn(
                  "flex-1 text-[10px] font-mono uppercase tracking-widest transition-colors font-semibold",
                  watermarkType === t
                    ? "bg-black text-white"
                    : "text-text-secondary hover:text-black hover:bg-surface-soft"
                )}
              >
                {t === "text" ? "Teks" : "Logo"}
              </button>
            ))}
          </div>
        </div>

        {/* Payload */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
            {watermarkType === "text" ? "Teks Watermark" : "Logo Watermark (Citra)"}
          </label>
          {watermarkType === "text" ? (
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="FRAME PROTECT © 2026"
              className={inputClass}
            />
          ) : (
            <div className="flex items-center space-x-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/png, image/jpeg" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="h-10 px-4 bg-white border border-[#000000] text-[10px] font-mono uppercase tracking-widest text-black hover:bg-surface-soft transition-colors"
              >
                Pilih Logo
              </button>
              <span className="text-[10px] font-mono text-text-secondary truncate max-w-[150px]">
                {watermarkFile ? watermarkFile.name : "Belum ada file"}
              </span>
            </div>
          )}
        </div>

        {/* Secret Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
              Kunci Rahasia
            </label>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-[9px] font-mono uppercase tracking-widest text-text-secondary hover:text-black transition-colors font-semibold"
            >
              {showKey ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
          <input
            type={showKey ? "text" : "password"}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Masukkan kunci rahasia"
            className={inputClass}
            autoComplete="off"
          />
          <p className="text-[9px] font-sans text-text-secondary">
            Digunakan untuk menentukan blok penyisipan secara deterministik. Tidak disimpan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Strength */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
              <span>Kekuatan Penyisipan</span>
              <span className="text-black">{strength.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[9px] font-mono text-text-secondary font-semibold">
              <span>0.05</span>
              <span>0.50</span>
            </div>
          </div>

          {/* DCT Band */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
              Frekuensi DCT
            </label>
            <div className="flex bg-surface border border-[#000000] h-9">
              {(["low", "mid", "high"] as const).map((b) => (
                <button
                  key={b}
                  disabled={b !== "mid"}
                  onClick={() => setDctBand(b)}
                  className={cn(
                    "flex-1 text-[10px] font-mono uppercase tracking-widest transition-colors font-semibold",
                    dctBand === b
                      ? "bg-black text-white"
                      : "text-text-secondary hover:text-black",
                    b !== "mid" && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {b === "low" ? "Rendah" : b === "mid" ? "Menengah" : "Tinggi"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
