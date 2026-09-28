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
      <div className="flex items-center justify-between border-b border-[#000000] pb-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-primary font-semibold">
          Contact Sheet
        </span>
        <span className="font-mono text-[8px] text-text-tertiary tracking-widest uppercase">
          1 : 1 Comparison
        </span>
      </div>

      {/* Frame grid */}
      <div className="grid grid-cols-2 gap-px bg-[#000000] border border-[#000000]">
        {[
          { title: leftTitle, img: leftImage, label: "A" },
          { title: rightTitle, img: rightImage, label: "B" },
        ].map(({ title, img, label }) => (
          <div key={label} className="bg-white flex flex-col">
            {/* Frame label bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#000000] bg-surface-soft">
              <span className="font-mono text-[8px] text-[#000000] tracking-widest uppercase font-bold">
                {title}
              </span>
              <span className="font-mono text-[7px] text-[#444444] font-bold">#{label}</span>
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
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[#000000]" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#000000]" />
                  </div>
                  <p className="font-mono text-[8px] text-[#000000] font-bold uppercase tracking-widest mt-1">
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
