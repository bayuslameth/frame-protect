"use client";

import React, { useEffect, useState } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import { WatermarkConfigPanel } from "@/components/watermark/watermark-config-panel";
import { Button } from "@/components/ui/button";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { useImageUpload } from "@/hooks/use-image-upload";
import {
  embedWatermark,
  EmbedResponse,
} from "@/services/api/watermark.service";
import { verifyWatermark } from "@/services/api/metrics.service";
import { useWorkflowState } from "@/hooks/use-workflow-state";
import { dataUrlToFile } from "@/lib/image-utils";
import { useRouter } from "next/navigation";

export default function ProtectPage() {
  const router = useRouter();

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

  const {
    metricsResult,
    setMetricsResult,
    isVerifying,
    setIsVerifying,
    startNewSession,
    addExperimentResult,
  } = useWorkflowState();

  // =========================================================
  // HYDRATION GUARD
  // =========================================================
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // =========================================================
  // CONFIG STATE
  // =========================================================
  const [watermarkType, setWatermarkType] =
    useState<"text" | "logo">("text");

  const [watermarkText, setWatermarkText] =
    useState("");

  const [watermarkFile, setWatermarkFile] =
    useState<File | null>(null);

  const [secretKey, setSecretKey] =
    useState("");

  const [strength, setStrength] =
    useState(0.15);

  const [dctBand, setDctBand] =
    useState<"low" | "mid" | "high">("mid");

  // =========================================================
  // EMBEDDING STATE
  // =========================================================
  const [isEmbedding, setIsEmbedding] =
    useState(false);

  const [embedError, setEmbedError] =
    useState<string | null>(null);

  const [embedResult, setEmbedResult] =
    useState<EmbedResponse | null>(null);

  // =========================================================
  // DOWNLOAD WATERMARKED IMAGE
  // =========================================================
  const handleDownloadWatermarkedImage = () => {
    if (!embedResult?.image) return;

    try {
      const parts =
        embedResult.image.split(";base64,");

      const contentType =
        parts[0].split(":")[1] ||
        "image/png";

      const raw = window.atob(parts[1]);
      const rawLength = raw.length;

      const uInt8Array =
        new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] =
          raw.charCodeAt(i);
      }

      const blob = new Blob(
        [uInt8Array],
        {
          type: contentType,
        }
      );

      const blobUrl =
        URL.createObjectURL(blob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href = blobUrl;

      downloadLink.download =
        "frame-protect-watermarked.png";

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      document.body.removeChild(
        downloadLink
      );

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);

    } catch (e) {
      console.error(
        "Gagal mengunduh citra ber-watermark:",
        e
      );
    }
  };

  // =========================================================
  // EMBED WATERMARK
  // =========================================================
  const handleEmbed = async () => {
    if (!asset) return;

    setEmbedError(null);
    setIsEmbedding(true);
    setMetricsResult(null);

    try {
      const embedStart = Date.now();

      // 1. PENYISIPAN
      const result =
        await embedWatermark({
          image: asset.file,
          watermark_type: watermarkType,
          watermark_text: watermarkText,
          watermark_file:
            watermarkFile || undefined,
          secret_key: secretKey,
          strength,
          dct_band: dctBand,
        });

      setEmbedResult(result);
      setIsEmbedding(false);

      // 2. VERIFIKASI OTOMATIS
      setIsVerifying(true);

      const wmFile =
        await dataUrlToFile(
          result.image,
          "watermarked.png"
        );

      const verifyRes =
        await verifyWatermark({
          original_image: asset.file,
          watermarked_image: wmFile,
          watermark_type: watermarkType,
          watermark_text: watermarkText,
          watermark_file:
            watermarkFile || undefined,
          secret_key: secretKey,
        });

      const duration =
        Date.now() - embedStart;

      setMetricsResult(verifyRes);

      // 3. BUAT SESI BARU
      const imgMeta =
        asset.metadata;

      const ctx = {
        originalImage: asset.file,
        watermarkedImage: wmFile,
        watermarkedImageUrl:
          result.image,
        secretKey: secretKey,
        watermarkText:
          watermarkText,
        imageFileName:
          asset.file.name,
        imageWidth:
          imgMeta?.width ?? 0,
        imageHeight:
          imgMeta?.height ?? 0,
      };

      startNewSession(ctx);

      addExperimentResult({
        watermarkType: "text",
        watermarkPayloadDescription:
          watermarkText,
        imageWidth:
          imgMeta?.width ?? 0,
        imageHeight:
          imgMeta?.height ?? 0,
        attackType: "baseline",
        attackParameter: null,
        attackedWidth:
          imgMeta?.width ?? 0,
        attackedHeight:
          imgMeta?.height ?? 0,
        extractionStatus:
          "DETECTED",
        extractedWatermark:
          verifyRes.recovered_text ?? "",
        psnr:
          verifyRes.metrics.psnr.value ===
          Infinity
            ? null
            : verifyRes.metrics.psnr.value,
        nc:
          verifyRes.metrics.nc.value,
        ber:
          verifyRes.metrics.ber.value,
        error: null,
        duration,
      });

    } catch (err: unknown) {
      setIsEmbedding(false);

      setEmbedError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyisipkan watermark."
      );

    } finally {
      setIsVerifying(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================
  const handleReset = () => {
    resetUpload();
    setEmbedResult(null);
    setEmbedError(null);
    setMetricsResult(null);
    setWatermarkText("");
    setWatermarkFile(null);
    setSecretKey("");
  };

  // =========================================================
  // WORKFLOW STEP
  // =========================================================
  let stepId = "upload";

  if (asset) {
    stepId = "configure";
  }

  if (isEmbedding) {
    stepId = "embed";
  }

  if (embedResult) {
    stepId = "analyze";
  }

  // =========================================================
  // EMBED AVAILABILITY
  // =========================================================
  const hasValidWatermark =
    watermarkType === "text"
      ? watermarkText.trim().length > 0
      : Boolean(watermarkFile);

  const canEmbed =
    Boolean(asset) &&
    Boolean(secretKey.trim()) &&
    hasValidWatermark;

  // =========================================================
  // HYDRATION-SAFE DISABLED STATE
  // =========================================================
  const isEmbedDisabled =
    !isHydrated ||
    !canEmbed ||
    isEmbedding ||
    isVerifying;

  return (
    <PlaceholderPage
      pageName="Penyisipan Watermark"
      description="Sisipkan watermark digital berbasis DCT ke dalam citra."
      routePath="/app/protect"
    >
      <div className="space-y-12">

        {/* WORKFLOW */}
        <WorkflowStepper
          currentStepId={stepId}
        />

        {/* =====================================================
            WORKSPACE UTAMA
        ====================================================== */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)] lg:gap-14">

          {/* ===================================================
              KOLOM KIRI
          ==================================================== */}
          <div className="space-y-8">

            {/* UPLOAD CITRA */}
            <ImageUploadZone
              label="CITRA SUMBER"
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

            {/* KONFIGURASI WATERMARK */}
            <WatermarkConfigPanel
              watermarkType={watermarkType}
              setWatermarkType={
                setWatermarkType
              }
              watermarkText={
                watermarkText
              }
              setWatermarkText={
                setWatermarkText
              }
              watermarkFile={
                watermarkFile
              }
              setWatermarkFile={
                setWatermarkFile
              }
              secretKey={secretKey}
              setSecretKey={
                setSecretKey
              }
              strength={strength}
              setStrength={
                setStrength
              }
              dctBand={dctBand}
              setDctBand={
                setDctBand
              }
            />

            {/* TOMBOL PENYISIPAN */}
            <div className="space-y-3">

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={
                  isEmbedDisabled
                }
                onClick={
                  handleEmbed
                }
              >
                {isEmbedding
                  ? "MENYISIPKAN..."
                  : isVerifying
                    ? "MEMVERIFIKASI METRIK..."
                    : "SISIPKAN WATERMARK"}
              </Button>

              {embedError && (
                <div className="border border-error bg-[#9e5b5b]/10 p-3 font-mono text-[10px] uppercase tracking-widest text-error">
                  KESALAHAN: {embedError}
                </div>
              )}

            </div>

            {/* =================================================
                HASIL PENYISIPAN
            ================================================== */}
            {embedResult &&
              !isVerifying && (
                <div className="space-y-6">

                  {/* CATATAN PENYISIPAN */}
                  <div className="space-y-4 border border-[#000000] bg-surface p-5">

                    <div className="flex items-center justify-between border-b border-[#000000] pb-3">

                      <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                        Catatan Penyisipan
                      </h4>

                      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-success">

                        <span className="h-1.5 w-1.5 rounded-full bg-success" />

                        Berhasil

                      </span>

                    </div>

                    <div className="grid grid-cols-3 gap-4">

                      {[
                        [
                          "Jenis",
                          embedResult.metadata
                            .watermark_type
                            .toUpperCase(),
                        ],
                        [
                          "DCT",
                          "8 × 8",
                        ],
                        [
                          "Frekuensi",
                          embedResult.metadata
                            .dct_band
                            .toUpperCase(),
                        ],
                        [
                          "Kekuatan",
                          embedResult.metadata
                            .strength
                            .toFixed(2),
                        ],
                        [
                          "Payload",
                          `${embedResult.metadata.payload_bits} bit`,
                        ],
                        [
                          "Blok",
                          `${embedResult.metadata.blocks_used} / ${embedResult.metadata.capacity_blocks}`,
                        ],
                      ].map(([k, v]) => (

                        <div key={k}>

                          <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                            {k}
                          </span>

                          <span className="block font-mono text-[11px] text-text-primary">
                            {v}
                          </span>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* VERIFIKASI AWAL */}
                  {metricsResult?.metrics && (
                    <div className="space-y-4 border border-[#000000] bg-surface p-5">

                      <div className="flex items-center justify-between border-b border-[#000000] pb-3">

                        <div className="space-y-0.5">

                          <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                            Verifikasi Awal
                          </h4>

                          <p className="font-sans text-[9px] text-text-secondary">
                            Pemeriksaan watermark langsung dari citra yang telah diproses.
                          </p>

                        </div>

                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                          Terverifikasi
                        </span>

                      </div>

                      {/* WATERMARK HASIL EKSTRAKSI */}
                      <div className="space-y-2 border border-[#000000] bg-background p-4">

                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          Watermark Hasil Ekstraksi
                        </span>

                        {metricsResult.recovered_logo ? (

                          <div className="inline-block border border-[#000000] bg-white">

                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                metricsResult.recovered_logo
                              }
                              alt="Logo hasil ekstraksi"
                              className="h-16 w-auto object-contain"
                            />

                          </div>

                        ) : (

                          <div className="font-mono text-sm font-medium tracking-wide text-text-primary">
                            {metricsResult.recovered_text ||
                              "(kosong)"}
                          </div>

                        )}

                      </div>

                      {/* METRIK */}
                      <div className="grid grid-cols-3 gap-3">

                        {/* PSNR */}
                        <div className="border border-[#000000] bg-background p-3">

                          <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                            PSNR
                          </span>

                          <span className="metric-value">
                            {metricsResult.metrics.psnr.value ===
                            Infinity
                              ? "∞"
                              : `${metricsResult.metrics.psnr.value.toFixed(2)} dB`}
                          </span>

                        </div>

                        {/* NC */}
                        <div className="border border-[#000000] bg-background p-3">

                          <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                            NC
                          </span>

                          <span className="metric-value">
                            {metricsResult.metrics.nc.value.toFixed(
                              4
                            )}
                          </span>

                        </div>

                        {/* BER */}
                        <div className="border border-[#000000] bg-background p-3">

                          <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                            BER
                          </span>

                          <span className="metric-value">
                            {metricsResult.metrics.ber.value.toFixed(
                              6
                            )}
                          </span>

                        </div>

                      </div>

                      {/* AKSI */}
                      <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                        <Button
                          variant="primary"
                          size="md"
                          className="flex-1 font-mono text-[10px] uppercase tracking-widest"
                          onClick={
                            handleDownloadWatermarkedImage
                          }
                        >
                          UNDUH CITRA BER-WATERMARK
                        </Button>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              "/app/results"
                            )
                          }
                          className="border border-[#000000] px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-text-secondary transition-colors hover:border-black hover:text-text-primary"
                        >
                          Analisis Lengkap →
                        </button>

                      </div>

                    </div>
                  )}

                </div>
              )}

          </div>

          {/* ===================================================
              KOLOM KANAN
          ==================================================== */}
          <div className="sticky top-24 space-y-5">

            <ContactSheetPreview
              leftTitle="Citra Sumber"
              rightTitle="Citra Ber-watermark"
              leftImage={asset}
              rightImage={
                embedResult
                  ? {
                      file: asset!.file,
                      previewUrl:
                        embedResult.image,
                      metadata:
                        asset!.metadata,
                    }
                  : null
              }
            />

            {embedResult && (
              <Button
                variant="primary"
                size="lg"
                className="w-full font-mono text-xs uppercase tracking-widest shadow-md"
                onClick={
                  handleDownloadWatermarkedImage
                }
              >
                UNDUH CITRA BER-WATERMARK
              </Button>
            )}

          </div>

        </div>
      </div>
    </PlaceholderPage>
  );
}