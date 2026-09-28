"use client";
import React, { useState, useRef, useEffect } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import { Button } from "@/components/ui/button";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { useImageUpload } from "@/hooks/use-image-upload";
import { detectWatermark, DetectResponse } from "@/services/api/watermark.service";
import { useWorkflowState } from "@/hooks/use-workflow-state";
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

  const { baselineContext } = useWorkflowState();

  // Initialize with stable empty strings so server and client produce
  // the same initial render (both disabled). After hydration, a useEffect
  // syncs these from baselineContext — avoiding the hydration mismatch that
  // occurs when useState reads context values that differ between SSR and CSR.
  const [secretKey, setSecretKey] = useState("");
  const [refType, setRefType] = useState<"text" | "logo">("text");
  const [originalText, setOriginalText] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync prefill values from baseline context after mount (client-only).
  // This runs after hydration, so it does not cause a server/client mismatch.
  useEffect(() => {
    if (baselineContext?.secretKey) {
      setSecretKey(baselineContext.secretKey);
    }
    if (baselineContext?.watermarkText) {
      setOriginalText(baselineContext.watermarkText);
    }
  }, [baselineContext]);

  const handleDetect = async () => {
    if (!asset || !secretKey) return;
    
    setIsDetecting(true);
    setDetectError(null);
    setResult(null);
    
    try {
      const res = await detectWatermark({
        image: asset.file,
        secret_key: secretKey,
        original_watermark_text: refType === "text" ? originalText || undefined : undefined,
        original_watermark_file: refType === "logo" ? originalFile || undefined : undefined
      });
      setResult(res as any);
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

  const handleRefFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setOriginalFile(e.target.files[0]);
    }
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
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary border-b border-border pb-3 font-semibold">
                Extraction Parameters
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter secret key..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full h-10 bg-white border border-border-strong px-3 text-[11px] font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  <p className="text-[9px] font-sans text-text-secondary">
                    Must match the key used during embedding.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-semibold flex justify-between">
                    <span>Reference Watermark</span>
                    <span className="text-text-secondary">(Optional)</span>
                  </label>
                  
                  <div className="flex bg-surface border border-border-strong h-9 mb-2">
                    {(["text", "logo"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setRefType(t)}
                        className={cn(
                          "flex-1 text-[10px] font-mono uppercase tracking-widest transition-colors font-semibold",
                          refType === t
                            ? "bg-black text-white"
                            : "text-text-secondary hover:text-black hover:bg-surface-soft"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {refType === "text" ? (
                    <input
                      type="text"
                      placeholder="Enter reference text to calculate NC/BER..."
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      className="w-full h-10 bg-white border border-border-strong px-3 text-[11px] font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleRefFileChange}
                        accept="image/png, image/jpeg" 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 px-4 bg-white border border-border-strong text-[10px] font-mono uppercase tracking-widest text-black hover:bg-surface-soft transition-colors"
                      >
                        Select Ref Logo
                      </button>
                      <span className="text-[10px] font-mono text-text-secondary truncate max-w-[150px]">
                        {originalFile ? originalFile.name : "No file selected"}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-[9px] font-sans text-text-secondary">
                    Provide the original payload to calculate structural similarity metrics (NC/BER).
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
              <div className="border border-border-strong bg-white p-6 space-y-6">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary mb-2 font-semibold">Extraction Result</h4>
                  <div className="bg-white p-4 border border-border-strong">
                    {(result as any).recovered_logo ? (
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={(result as any).recovered_logo} alt="Extracted Logo" className="h-20 w-auto object-contain mb-2" />
                        <p className="font-mono text-[9px] text-text-secondary uppercase">Type: Image</p>
                      </div>
                    ) : result.recovered_text ? (
                      <div>
                        <p className="font-mono text-sm text-black font-semibold break-all">{result.recovered_text}</p>
                        <p className="font-mono text-[9px] text-text-secondary uppercase mt-2">Type: Text</p>
                      </div>
                    ) : (
                      <p className="font-mono text-sm text-error font-semibold">NO VALID PAYLOAD DETECTED</p>
                    )}
                  </div>
                </div>
                
                {result.nc !== undefined && result.ber !== undefined && result.nc !== null && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white p-3 border border-border-strong">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        NC
                      </span>
                      <span className="block font-mono text-sm text-black font-extrabold">
                        {result.nc.toFixed(4)}
                      </span>
                    </div>
                    <div className="bg-white p-3 border border-border-strong">
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
