import React from "react";
import { cn } from "@/lib/utils";
import { ImageAsset } from "@/lib/types";
/* eslint-disable @next/next/no-img-element */

interface ContactSheetPreviewProps {
  className?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftImage?: ImageAsset | null;
  rightImage?: ImageAsset | null;
}

export function ContactSheetPreview({
  className,
  leftTitle = "ORIGINAL FRAME",
  rightTitle = "PROCESSED FRAME",
  leftImage,
  rightImage,
}: ContactSheetPreviewProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-primary font-semibold">
          Contact Sheet
        </span>
        <span className="font-mono text-[8px] text-text-tertiary tracking-widest uppercase">
          1 : 1 Comparison
        </span>
      </div>

      {/* Frame grid */}
      <div className="grid grid-cols-2 gap-px bg-border border border-border">
        {[
          { title: leftTitle, img: leftImage, label: "A" },
          { title: rightTitle, img: rightImage, label: "B" },
        ].map(({ title, img, label }) => (
          <div key={label} className="bg-surface flex flex-col">
            {/* Frame label bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface-soft">
              <span className="font-mono text-[8px] text-text-primary tracking-widest uppercase font-semibold">
                {title}
              </span>
              <span className="font-mono text-[7px] text-text-tertiary">#{label}</span>
            </div>

            {/* Frame content */}
            <div className="relative aspect-[3/2] flex items-center justify-center overflow-hidden bg-surface-soft img-grid-bg">
              {img ? (
                <img
                  src={img.previewUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {/* Crosshair */}
                  <div className="relative w-8 h-8">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                  </div>
                  <p className="font-mono text-[8px] text-text-tertiary uppercase tracking-widest">
                    Awaiting
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
