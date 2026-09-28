"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Protect", href: "/app/protect" },
  { label: "Attack Lab", href: "/app/attack-lab" },
  { label: "Detect", href: "/app/detect" },
  { label: "Results", href: "/app/results" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/98 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/logo.png"
            alt="FRAME PROTECT"
            className="h-8 w-auto object-contain mix-blend-multiply transition-opacity duration-150 group-hover:opacity-60"
          />
          <span className="hidden sm:block font-sans text-[11px] tracking-[0.18em] text-[#000000] uppercase font-bold transition-opacity duration-150 group-hover:opacity-60">
            Frame Protect
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-mono tracking-widest whitespace-nowrap transition-colors duration-150 uppercase font-bold",
                  isActive
                    ? "text-[#000000] border-b-2 border-[#000000]"
                    : "text-[#444444] hover:text-[#000000]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="font-mono text-[9px] text-[#444444] uppercase tracking-widest font-semibold">
            Local
          </span>
        </div>
      </div>
    </header>
  );
}
