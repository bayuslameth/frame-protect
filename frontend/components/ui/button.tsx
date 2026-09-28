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
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-mono tracking-widest uppercase font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-35 cursor-pointer select-none";

  const sizes: Record<string, string> = {
    sm: "h-8  px-5 text-[9px]",
    md: "h-10 px-6 text-[10px]",
    lg: "h-11 px-8 text-[10px]",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-[#000000] text-[#F7F7F5] hover:bg-[#222222] border border-[#000000] hover:border-[#222222]",
    secondary:
      "bg-white text-[#000000] hover:bg-surface-soft border border-[#000000]",
    outline:
      "bg-transparent text-[#000000] hover:bg-surface-soft border border-[#000000]",
    ghost:
      "bg-transparent text-[#444444] hover:text-[#000000] hover:bg-surface-soft border border-transparent",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={Boolean(disabled)}
      {...props}
    >
      {children}
    </button>
  );
}
