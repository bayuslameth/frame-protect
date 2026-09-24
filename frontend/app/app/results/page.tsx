"use client";

import React from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { useWorkflowState } from "@/hooks/use-workflow-state";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  const { metricsResult, isVerifying } = useWorkflowState();

  const metrics = metricsResult?.metrics;

  return (
    <PlaceholderPage
      pageName="Analysis Results"
      description="Inspect quantitative fidelity benchmarks and authenticity verdicts."
      routePath="/app/results"
    >
      <div className="space-y-12">
        <WorkflowStepper currentStepId="analyze" />
        
        <div className="border border-border bg-surface p-6 space-y-8">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div className="space-y-1">
              <h4 className="font-sans text-sm uppercase tracking-widest text-text-primary">
                Scientific Metrics
              </h4>
              <p className="text-[10px] text-text-tertiary font-mono tracking-widest uppercase">
                Signal Integrity & Recovery Verification
              </p>
            </div>
            
            <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
              {isVerifying ? "ANALYZING..." : metrics ? "VERIFIED" : "ID / AWAITING"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            
            {/* PSNR */}
            <div className="bg-background p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <span className="block font-mono text-[10px] text-text-secondary tracking-widest">PSNR</span>
                   <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-widest">Fidelity</span>
                 </div>
                 <p className="text-[10px] font-sans text-text-tertiary leading-relaxed">
                   Measures pixel-level similarity between the original and watermarked image.
                 </p>
              </div>
              <div className="flex items-end space-x-2">
                 <div className={cn("font-serif text-3xl uppercase tracking-wide", metrics ? "text-text-primary" : "text-text-tertiary")}>
                   {metrics ? (metrics.psnr.value === Infinity ? "∞" : metrics.psnr.value.toFixed(2)) : "—"}
                 </div>
                 <span className="font-mono text-[9px] text-text-tertiary uppercase mb-1">dB</span>
              </div>
            </div>

            {/* NC */}
            <div className="bg-background p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <span className="block font-mono text-[10px] text-text-secondary tracking-widest">NC</span>
                   <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-widest">Correlation</span>
                 </div>
                 <p className="text-[10px] font-sans text-text-tertiary leading-relaxed">
                   Measures correlation between the original and extracted watermark.
                 </p>
              </div>
              <div className="flex items-end space-x-2">
                 <div className={cn("font-serif text-3xl uppercase tracking-wide", metrics ? "text-text-primary" : "text-text-tertiary")}>
                   {metrics ? metrics.nc.value.toFixed(4) : "—"}
                 </div>
                 <span className="font-mono text-[9px] text-text-tertiary uppercase mb-1">[-1, 1]</span>
              </div>
            </div>

            {/* BER */}
            <div className="bg-background p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <span className="block font-mono text-[10px] text-text-secondary tracking-widest">BER</span>
                   <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-widest">Accuracy</span>
                 </div>
                 <p className="text-[10px] font-sans text-text-tertiary leading-relaxed">
                   Measures the proportion of watermark bits recovered incorrectly.
                 </p>
              </div>
              <div className="flex items-end space-x-2">
                 <div className={cn("font-serif text-3xl uppercase tracking-wide", metrics ? "text-text-primary" : "text-text-tertiary")}>
                   {metrics ? metrics.ber.value.toFixed(6) : "—"}
                 </div>
                 {metrics && (
                   <span className="font-mono text-[9px] text-text-tertiary uppercase mb-1">
                     ({metrics.ber.error_bits} / {metrics.ber.total_bits})
                   </span>
                 )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}
