"use client";

import React, { useState } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import { WatermarkConfigPanel } from "@/components/watermark/watermark-config-panel";
import { Button } from "@/components/ui/button";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { useImageUpload } from "@/hooks/use-image-upload";
import { embedWatermark, EmbedResponse } from "@/services/api/watermark.service";
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

  const { metricsResult, setMetricsResult, isVerifying, setIsVerifying, startNewSession, addExperimentResult } = useWorkflowState();

  // Config State
  const [watermarkType, setWatermarkType] = useState<"text" | "logo">("text");
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [secretKey, setSecretKey] = useState("");
  const [strength, setStrength] = useState(0.15);
  const [dctBand, setDctBand] = useState<"low" | "mid" | "high">("mid");

  // Embedding State
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const [embedResult, setEmbedResult] = useState<EmbedResponse | null>(null);

  const handleDownloadWatermarkedImage = () => {
    if (!embedResult?.image) return;
    try {
      const parts = embedResult.image.split(";base64,");
      const contentType = parts[0].split(":")[1] || "image/png";
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "frame-protect-watermarked.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (e) {
      console.error("Failed to download watermarked image:", e);
    }
  };

  const handleEmbed = async () => {
    if (!asset) return;
    setEmbedError(null);
    setIsEmbedding(true);
    setMetricsResult(null);

    try {
      const embedStart = Date.now();
      // 1. Embed
      const result = await embedWatermark({
        image: asset.file,
        watermark_type: watermarkType,
        watermark_text: watermarkText,
        watermark_file: watermarkFile || undefined,
        
        
        
        secret_key: secretKey,
        strength,
        dct_band: dctBand,
      });
      setEmbedResult(result);
      setIsEmbedding(false);

      // 2. Verify automatically
      setIsVerifying(true);
      const wmFile = await dataUrlToFile(result.image, "watermarked.png");
      const verifyRes = await verifyWatermark({
        original_image: asset.file,
        watermarked_image: wmFile,
        watermark_type: watermarkType,
        watermark_text: watermarkText,
        watermark_file: watermarkFile || undefined,
        
        
        
        secret_key: secretKey,
      });
      const duration = Date.now() - embedStart;

      setMetricsResult(verifyRes);

      // 3. Create a new session and record the baseline result
      const imgMeta = asset.metadata;
      const ctx = {
        originalImage: asset.file,
        watermarkedImage: wmFile,
        watermarkedImageUrl: result.image,
        secretKey: secretKey,
        watermarkText: watermarkText,
        imageFileName: asset.file.name,
        imageWidth: imgMeta?.width ?? 0,
        imageHeight: imgMeta?.height ?? 0,
      };
      startNewSession(ctx);

      addExperimentResult({
        watermarkType: "text",
        watermarkPayloadDescription: watermarkText,
        imageWidth: imgMeta?.width ?? 0,
        imageHeight: imgMeta?.height ?? 0,
        attackType: "baseline",
        attackParameter: null,
        attackedWidth: imgMeta?.width ?? 0,
        attackedHeight: imgMeta?.height ?? 0,
        extractionStatus: "DETECTED",
        extractedWatermark: verifyRes.recovered_text ?? "",
        psnr: verifyRes.metrics.psnr.value === Infinity ? null : verifyRes.metrics.psnr.value,
        nc: verifyRes.metrics.nc.value,
        ber: verifyRes.metrics.ber.value,
        error: null,
        duration,
      });
    } catch (err: unknown) {
      setIsEmbedding(false);
      setEmbedError(err instanceof Error ? err.message : "An unknown error occurred during embedding.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    resetUpload();
    setEmbedResult(null);
    setEmbedError(null);
    setMetricsResult(null);
    setWatermarkText("");
    setSecretKey("");
  };

  // Determine Stepper Stage
  let stepId = "upload";
  if (asset) stepId = "configure";
  if (isEmbedding) stepId = "embed";
  if (embedResult) stepId = "analyze";

  const canEmbed = asset && secretKey && (watermarkType === "text" ? watermarkText.length > 0 : true);

  return (
    <PlaceholderPage
      pageName="Protection Workflow"
      description="Embed discrete cosine transform (DCT) digital watermarks into photographic frames."
      routePath="/app/protect"
    >
      <div className="space-y-12">
        <WorkflowStepper currentStepId={stepId} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-8">
            <ImageUploadZone
              label="SOURCE IMAGE"
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

            <WatermarkConfigPanel
              watermarkType={watermarkType}
              setWatermarkType={setWatermarkType}
              watermarkText={watermarkText}
              setWatermarkText={setWatermarkText}
              watermarkFile={watermarkFile}
              setWatermarkFile={setWatermarkFile}
              secretKey={secretKey}
              setSecretKey={setSecretKey}
              strength={strength}
              setStrength={setStrength}
              dctBand={dctBand}
              setDctBand={setDctBand}
            />

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={Boolean(!canEmbed || isEmbedding || isVerifying)}
                onClick={handleEmbed}
              >
                {isEmbedding ? "EMBEDDING..." : isVerifying ? "VERIFYING METRICS..." : "EMBED WATERMARK"}
              </Button>

              {embedError && (
                <div className="p-3 border border-error bg-[#9e5b5b]/10 text-error text-[10px] font-mono tracking-widest uppercase">
                  ERROR: {embedError}
                </div>
              )}
            </div>

            {embedResult && !isVerifying && (
              <div className="space-y-6">
                <div className="border border-[#000000] bg-surface p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Embedding Record
                    </h4>
                    <span className="font-mono text-[9px] text-success tracking-widest uppercase flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Success
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      ["Type", embedResult.metadata.watermark_type.toUpperCase()],
                      ["DCT", "8 × 8"],
                      ["Band", embedResult.metadata.dct_band.toUpperCase()],
                      ["Strength", embedResult.metadata.strength.toFixed(2)],
                      ["Payload", `${embedResult.metadata.payload_bits} bits`],
                      [
                        "Blocks",
                        `${embedResult.metadata.blocks_used} / ${embedResult.metadata.capacity_blocks}`,
                      ],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          {k}
                        </span>
                        <span className="block font-mono text-[11px] text-text-primary">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {metricsResult?.metrics && (
                  <div className="border border-[#000000] bg-surface p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                      <div className="space-y-0.5">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                          Baseline Verification
                        </h4>
                        <p className="text-[9px] font-sans text-text-secondary">
                          Signal recovery directly from generated watermarked frame
                        </p>
                      </div>
                      <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
                        Verified
                      </span>
                    </div>

                    <div className="bg-background p-4 border border-[#000000] space-y-2">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        Extracted Watermark
                      </span>
                      {metricsResult.recovered_logo ? (
                        <div className="border border-[#000000]-strong bg-white inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={metricsResult.recovered_logo} alt="Extracted Logo" className="h-16 w-auto object-contain" />
                        </div>
                      ) : (
                        <div className="font-mono text-sm text-text-primary font-medium tracking-wide">
                          {metricsResult.recovered_text || "(empty)"}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-background p-3 border border-[#000000]">
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          PSNR
                        </span>
                        <span className="metric-value">
                          {metricsResult.metrics.psnr.value === Infinity
                            ? "∞"
                            : `${metricsResult.metrics.psnr.value.toFixed(2)} dB`}
                        </span>
                      </div>
                      <div className="bg-background p-3 border border-[#000000]">
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          NC
                        </span>
                        <span className="metric-value">
                          {metricsResult.metrics.nc.value.toFixed(4)}
                        </span>
                      </div>
                      <div className="bg-background p-3 border border-[#000000]">
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                          BER
                        </span>
                        <span className="metric-value">
                          {metricsResult.metrics.ber.value.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        variant="primary"
                        size="md"
                        className="flex-1 font-mono text-[10px] tracking-widest uppercase"
                        onClick={handleDownloadWatermarkedImage}
                      >
                        DOWNLOAD WATERMARKED IMAGE
                      </Button>
                      <button
                        onClick={() => router.push("/app/results")}
                        className="font-mono text-[10px] uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors border border-[#000000] px-3 py-2 hover:border-[#000000]-strong text-center"
                      >
                        Detailed Analysis →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sticky top-24 space-y-4">
            <ContactSheetPreview
              leftTitle="Source"
              rightTitle="Target Output"
              leftImage={asset}
              rightImage={
                embedResult
                  ? { file: asset!.file, previewUrl: embedResult.image, metadata: asset!.metadata }
                  : null
              }
            />
            {embedResult && (
              <Button
                variant="primary"
                size="lg"
                className="w-full font-mono text-xs tracking-widest uppercase shadow-md"
                onClick={handleDownloadWatermarkedImage}
              >
                DOWNLOAD WATERMARKED IMAGE
              </Button>
            )}
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}
