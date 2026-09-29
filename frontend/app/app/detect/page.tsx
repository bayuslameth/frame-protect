"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import { Button } from "@/components/ui/button";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import {
  useImageUpload,
} from "@/hooks/use-image-upload";
import {
  detectWatermark,
  DetectResponse,
} from "@/services/api/watermark.service";
import {
  useWorkflowState,
} from "@/hooks/use-workflow-state";
import { cn } from "@/lib/utils";

export default function DetectPage() {
  const {
    asset,
    error: uploadError,
    isDragging,
    isProcessing: isUploading,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
    reset: resetUpload,
  } = useImageUpload();

  const { baselineContext } =
    useWorkflowState();

  // =========================================================
  // STABLE INITIAL STATE
  // Prevents server/client hydration mismatch.
  // =========================================================
  const [secretKey, setSecretKey] =
    useState("");

  const [refType, setRefType] =
    useState<"text" | "logo">("text");

  const [originalText, setOriginalText] =
    useState("");

  const [originalFile, setOriginalFile] =
    useState<File | null>(null);

  // =========================================================
  // DETECTION STATE
  // =========================================================
  const [isDetecting, setIsDetecting] =
    useState(false);

  const [detectError, setDetectError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<DetectResponse | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =========================================================
  // SYNC BASELINE CONTEXT
  // =========================================================
  useEffect(() => {
    if (baselineContext?.secretKey) {
      setSecretKey(
        baselineContext.secretKey
      );
    }

    if (baselineContext?.watermarkText) {
      setOriginalText(
        baselineContext.watermarkText
      );
    }
  }, [baselineContext]);

  // =========================================================
  // DETECT WATERMARK
  // =========================================================
  const handleDetect = async () => {
    if (!asset || !secretKey) {
      return;
    }

    setIsDetecting(true);
    setDetectError(null);
    setResult(null);

    try {
      const res = await detectWatermark({
        image: asset.file,
        secret_key: secretKey,
        original_watermark_text:
          refType === "text"
            ? originalText || undefined
            : undefined,
        original_watermark_file:
          refType === "logo"
            ? originalFile || undefined
            : undefined,
      });

      setResult(res as any);
    } catch (e: unknown) {
      setDetectError(
        e instanceof Error
          ? e.message
          : String(e)
      );
    } finally {
      setIsDetecting(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================
  const handleReset = () => {
    resetUpload();
    setResult(null);
    setDetectError(null);
  };

  // =========================================================
  // REFERENCE LOGO
  // =========================================================
  const handleRefFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files.length > 0
    ) {
      setOriginalFile(
        e.target.files[0]
      );
    }
  };

  // =========================================================
  // DETECT AVAILABILITY
  // =========================================================
  const isDetectDisabled = Boolean(
    !asset ||
      !secretKey ||
      isDetecting ||
      isUploading
  );

  return (
    <PlaceholderPage
      pageName="Deteksi Watermark"
      description="Unggah citra yang diuji dan ekstrak watermark DCT yang tertanam menggunakan kunci rahasia yang sesuai."
      routePath="/app/detect"
    >
      <div className="space-y-12">

        {/* WORKFLOW */}
        <WorkflowStepper
          currentStepId={
            asset
              ? "detect"
              : "upload"
          }
        />

        {/* =====================================================
            MAIN WORKSPACE
        ====================================================== */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)] lg:gap-14">

          {/* =====================================================
              LEFT COLUMN
          ====================================================== */}
          <div className="space-y-8">

            {/* IMAGE UPLOAD */}
            <ImageUploadZone
              label="CITRA YANG DIUJI"
              accept="JPEG / PNG / WEBP"
              asset={asset}
              error={uploadError}
              isDragging={isDragging}
              isProcessing={isUploading}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileChange={onFileChange}
              onReset={handleReset}
            />

            {/* =================================================
                EXTRACTION PARAMETERS
            ================================================== */}
            <div className="space-y-5 border border-[#000000] bg-surface p-6">

              <h4 className="border-b border-[#000000] pb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-primary">
                Parameter Deteksi
              </h4>

              <div className="space-y-5">

                {/* SECRET KEY */}
                <div className="space-y-2">

                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-black">
                    Kunci Rahasia
                  </label>

                  <input
                    type="password"
                    placeholder="Masukkan kunci rahasia..."
                    value={secretKey}
                    onChange={(e) =>
                      setSecretKey(
                        e.target.value
                      )
                    }
                    className="h-10 w-full border border-[#000000] bg-white px-3 text-[11px] font-mono font-bold text-[#000000] placeholder:font-normal placeholder:text-[#555555] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-1"
                  />

                  <p className="font-sans text-[9px] text-text-secondary">
                    Harus sesuai dengan kunci yang digunakan saat penyisipan.
                  </p>
                </div>

                {/* REFERENCE WATERMARK */}
                <div className="space-y-2">

                  <label className="flex justify-between font-mono text-[10px] font-semibold uppercase tracking-widest text-black">
                    <span>
                      Watermark Pembanding
                    </span>

                    <span className="text-text-secondary">
                      (Opsional)
                    </span>
                  </label>

                  {/* TYPE SWITCH */}
                  <div className="mb-2 flex h-9 border border-[#000000] bg-surface">

                    {(
                      ["text", "logo"] as const
                    ).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setRefType(t)
                        }
                        className={cn(
                          "flex-1 font-mono text-[10px] font-semibold uppercase tracking-widest transition-colors",
                          refType === t
                            ? "bg-black text-white"
                            : "text-text-secondary hover:bg-surface-soft hover:text-black"
                        )}
                      >
                        {t === "text" ? "Teks" : "Logo"}
                      </button>
                    ))}

                  </div>

                  {/* TEXT REFERENCE */}
                  {refType === "text" ? (
                    <input
                      type="text"
                      placeholder="Masukkan teks pembanding untuk menghitung NC/BER..."
                      value={originalText}
                      onChange={(e) =>
                        setOriginalText(
                          e.target.value
                        )
                      }
                      className="h-10 w-full border border-[#000000] bg-white px-3 text-[11px] font-mono font-bold text-[#000000] placeholder:font-normal placeholder:text-[#555555] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-1"
                    />
                  ) : (
                    /* LOGO REFERENCE */
                    <div className="flex items-center gap-3">

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={
                          handleRefFileChange
                        }
                        accept="image/png, image/jpeg"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="h-10 border border-[#000000] bg-white px-4 font-mono text-[10px] uppercase tracking-widest text-black transition-colors hover:bg-surface-soft"
                      >
                        Pilih Logo Pembanding
                      </button>

                      <span className="max-w-[180px] truncate font-mono text-[10px] text-text-secondary">
                        {originalFile
                          ? originalFile.name
                          : "Belum ada file"}
                      </span>

                    </div>
                  )}

                  <p className="font-sans text-[9px] text-text-secondary">
                    Sediakan watermark asli untuk menghitung metrik kemiripan struktural (NC/BER).
                  </p>
                </div>
              </div>
            </div>

            {/* ERROR */}
            {detectError && (
              <div className="border border-error bg-error/10 p-4 font-mono text-[10px] uppercase tracking-widest text-error">
                KESALAHAN: {detectError}
              </div>
            )}

            {/* DETECT BUTTON */}
            <Button
              variant="primary"
              size="lg"
              className="w-full font-mono text-xs uppercase tracking-widest"
              disabled={isDetectDisabled}
              onClick={handleDetect}
            >
              {isDetecting
                ? "MENGEKSTRAKSI..."
                : "DETEKSI WATERMARK"}
            </Button>

          </div>

          {/* =====================================================
              RIGHT COLUMN — IMAGE / RESULT
          ====================================================== */}
          <div className="space-y-8">

            {/* IMAGE PREVIEW */}
            <div className="sticky top-24 space-y-5">

              <ContactSheetPreview
                leftTitle="Citra yang Diuji"
                rightTitle="Sinyal Hasil Ekstraksi"
                leftImage={asset}
              />

            </div>

            {/* =================================================
                EXTRACTION RESULT
            ================================================== */}
            {result && (
              <div className="space-y-6 border border-[#000000] bg-surface p-6">

                <div>

                  <h4 className="mb-2 border-b border-[#000000] pb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-primary">
                    Hasil Ekstraksi
                  </h4>

                  <div className="border border-[#000000] bg-white p-5">

                    {(result as any)
                      .recovered_logo ? (

                      <div>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            (result as any)
                              .recovered_logo
                          }
                          alt="Logo Hasil Ekstraksi"
                          className="h-24 w-auto object-contain"
                        />

                        <p className="mt-3 font-mono text-[9px] uppercase text-text-secondary">
                          Jenis: Citra
                        </p>

                      </div>

                    ) : result.recovered_text ? (

                      <div>

                        <p className="break-all font-mono text-sm font-semibold text-black">
                          {result.recovered_text}
                        </p>

                        <p className="mt-2 font-mono text-[9px] uppercase text-text-secondary">
                          Jenis: Teks
                        </p>

                      </div>

                    ) : (

                      <p className="font-mono text-sm font-semibold text-error">
                        TIDAK ADA WATERMARK VALID YANG TERDETEKSI
                      </p>

                    )}

                  </div>
                </div>

                {/* METRICS */}
                {result.nc !== undefined &&
                  result.ber !== undefined &&
                  result.nc !== null && (

                    <div className="grid grid-cols-2 gap-3">

                      {/* NC */}
                      <div className="border border-[#000000] bg-white p-4">

                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          NC
                        </span>

                        <span className="mt-1 block font-mono text-lg font-extrabold text-black">
                          {result.nc.toFixed(4)}
                        </span>

                      </div>

                      {/* BER */}
                      <div className="border border-[#000000] bg-white p-4">

                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          BER
                        </span>

                        <span className="mt-1 block font-mono text-lg font-extrabold text-black">
                          {result.ber?.toFixed(6)}
                        </span>

                      </div>

                    </div>
                  )}

              </div>
            )}

          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}