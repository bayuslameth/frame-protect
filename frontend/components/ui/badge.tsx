import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "phase" | "success" | "warning" | "error";
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-surface-soft text-text-secondary border-border",
    outline: "bg-transparent text-text-tertiary border-border",
    phase:
      "bg-transparent text-text-tertiary border-border font-mono tracking-widest uppercase",
    success: "bg-[#6B8F5E]/10 text-[#6B8F5E] border-[#6B8F5E]/30",
    warning: "bg-[#A68C5B]/10 text-[#A68C5B] border-[#A68C5B]/30",
    error: "bg-[#9E5B5B]/10 text-[#9E5B5B] border-[#9E5B5B]/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
