import React from "react";
import { cn } from "@/lib/utils";

export interface WorkflowStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
}

export const DEFAULT_PROTECT_STEPS: WorkflowStep[] = [
  { id: "upload", stepNumber: "01", title: "Upload", description: "Source image" },
  { id: "configure", stepNumber: "02", title: "Configure", description: "Parameters" },
  { id: "embed", stepNumber: "03", title: "Embed", description: "Signal injection" },
  { id: "preview", stepNumber: "04", title: "Preview", description: "Visual diff" },
  { id: "attack", stepNumber: "05", title: "Attack", description: "Distortion test" },
  { id: "detect", stepNumber: "06", title: "Detect", description: "Extraction" },
  { id: "analyze", stepNumber: "07", title: "Analyze", description: "Metrics" },
];

interface WorkflowStepperProps {
  currentStepId?: string;
  steps?: WorkflowStep[];
  className?: string;
}

export function WorkflowStepper({
  currentStepId = "upload",
  steps = DEFAULT_PROTECT_STEPS,
  className,
}: WorkflowStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-start gap-4 md:gap-0 border-y border-border py-4 bg-background px-4",
        className
      )}
    >
      {steps.map((step, idx) => {
        const isCurrent = idx === currentIndex;
        const isComplete = idx < currentIndex;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.id} className="flex-1 flex flex-col relative">
            <div className="flex items-center">
              <span
                className={cn(
                  "font-mono text-[9px] tracking-widest",
                  isCurrent ? "text-text-primary font-bold" : isComplete ? "text-success" : "text-text-tertiary"
                )}
              >
                {step.stepNumber}
              </span>
              {!isLast && (
                <div
                  className={cn(
                    "hidden md:block absolute top-[0.35rem] left-5 right-0 h-px",
                    isComplete ? "bg-success/40" : "bg-border"
                  )}
                />
              )}
            </div>

            <div className="mt-1 pr-4">
              <span
                className={cn(
                  "block font-mono text-[9px] uppercase tracking-widest transition-colors",
                  isCurrent ? "text-text-primary font-bold" : isComplete ? "text-text-secondary" : "text-text-tertiary"
                )}
              >
                {step.title}
              </span>
              <p
                className={cn(
                  "mt-0.5 text-[8px] font-mono uppercase tracking-wider",
                  isComplete || isCurrent ? "text-text-tertiary" : "text-border"
                )}
              >
                {step.description}
              </p>
              {isComplete && (
                <span className="inline-block mt-1 text-[7px] text-success font-mono uppercase tracking-widest border border-success/30 px-1">
                  Done
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
