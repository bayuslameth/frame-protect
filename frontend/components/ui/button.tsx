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
    "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-40 cursor-pointer font-sans";

  const sizes = {
    sm: "h-7 px-3 text-[10px] tracking-widest uppercase font-semibold",
    md: "h-9 px-5 text-[11px] tracking-widest uppercase font-semibold",
    lg: "h-11 px-8 text-xs tracking-widest uppercase font-semibold",
  };

  const variants = {
    primary:
      "bg-black text-white hover:bg-[#222222] border border-black",
    secondary:
      "bg-surface text-text-primary hover:bg-surface-soft border border-border-strong",
    outline:
      "bg-transparent text-text-primary hover:bg-surface-soft border border-border-strong",
    ghost:
      "bg-transparent text-text-primary hover:bg-surface-soft",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
      disabled={Boolean(props.disabled)}
    >
      {children}
    </button>
  );
}
