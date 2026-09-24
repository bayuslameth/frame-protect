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

  const { setMetricsResult, isVerifying, setIsVerifying } = useWorkflowState();

  // Config State
  const [watermarkType, setWatermarkType] = useState<"text" | "logo">("text");
  const [watermarkText, setWatermarkText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [strength, setStrength] = useState(0.15);
  const [dctBand, setDctBand] = useState<"low" | "mid" | "high">("mid");

  // Embedding State
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const [embedResult, setEmbedResult] = useState<EmbedResponse | null>(null);

  const handleEmbed = async () => {
    if (!asset) return;
    setEmbedError(null);
    setIsEmbedding(true);
    setMetricsResult(null);

    try {
      // 1. Embed
      const result = await embedWatermark({
        image: asset.file,
        watermark_type: watermarkType,
        watermark_text: watermarkText,
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
        secret_key: secretKey
      });
      
      setMetricsResult(verifyRes);
      
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
                disabled={!canEmbed || isEmbedding || isVerifying}
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
              <div className="border border-border bg-surface p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                    Embedding Record
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push("/app/results")}
                      className="text-[10px] font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors border border-border px-2 py-1 hover:border-border-strong"
                    >
                      View Results →
                    </button>
                    <a
                      href={embedResult.image}
                      download="frame-protect-watermarked.png"
                      className="text-[10px] font-mono uppercase tracking-widest text-background bg-technical hover:bg-text-primary transition-colors border border-technical px-2 py-1 flex items-center justify-center"
                    >
                      Download Image
                    </a>
                  </div>
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
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-tertiary">
                        {k}
                      </span>
                      <span className="block font-mono text-[11px] text-text-primary">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
          
          <div className="sticky top-24">
            <ContactSheetPreview
               leftTitle="Source"
               rightTitle="Target Output"
               leftImage={asset}
               rightImage={embedResult ? { file: asset!.file, previewUrl: embedResult.image, metadata: asset!.metadata } : null}
            />
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}
