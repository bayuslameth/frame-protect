"use client";

import React from "react";
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* HEADER */}
      <div className="space-y-4 border-b border-border pb-8">
        <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide text-text-primary">
          Image Security Workspace
        </h1>
        <p className="font-sans text-sm text-text-secondary">
          Central dashboard for watermark embedding, extraction, and robustness auditing.
        </p>
      </div>

      {/* WORKFLOW STEPPER */}
      <div className="space-y-6">
        <h2 className="font-sans text-xs uppercase tracking-widest text-text-secondary">
          Pipeline Status
        </h2>
        <WorkflowStepper currentStepId={asset ? "configure" : "upload"} />
      </div>

      {/* TWO COLUMN WORKSPACE PLACEHOLDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image / Workflow Area */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="font-sans text-xs uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Session Catalog
          </h2>
          
          {!asset ? (
            <ImageUploadZone 
              label="SOURCE IMAGE" 
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
          ) : (
            <div className="border border-border bg-surface flex flex-col">
              <div className="flex items-center justify-between border-b border-border p-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-primary">SOURCE / READY</span>
                <button 
                  onClick={reset}
                  className="font-mono text-[9px] uppercase tracking-widest text-text-secondary hover:text-error transition-colors"
                >
                  [ CLEAR SOURCE ]
                </button>
              </div>
              <div className="relative aspect-video flex items-center justify-center p-2 overflow-hidden bg-background">
                <img 
                  src={asset.previewUrl} 
                  alt="Source" 
                  className="w-full h-full object-contain relative z-10" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Technical Info */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-sans text-xs uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Technical Audit
          </h2>
          <div className="border border-border bg-surface p-6 space-y-6">
            <div className="space-y-2">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">Engine Status</span>
              <span className="flex items-center space-x-2 text-text-primary font-mono text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                <span>OFFLINE (Phase 3 Target)</span>
              </span>
            </div>
            
            {asset && (
              <div className="space-y-4 border-t border-border pt-4">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">Image Metadata</span>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <span className="block font-mono text-[9px] text-text-secondary">FORMAT</span>
                     <span className="block font-mono text-[11px] text-text-secondary uppercase">{asset.metadata.type.split('/')[1] || asset.metadata.type}</span>
                   </div>
                   <div>
                     <span className="block font-mono text-[9px] text-text-secondary">DIMENSIONS</span>
                     <span className="block font-mono text-[11px] text-text-secondary uppercase">{asset.metadata.width} × {asset.metadata.height}</span>
                   </div>
                </div>
              </div>
            )}

            <div className="space-y-2 border-t border-border pt-4">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">Active Key</span>
              <span className="block font-mono text-xs text-text-secondary">—</span>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">Recent Metrics</span>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <span className="block font-mono text-[9px] text-text-secondary">PSNR</span>
                   <span className="block font-mono text-xs text-text-secondary">—</span>
                 </div>
                 <div>
                   <span className="block font-mono text-[9px] text-text-secondary">NC</span>
                   <span className="block font-mono text-xs text-text-secondary">—</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
