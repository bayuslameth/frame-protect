"use client";

import { usePathname } from "next/navigation";

/**
 * Custom hook to check whether a given path is currently active.
 */
export function useActiveRoute() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return {
    pathname,
    isActive,
  };
}

