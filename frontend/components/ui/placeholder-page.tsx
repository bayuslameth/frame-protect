import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderPageProps {
  pageName: string;
  description: string;
  routePath: string;
  children?: React.ReactNode;
}

export function PlaceholderPage({
  pageName,
  description,
  routePath,
  children,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto w-full max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
      <div className="border-b border-border pb-8 mb-10">
        <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest mb-3">
          {routePath}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
          {pageName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-sans text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}
