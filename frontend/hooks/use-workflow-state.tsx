"use client";
import React, { createContext, useContext, useState } from "react";
import { VerifyResponse } from "@/services/api/metrics.service";

interface WorkflowState {
  metricsResult: VerifyResponse | null;
  setMetricsResult: (res: VerifyResponse | null) => void;
  isVerifying: boolean;
  setIsVerifying: (v: boolean) => void;
}

const WorkflowContext = createContext<WorkflowState | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [metricsResult, setMetricsResult] = useState<VerifyResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <WorkflowContext.Provider value={{ metricsResult, setMetricsResult, isVerifying, setIsVerifying }}>
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
