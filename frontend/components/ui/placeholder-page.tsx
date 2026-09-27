import React from "react";
import { Badge } from "./badge";

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
    <div className="mx-auto w-full max-w-7xl space-y-10 py-10 px-4 sm:px-6 lg:px-8">
      <div className="space-y-3 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="phase">Phase 5 Complete</Badge>
          <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
            {routePath}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-text-primary tracking-tight">
          {pageName}
        </h1>
        <p className="max-w-2xl text-sm font-sans text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}
