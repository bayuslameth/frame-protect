"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface WatermarkConfigPanelProps {
  className?: string;
  watermarkType: "text" | "logo";
  setWatermarkType: (v: "text" | "logo") => void;
  watermarkText: string;
  setWatermarkText: (v: string) => void;
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
  secretKey,
  setSecretKey,
  strength,
  setStrength,
  dctBand,
  setDctBand,
}: WatermarkConfigPanelProps) {
  const [showKey, setShowKey] = useState(false);

  const inputClass =
    "w-full h-10 bg-surface border border-border-strong px-3 text-[11px] font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors";

  return (
    <div className={cn("border border-border bg-surface p-6 space-y-6", className)}>
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest text-text-primary font-semibold">
            Watermark Configuration
          </h4>
          <p className="text-[10px] text-text-secondary font-mono tracking-wider mt-1 uppercase">
            DCT Frequency Domain
          </p>
        </div>
        <span className="font-mono text-[9px] text-black tracking-widest uppercase font-semibold">
          8 × 8 Blocks
        </span>
      </div>

      <div className="space-y-5">
        {/* Type Toggle */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
            Watermark Type
          </label>
          <div className="flex bg-surface border border-border-strong h-9">
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
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Payload */}
        <div className="space-y-2">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
            {watermarkType === "text" ? "Text Payload" : "Logo (Not Implemented)"}
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
            <div className="w-full h-10 bg-surface border border-border-strong flex items-center justify-center text-[10px] font-mono text-text-secondary uppercase tracking-widest">
              Logo support deferred to Phase 7
            </div>
          )}
        </div>

        {/* Secret Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
              Secret Key
            </label>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-[9px] font-mono uppercase tracking-widest text-text-secondary hover:text-black transition-colors font-semibold"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showKey ? "text" : "password"}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key"
            className={inputClass}
            autoComplete="off"
          />
          <p className="text-[9px] font-sans text-text-secondary">
            Used to deterministically select embedding blocks. Not stored.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Strength */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
              <span>Embed Strength</span>
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
              DCT Band
            </label>
            <div className="flex bg-surface border border-border-strong h-9">
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
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
