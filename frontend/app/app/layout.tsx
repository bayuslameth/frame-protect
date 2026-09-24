"use client";
import { WorkflowProvider } from "@/hooks/use-workflow-state";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <WorkflowProvider>{children}</WorkflowProvider>;
}
