"use client";
import React, { useState } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import { Button } from "@/components/ui/button";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { useImageUpload } from "@/hooks/use-image-upload";
import { detectWatermark, DetectResponse } from "@/services/api/watermark.service";
import { useWorkflowState } from "@/hooks/use-workflow-state";

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

  const { baselineContext } = useWorkflowState();

  const [secretKey, setSecretKey] = useState(baselineContext?.secretKey || "");
  const [originalText, setOriginalText] = useState(baselineContext?.watermarkText || "");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectResponse | null>(null);

  const handleDetect = async () => {
    if (!asset || !secretKey) return;
    
    setIsDetecting(true);
    setDetectError(null);
    setResult(null);
    
    try {
      const res = await detectWatermark({
        image: asset.file,
        secret_key: secretKey,
        original_watermark_text: originalText || undefined
      });
      setResult(res);
    } catch (e: unknown) {
      setDetectError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsDetecting(false);
    }
  };

  const handleReset = () => {
    resetUpload();
    setResult(null);
    setDetectError(null);
  };

  const isDetectDisabled = Boolean(!asset || !secretKey || isDetecting || isUploading);

  return (
    <PlaceholderPage
      pageName="Detection Workflow"
      description="Upload a candidate image and extract any embedded DCT watermark using the correct secret key."
      routePath="/app/detect"
    >
      <div className="space-y-10">
        <WorkflowStepper currentStepId={asset ? "detect" : "upload"} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            <ImageUploadZone
              label="CANDIDATE IMAGE"
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

            <div className="border border-border bg-surface p-5 space-y-5">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary border-b border-border pb-3">
                Extraction Parameters
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter secret key..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full h-10 bg-surface border border-border px-3 text-[11px] font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-text-primary transition-colors"
                  />
                  <p className="text-[9px] font-sans text-text-secondary">
                    Must match the key used during embedding.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary flex justify-between">
                    <span>Reference Watermark</span>
                    <span className="text-text-secondary">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter reference text to calculate NC/BER..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="w-full h-10 bg-surface border border-border px-3 text-[11px] font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-text-primary transition-colors"
                  />
                  <p className="text-[9px] font-sans text-text-secondary">
                    Provide the original text to calculate structural similarity metrics.
                  </p>
                </div>
              </div>
            </div>

            {detectError && (
              <div className="bg-error/10 border border-error/20 p-4 text-error text-[10px] font-mono tracking-widest uppercase">
                ERROR: {detectError}
              </div>
            )}

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full" 
              disabled={isDetectDisabled}
              onClick={handleDetect}
            >
              {isDetecting ? "EXTRACTING..." : "DETECT WATERMARK"}
            </Button>
          </div>

          <div className="sticky top-20 space-y-6">
            <ContactSheetPreview
              leftTitle="Candidate"
              rightTitle="Extracted Signal"
              leftImage={asset}
            />
            
            {result && (
              <div className="border border-border bg-surface p-6 space-y-6">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary mb-2">Extraction Result</h4>
                  <div className="bg-surface-soft p-4 border border-border">
                    {result.recovered_text ? (
                      <p className="font-mono text-sm text-success break-all">{result.recovered_text}</p>
                    ) : (
                      <p className="font-mono text-sm text-error">NO VALID PAYLOAD DETECTED</p>
                    )}
                  </div>
                </div>
                
                {result.nc !== undefined && result.ber !== undefined && result.nc !== null && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-background p-3 border border-border">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        NC
                      </span>
                      <span className="block font-mono text-sm text-black font-extrabold">
                        {result.nc.toFixed(4)}
                      </span>
                    </div>
                    <div className="bg-background p-3 border border-border">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        BER
                      </span>
                      <span className="block font-mono text-sm text-black font-extrabold">
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
