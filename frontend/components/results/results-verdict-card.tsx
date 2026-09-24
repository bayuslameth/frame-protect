import React from "react";
import { cn } from "@/lib/utils";

interface ResultsVerdictCardProps {
  className?: string;
}

export function ResultsVerdictCard({ className }: ResultsVerdictCardProps) {
  return (
    <div className={cn("border border-border bg-surface p-6 space-y-8", className)}>
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h4 className="font-sans text-sm uppercase tracking-widest text-text-primary">
            Verification Verdict
          </h4>
          <p className="text-[10px] text-text-tertiary font-mono tracking-widest uppercase">
            Cryptographic Tamper Audit
          </p>
        </div>
        <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
          ID / AWAITING
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        <div className="bg-background p-6 space-y-4">
          <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
            Authenticity Status
          </span>
          <div className="font-serif text-2xl text-text-primary uppercase tracking-wide">
            Not Analyzed
          </div>
        </div>

        <div className="bg-background p-6 space-y-4">
           <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
            Extracted Signature
          </span>
          <div className="font-mono text-xl text-text-secondary">
            —
          </div>
        </div>
      </div>
    </div>
  );
}
