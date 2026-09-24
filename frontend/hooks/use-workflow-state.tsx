"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { VerifyResponse } from "@/services/api/metrics.service";
import {
  loadSession,
  createNewSession,
  addResult,
  clearSession,
} from "@/lib/experiment-store";
import type { ExperimentSession, ExperimentResult } from "@/lib/types/experiment";

export interface BaselineContext {
  originalImage: File;
  watermarkedImage: File;
  watermarkedImageUrl: string; // for preview
  secretKey: string;
  watermarkText: string;
  imageFileName: string;
  imageWidth: number;
  imageHeight: number;
}

interface WorkflowState {
  metricsResult: VerifyResponse | null;
  setMetricsResult: (res: VerifyResponse | null) => void;
  isVerifying: boolean;
  setIsVerifying: (v: boolean) => void;
  baselineContext: BaselineContext | null;
  setBaselineContext: (ctx: BaselineContext | null) => void;
  // Session
  session: ExperimentSession | null;
  refreshSession: () => void;
  startNewSession: (ctx: BaselineContext) => void;
  addExperimentResult: (result: Partial<ExperimentResult>) => ExperimentResult | null;
  requestClearSession: () => void;
  confirmClearPending: boolean;
  cancelClearSession: () => void;
  executeClearSession: () => void;
}

const WorkflowContext = createContext<WorkflowState | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [metricsResult, setMetricsResult] = useState<VerifyResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [baselineContext, setBaselineContext] = useState<BaselineContext | null>(null);
  const [session, setSession] = useState<ExperimentSession | null>(() => {
    // Only run on client
    if (typeof window === "undefined") return null;
    return loadSession();
  });
  const [confirmClearPending, setConfirmClearPending] = useState(false);

  const refreshSession = useCallback(() => {
    setSession(loadSession());
  }, []);

  const startNewSession = useCallback((ctx: BaselineContext) => {
    const newSession = createNewSession(
      ctx.imageFileName,
      ctx.imageWidth,
      ctx.imageHeight,
      ctx.watermarkText
    );
    setSession(newSession);
    setBaselineContext(ctx);
  }, []);

  const addExperimentResult = useCallback(
    (result: Partial<ExperimentResult>): ExperimentResult | null => {
      try {
        const saved = addResult(result);
        setSession(loadSession());
        return saved;
      } catch (e) {
        console.error("Failed to save experiment result:", e);
        return null;
      }
    },
    []
  );

  const requestClearSession = useCallback(() => {
    setConfirmClearPending(true);
  }, []);

  const cancelClearSession = useCallback(() => {
    setConfirmClearPending(false);
  }, []);

  const executeClearSession = useCallback(() => {
    clearSession();
    setSession(null);
    setMetricsResult(null);
    setBaselineContext(null);
    setConfirmClearPending(false);
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        metricsResult,
        setMetricsResult,
        isVerifying,
        setIsVerifying,
        baselineContext,
        setBaselineContext,
        session,
        refreshSession,
        startNewSession,
        addExperimentResult,
        requestClearSession,
        confirmClearPending,
        cancelClearSession,
        executeClearSession,
      }}
    >
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
