/**
 * Experiment session store using localStorage for persistence across navigation.
 *
 * Persistence: local-only (browser localStorage). Sessions do NOT survive clearing
 * browser data or private browsing sessions, but survive normal page navigation
 * and tab refreshes.
 *
 * Secret keys are NEVER stored in the session.
 */

import type {
  ExperimentSession,
  ExperimentResult,
  ExperimentAttackType,
  ExtractionStatus,
} from "@/lib/types/experiment";

const STORAGE_KEY = "frame-protect-session";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Validation ──────────────────────────────────────────────────────────────

const VALID_ATTACK_TYPES: ExperimentAttackType[] = [
  "baseline",
  "jpeg",
  "crop",
  "resize",
  "gaussian_noise",
  "brightness",
  "contrast",
];

const VALID_EXTRACTION_STATUSES: ExtractionStatus[] = ["DETECTED", "FAILED"];

function isValidDimension(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v > 0;
}

function isValidMetric(v: unknown): v is number | null {
  return v === null || (typeof v === "number" && isFinite(v));
}

function validateResult(r: Partial<ExperimentResult>): ExperimentResult {
  if (!r.experimentId || !r.sessionId || !r.timestamp) {
    throw new Error("ExperimentResult missing required identifiers.");
  }
  if (
    !r.attackType ||
    !VALID_ATTACK_TYPES.includes(r.attackType as ExperimentAttackType)
  ) {
    throw new Error(`Invalid attackType: ${r.attackType}`);
  }
  if (
    !r.extractionStatus ||
    !VALID_EXTRACTION_STATUSES.includes(r.extractionStatus as ExtractionStatus)
  ) {
    throw new Error(`Invalid extractionStatus: ${r.extractionStatus}`);
  }
  if (!isValidDimension(r.imageWidth) || !isValidDimension(r.imageHeight)) {
    throw new Error("Invalid original image dimensions.");
  }
  if (!isValidDimension(r.attackedWidth) || !isValidDimension(r.attackedHeight)) {
    throw new Error("Invalid attacked image dimensions.");
  }
  if (!isValidMetric(r.psnr)) throw new Error("Invalid psnr.");
  if (!isValidMetric(r.nc)) throw new Error("Invalid nc.");
  if (!isValidMetric(r.ber)) throw new Error("Invalid ber.");

  return r as ExperimentResult;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export function loadSession(): ExperimentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExperimentSession;
  } catch {
    return null;
  }
}

function saveSession(session: ExperimentSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function createNewSession(
  imageFileName: string,
  imageWidth: number,
  imageHeight: number,
  watermarkText: string
): ExperimentSession {
  const session: ExperimentSession = {
    sessionId: generateId(),
    createdAt: new Date().toISOString(),
    imageFileName,
    imageWidth,
    imageHeight,
    watermarkText,
    results: [],
  };
  saveSession(session);
  return session;
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function addResult(result: Partial<ExperimentResult>): ExperimentResult {
  const session = loadSession();
  if (!session) {
    throw new Error("No active session. Please start from the Protect page.");
  }

  const validated = validateResult({
    ...result,
    experimentId: generateId(),
    sessionId: session.sessionId,
    timestamp: new Date().toISOString(),
  });

  session.results.push(validated);
  saveSession(session);
  return validated;
}

export function getSession(): ExperimentSession | null {
  return loadSession();
}
