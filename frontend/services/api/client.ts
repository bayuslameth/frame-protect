/**
 * HTTP API client configured for FastAPI backend communication.
 * Ready for future backend integration.
 */

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Base fetcher wrapper for FastAPI endpoints.
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  };

  if (!(options?.body instanceof FormData)) {
    (defaultHeaders as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(
      `FastAPI Error: ${response.statusText} (${response.status})`,
      response.status,
      errorData
    );
  }

  return response.json() as Promise<T>;
}

