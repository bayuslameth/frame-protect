"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Lindungi", href: "/app/protect" },
  { label: "Uji Ketahanan", href: "/app/attack-lab" },
  { label: "Deteksi", href: "/app/detect" },
  { label: "Hasil", href: "/app/results" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/98 backdrop-blur-sm">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="FRAME PROTECT"
            className="h-10 w-auto object-contain mix-blend-multiply transition-opacity duration-150 group-hover:opacity-60"
          />

          <span className="hidden sm:block font-sans text-[14px] font-bold uppercase tracking-[0.18em] text-[#000000] transition-opacity duration-150 group-hover:opacity-60">
            Frame Protect
          </span>
        </Link>

        {/* Navigasi */}
        <nav className="flex items-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap px-4 py-2 text-[12px] font-mono font-bold uppercase tracking-widest transition-colors duration-150",
                  isActive
                    ? "border-b-2 border-[#000000] text-[#000000]"
                    : "text-[#444444] hover:text-[#000000]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}