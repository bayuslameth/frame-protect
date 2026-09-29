"use client";

import React, { useEffect, useState } from "react";
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

interface ViewerImage {
  src: string;
  title: string;
}

export function ContactSheetPreview({
  className,
  leftTitle = "CITRA SUMBER",
  rightTitle = "CITRA BER-WATERMARK",
  leftImage,
  rightImage,
}: ContactSheetPreviewProps) {
  const [viewerImage, setViewerImage] =
    useState<ViewerImage | null>(null);

  const [zoom, setZoom] = useState(1);

  const openViewer = (
    src: string,
    title: string
  ) => {
    setViewerImage({
      src,
      title,
    });
    setZoom(1);
  };

  const closeViewer = () => {
    setViewerImage(null);
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(current + 0.25, 3)
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(current - 0.25, 0.5)
    );
  };

  const resetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    if (!viewerImage) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [viewerImage]);

  const frames = [
    {
      title: leftTitle,
      img: leftImage,
      label: "A",
    },
    {
      title: rightTitle,
      img: rightImage,
      label: "B",
    },
  ];

  return (
    <>
      <div
        className={cn(
          "space-y-3",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#000000] pb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-primary font-semibold">
            Lembar Kontak
          </span>

          <span className="font-mono text-[8px] text-text-tertiary tracking-widest uppercase">
            Klik citra untuk memperbesar
          </span>
        </div>

        {/* Frame grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-[#000000] border border-[#000000]">
          {frames.map(
            ({
              title,
              img,
              label,
            }) => (
              <div
                key={label}
                className="bg-white flex flex-col min-w-0"
              >
                {/* Frame label bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#000000] bg-surface-soft">
                  <span className="font-mono text-[8px] text-[#000000] tracking-widest uppercase font-bold">
                    {title}
                  </span>

                  <span className="font-mono text-[7px] text-[#444444] font-bold">
                    #{label}
                  </span>
                </div>

                {/* Frame content */}
                <div
                  className={cn(
                    "relative min-h-[360px] lg:min-h-[460px]",
                    "flex items-center justify-center",
                    "overflow-hidden bg-surface-soft img-grid-bg",
                    img
                      ? "cursor-zoom-in"
                      : ""
                  )}
                  onClick={() => {
                    if (img?.previewUrl) {
                      openViewer(
                        img.previewUrl,
                        title
                      );
                    }
                  }}
                  role={
                    img
                      ? "button"
                      : undefined
                  }
                  tabIndex={
                    img ? 0 : undefined
                  }
                  onKeyDown={(event) => {
                    if (
                      img?.previewUrl &&
                      (event.key ===
                        "Enter" ||
                        event.key ===
                        " ")
                    ) {
                      event.preventDefault();

                      openViewer(
                        img.previewUrl,
                        title
                      );
                    }
                  }}
                >
                  {img ? (
                    <>
                      <img
                        src={img.previewUrl}
                        alt={title}
                        className="w-full h-full object-contain"
                      />

                      {/* Image action hint */}
                      <div className="absolute bottom-3 right-3 pointer-events-none">
                        <span className="inline-flex items-center gap-2 border border-[#000000] bg-white/95 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-widest text-[#000000]">
                          Perbesar
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {/* Crosshair */}
                      <div className="relative w-10 h-10">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#000000]" />

                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#000000]" />

                        <div className="absolute inset-[9px] border border-[#000000]" />
                      </div>

                      <p className="font-mono text-[8px] text-[#000000] font-bold uppercase tracking-widest mt-1">
                        Menunggu
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Image Viewer */}
      {viewerImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Penampil citra: ${viewerImage.title}`}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeViewer();
            }
          }}
        >
          {/* Viewer Header */}
          <div className="flex items-center justify-between shrink-0 border-b border-white/20 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white">
                {viewerImage.title}
              </span>

              <span className="font-mono text-[8px] uppercase tracking-widest text-white/50">
                {Math.round(
                  zoom * 100
                )}
                %
              </span>
            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={closeViewer}
              className="fixed top-16 right-5 z-[200] flex h-14 w-14 items-center justify-center text-white transition-all duration-150 hover:scale-110 hover:text-gray-300 active:scale-95"
              aria-label="Tutup penampil citra"
              title="Tutup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          {/* Viewer Image Area */}
          <div
            className="relative flex-1 min-h-0 overflow-auto flex items-center justify-center p-4 sm:p-8"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeViewer();
              }
            }}
          >
            <img
              src={viewerImage.src}
              alt={viewerImage.title}
              className="max-w-none max-h-none select-none object-contain transition-transform duration-150"
              style={{
                width: `${zoom * 100}%`,
                height: "auto",
                maxWidth:
                  zoom <= 1
                    ? "100%"
                    : "none",
                maxHeight:
                  zoom <= 1
                    ? "100%"
                    : "none",
              }}
              draggable={false}
            />
          </div>

          {/* Viewer Controls */}
          <div className="shrink-0 flex items-center justify-center border-t border-white/20 px-4 py-3">
            <div className="flex items-center border border-white/30">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                className="h-9 w-10 border-r border-white/30 font-mono text-sm text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                aria-label="Perkecil"
              >
                −
              </button>

              <button
                type="button"
                onClick={resetZoom}
                className="h-9 min-w-16 px-3 font-mono text-[8px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="h-9 w-10 border-l border-white/30 font-mono text-sm text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                aria-label="Perbesar"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}