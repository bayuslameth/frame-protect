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
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-black font-semibold">
          Contact Sheet
        </span>
        <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
          1:1 Comparison
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-strong border border-border-strong">
        {[
          { title: leftTitle, img: leftImage, label: "#A" },
          { title: rightTitle, img: rightImage, label: "#B" },
        ].map(({ title, img, label }) => (
          <div key={label} className="bg-surface flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-strong bg-white">
              <span className="font-mono text-[10px] text-black tracking-widest font-semibold">
                {title}
              </span>
              <span className="font-mono text-[9px] text-text-secondary font-semibold">
                {label}
              </span>
            </div>
            <div className="relative aspect-[3/2] flex items-center justify-center overflow-hidden bg-white">
              {img ? (
                <img
                  src={img.previewUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="w-px h-8 bg-border-strong" />
                    <div className="h-px w-8 bg-border-strong absolute" />
                  </div>
                  <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest mt-4 font-semibold">
                    Awaiting Input
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
