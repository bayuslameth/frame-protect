"use client";
import React from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import { Button } from "@/components/ui/button";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { useImageUpload } from "@/hooks/use-image-upload";

export default function DetectPage() {
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
              error={error}
              isDragging={isDragging}
              isProcessing={isProcessing}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileChange={onFileChange}
              onReset={reset}
            />

            <div className="border border-border bg-surface p-5 space-y-5">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary border-b border-border pb-3">
                Extraction Parameters
              </h4>
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                  Secret Key
                </label>
                <input
                  type="password"
                  placeholder="Enter secret key..."
                  className="w-full h-10 bg-surface-soft border border-border px-3 text-[11px] font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-strong transition-colors"
                  disabled
                />
                <p className="text-[9px] font-sans text-text-tertiary">
                  Must match the key used during embedding.
                </p>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" disabled={!asset}>
              Detect Watermark
            </Button>
            <p className="text-center font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              Detection engine — Phase 6 Target
            </p>
          </div>

          <div className="sticky top-20">
            <ContactSheetPreview
              leftTitle="Candidate"
              rightTitle="Extracted Signal"
              leftImage={asset}
            />
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}
