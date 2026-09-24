"use client";
import React, { createContext, useContext, useState } from "react";
import { VerifyResponse } from "@/services/api/metrics.service";

export interface BaselineContext {
  originalImage: File;
  watermarkedImage: File;
  watermarkedImageUrl: string; // for preview
  secretKey: string;
  watermarkText: string;
}

interface WorkflowState {
  metricsResult: VerifyResponse | null;
  setMetricsResult: (res: VerifyResponse | null) => void;
  isVerifying: boolean;
  setIsVerifying: (v: boolean) => void;
  baselineContext: BaselineContext | null;
  setBaselineContext: (ctx: BaselineContext | null) => void;
}

const WorkflowContext = createContext<WorkflowState | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [metricsResult, setMetricsResult] = useState<VerifyResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [baselineContext, setBaselineContext] = useState<BaselineContext | null>(null);

  return (
    <WorkflowContext.Provider value={{ metricsResult, setMetricsResult, isVerifying, setIsVerifying, baselineContext, setBaselineContext }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowState() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflowState must be used within a WorkflowProvider");
  }
  return context;
}
