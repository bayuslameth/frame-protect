import React from "react";
import { cn } from "@/lib/utils";

interface MetricChartPlaceholderProps {
  className?: string;
}

export function MetricChartPlaceholder({
  className,
}: MetricChartPlaceholderProps) {
  const metrics = [
    { symbol: "PSNR", label: "Fidelity", unit: "dB" },
    { symbol: "NC", label: "Correlation", unit: "0-1" },
    { symbol: "BER", label: "Error Rate", unit: "0-1" },
  ];

  return (
    <div className={cn("border border-border bg-surface p-6 space-y-8", className)}>
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h4 className="font-sans text-sm uppercase tracking-widest text-text-primary">
            Scientific Metrics
          </h4>
          <p className="text-[10px] text-text-tertiary font-mono tracking-widest uppercase">
            Signal Integrity & Recovery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border border border-border">
        {metrics.map((m) => (
          <div key={m.symbol} className="bg-background p-6 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-1">
               <span className="block font-mono text-[10px] text-text-secondary tracking-widest">{m.symbol}</span>
               <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-widest">{m.label}</span>
            </div>
            <div className="font-serif text-3xl text-text-primary">—</div>
            <span className="font-mono text-[9px] text-text-tertiary uppercase">{m.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
