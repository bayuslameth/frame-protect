import React from "react";
import { cn } from "@/lib/utils";

export interface AttackDescriptor {
  id: string;
  name: string;
  category: string;
  defaultParam: string;
}

export const ATTACKS: AttackDescriptor[] = [
  { id: "jpeg", name: "Kompresi JPEG", category: "Kuantisasi", defaultParam: "Q=50" },
  { id: "crop", name: "Pemotongan (Crop)", category: "Spasial", defaultParam: "20%" },
  { id: "resize", name: "Penskalaan (Resize)", category: "Interpolasi", defaultParam: "0.5x" },
  { id: "gaussian_noise", name: "Derau Gaussian", category: "Aditif", defaultParam: "σ=20" },
  { id: "brightness", name: "Kecerahan", category: "Fotometrik", defaultParam: "+1.25" },
  { id: "contrast", name: "Kontras", category: "Histogram", defaultParam: "+1.30" },
];

interface AttackPaletteProps {
  className?: string;
}

export function AttackPalette({ className }: AttackPaletteProps) {
  return (
    <div className={cn("border border-border bg-surface p-6 space-y-6", className)}>
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h4 className="font-sans text-sm uppercase tracking-widest text-text-primary">
            Vektor Distorsi
          </h4>
          <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">
            Simulasi Uji Ketahanan
          </p>
        </div>
        <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
          VEKTOR / 06
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border">
        {ATTACKS.map((atk) => (
          <div
            key={atk.id}
            className="bg-surface p-4 flex flex-col justify-between space-y-4 hover:bg-surface-hover transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <span className="font-sans text-xs uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                {atk.name}
              </span>
              <div className="h-2 w-2 border border-text-tertiary group-hover:bg-text-primary group-hover:border-text-primary transition-all rounded-sm" />
            </div>
            
            <div className="space-y-1">
              <div className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                {atk.category}
              </div>
              <div className="font-mono text-[11px] text-text-primary">
                {atk.defaultParam}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
