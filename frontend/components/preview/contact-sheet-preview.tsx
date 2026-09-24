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
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
          Contact Sheet
        </span>
        <span className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase">
          1:1 Comparison
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {[
          { title: leftTitle, img: leftImage, label: "#A" },
          { title: rightTitle, img: rightImage, label: "#B" },
        ].map(({ title, img, label }) => (
          <div key={label} className="bg-surface flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-soft">
              <span className="font-mono text-[10px] text-text-secondary tracking-widest">
                {title}
              </span>
              <span className="font-mono text-[9px] text-text-tertiary">
                {label}
              </span>
            </div>
            <div className="relative aspect-[3/2] flex items-center justify-center overflow-hidden bg-surface-soft">
              {img ? (
                <img
                  src={img.previewUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="w-px h-8 bg-border" />
                    <div className="h-px w-8 bg-border absolute" />
                  </div>
                  <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest mt-4">
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
