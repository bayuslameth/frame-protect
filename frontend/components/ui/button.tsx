import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary disabled:pointer-events-none disabled:opacity-40 cursor-pointer font-sans";

  const sizes = {
    sm: "h-7 px-3 text-[10px] tracking-widest uppercase",
    md: "h-9 px-5 text-[11px] tracking-widest uppercase",
    lg: "h-11 px-8 text-xs tracking-widest uppercase",
  };

  const variants = {
    primary:
      "bg-technical text-background hover:bg-text-primary border border-technical",
    secondary:
      "bg-surface text-text-primary hover:bg-surface-hover border border-border",
    outline:
      "bg-transparent text-text-primary hover:bg-surface-soft border border-border-strong hover:border-text-secondary",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-soft",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
