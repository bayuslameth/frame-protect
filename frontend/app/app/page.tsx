"use client";

import React, { useEffect, useState } from "react";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";

/* eslint-disable @next/next/no-img-element */

export default function DashboardPage() {
  const {
    asset,
    error,
    isDragging,
    isProcessing,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
    reset,
  } = useImageUpload();

  /*
   * Hydration guard.
   *
   * Server dan initial client render harus menghasilkan
   * markup yang sama. Asset dari browser hanya digunakan
   * setelah komponen benar-benar mounted.
   */
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /*
   * Jangan membaca asset untuk menentukan markup
   * sebelum hydration selesai.
   */
  const currentAsset = isMounted ? asset : null;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-12 px-4 py-12 sm:px-6 lg:px-10 xl:px-12">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="space-y-4 border-b border-border pb-8">

        <h1 className="font-serif text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
          Workspace Keamanan Citra
        </h1>

        <p className="max-w-3xl font-sans text-sm leading-relaxed text-text-secondary">
          Pusat kendali untuk penyisipan, ekstraksi, dan pengujian ketahanan watermark.
        </p>

      </div>

      {/* =====================================================
          WORKFLOW STEPPER
      ====================================================== */}
      <div className="space-y-6">

        <h2 className="font-sans text-xs uppercase tracking-widest text-text-secondary">
          Status Alur Kerja
        </h2>

        <WorkflowStepper
          currentStepId={currentAsset ? "configure" : "upload"}
        />

      </div>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">

        {/* ===================================================
            LEFT — IMAGE / WORKFLOW
        ==================================================== */}
        <div className="space-y-6 lg:col-span-8">

          <h2 className="border-b border-border pb-2 font-sans text-xs uppercase tracking-widest text-text-secondary">
            Citra Saat Ini
          </h2>

          {!currentAsset ? (

            <ImageUploadZone
              label="CITRA SUMBER"
              asset={null}
              error={error}
              isDragging={isDragging}
              isProcessing={isProcessing}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileChange={onFileChange}
              onReset={reset}
            />

          ) : (

            <div className="border border-border bg-surface">

              {/* IMAGE HEADER */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">

                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-text-primary">
                  CITRA SUMBER / SIAP
                </span>

                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-[9px] uppercase tracking-widest text-text-secondary transition-colors hover:text-error"
                >
                  [ HAPUS CITRA ]
                </button>

              </div>

              {/* IMAGE */}
              <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-background p-4 lg:min-h-[620px]">

                <img
                  src={currentAsset.previewUrl}
                  alt="Citra Sumber"
                  className="relative z-10 max-h-[580px] w-full object-contain"
                />

              </div>

              {/* IMAGE METADATA STRIP */}
              <div className="grid grid-cols-2 border-t border-border sm:grid-cols-3">

                <div className="border-r border-border p-4">

                  <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                    FORMAT
                  </span>

                  <span className="mt-1 block font-mono text-[10px] font-semibold uppercase text-text-primary">
                    {currentAsset.metadata.type.split("/")[1] ||
                      currentAsset.metadata.type}
                  </span>

                </div>

                <div className="border-r border-border p-4">

                  <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                    DIMENSI
                  </span>

                  <span className="mt-1 block font-mono text-[10px] font-semibold uppercase text-text-primary">
                    {currentAsset.metadata.width} ×{" "}
                    {currentAsset.metadata.height}
                  </span>

                </div>

                <div className="hidden p-4 sm:block">

                  <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                    STATUS
                  </span>

                  <span className="mt-1 block font-mono text-[10px] font-semibold uppercase text-text-primary">
                    SIAP
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* ===================================================
            RIGHT — TECHNICAL AUDIT
        ==================================================== */}
        <div className="space-y-6 lg:col-span-4">

          <h2 className="border-b border-border pb-2 font-sans text-xs uppercase tracking-widest text-text-secondary">
            Informasi Teknis
          </h2>

          <div className="space-y-7 border border-border bg-surface p-6 lg:p-7">

            {/* ENGINE STATUS */}
            <div className="space-y-2">

              <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                Status Mesin
              </span>

              <span className="flex items-center gap-2 font-mono text-xs text-text-primary">

                <span className="h-1.5 w-1.5 rounded-full bg-success" />

                <span>
                  AKTIF (Pemrosesan Lokal)
                </span>

              </span>

            </div>

            {/* IMAGE METADATA */}
            {currentAsset && (

              <div className="space-y-4 border-t border-border pt-5">

                <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                  Metadata Citra
                </span>

                <div className="grid grid-cols-2 gap-5">

                  <div>

                    <span className="block font-mono text-[9px] text-text-secondary">
                      FORMAT
                    </span>

                    <span className="mt-1 block font-mono text-[11px] uppercase text-text-primary">
                      {currentAsset.metadata.type.split("/")[1] ||
                        currentAsset.metadata.type}
                    </span>

                  </div>

                  <div>

                    <span className="block font-mono text-[9px] text-text-secondary">
                      DIMENSI
                    </span>

                    <span className="mt-1 block font-mono text-[11px] uppercase text-text-primary">
                      {currentAsset.metadata.width} ×{" "}
                      {currentAsset.metadata.height}
                    </span>

                  </div>

                </div>

              </div>

            )}

            {/* ACTIVE KEY */}
            <div className="space-y-2 border-t border-border pt-5">

              <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                Kunci Aktif
              </span>

              <span className="block font-mono text-xs text-text-secondary">
                —
              </span>

            </div>

            {/* RECENT METRICS */}
            <div className="space-y-4 border-t border-border pt-5">

              <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                Metrik Terkini
              </span>

              <div className="grid grid-cols-2 gap-5">

                <div>

                  <span className="block font-mono text-[9px] text-text-secondary">
                    PSNR
                  </span>

                  <span className="mt-1 block font-mono text-sm font-semibold text-text-primary">
                    —
                  </span>

                </div>

                <div>

                  <span className="block font-mono text-[9px] text-text-secondary">
                    NC
                  </span>

                  <span className="mt-1 block font-mono text-sm font-semibold text-text-primary">
                    —
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}