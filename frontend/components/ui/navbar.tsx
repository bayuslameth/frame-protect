"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Workspace", href: "/app" },
  { label: "Protect", href: "/app/protect" },
  { label: "Detect", href: "/app/detect" },
  { label: "Attack Lab", href: "/app/attack-lab" },
  { label: "Results", href: "/app/results" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[11px] tracking-[0.25em] text-text-secondary uppercase">
              Frame
            </span>
            <span className="font-serif text-[11px] tracking-[0.25em] text-text-primary uppercase font-semibold">
              Protect
            </span>
          </div>
          <div className="w-px h-6 bg-border" />
          <span className="font-mono text-[10px] tracking-widest text-text-tertiary uppercase hidden sm:block">
            Image Lab
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-6 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-1 text-[11px] font-mono tracking-widest whitespace-nowrap transition-colors",
                  isActive
                    ? "text-text-primary border-b border-text-primary"
                    : "text-text-tertiary hover:text-text-primary border-b border-transparent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
            Local Processing
          </span>
        </div>
      </div>
    </header>
  );
}
