/**
 * Utility functions for FRAME PROTECT.
 */

/**
 * Combines class names conditionally, filtering out falsy values.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

