import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Base URL for the Lumires API. Override with NEXT_PUBLIC_LUMIRES_API_URL. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";

/** Thrown for any non-2xx response. Carries the HTTP status for callers. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: string,
  ) {
    super(`Lumires API ${status} ${statusText}${body ? `: ${body}` : ""}`);
    this.name = "ApiError";
  }
}

/** Pull the current user's JWT from the Supabase session for Bearer auth. */
export async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

type QueryValue = string | number | boolean | Array<string | number> | null | undefined;

function buildQuery(query: Record<string, QueryValue>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) sp.append(key, String(item));
    } else {
      sp.append(key, String(value));
    }
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/** Next.js caching directive: ISR revalidate window, or opt out entirely. */
export type CacheOption = { revalidate: number } | "no-store";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  /** JSON body — serialized automatically. */
  body?: unknown;
  /** Attach the current user's Bearer token; throws 401 if not signed in. */
  auth?: boolean;
  authExcep?: boolean;
  /** Defaults to "no-store" (safe for mutations). Pass `{ revalidate }` for GETs. */
  cache?: CacheOption;
  headers?: Record<string, string>;
  explicitToken?: string;
}

/**
 * Single fetch wrapper for every Lumires endpoint. Handles query building,
 * JSON (de)serialization, Bearer auth, Next caching, and error normalization.
 * Returns `undefined` (typed as T) for empty / 204 responses.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", query, body, auth = false, authExcep = true, explicitToken = "", cache = "no-store", headers = {} }: ApiRequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}${query ? buildQuery(query) : ""}`;

  const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    if (explicitToken) {
      finalHeaders.Authorization = `Bearer ${explicitToken}`;
    }
    else {
      const token = await getAccessToken();
      if (!token) {
        if (authExcep) {
          throw new ApiError(401, "Unauthorized", "No active Supabase session");
        }
      } else {
        finalHeaders.Authorization = `Bearer ${token}`;
      }
    }
  }

  const init: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  if (cache === "no-store") init.cache = "no-store";
  else init.next = { revalidate: cache.revalidate };

  // Transient origin errors (Cloudflare 502/503/504) are flagged retryable. Retry
  // GETs only — replaying a non-idempotent mutation could double-apply it.
  const RETRYABLE = new Set([502, 503, 504]);
  const MAX_RETRIES = method === "GET" ? 2 : 0;

  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(url, init);
    if (res.ok || !RETRYABLE.has(res.status) || attempt >= MAX_RETRIES) break;
    await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, res.statusText, text || undefined);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Run a request, returning `null` instead of throwing on a 404. */
export async function nullOn404Or403<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) return null;
    throw e;
  }
}

/** True for transient origin/edge failures (502/503/504) worth a "try again". */
export function isTransientError(err: unknown): err is ApiError {
  return err instanceof ApiError && [502, 503, 504].includes(err.status);
}

/**
 * Degrade to `null` on expected / non-critical failures, but rethrow transient
 * origin errors (502/503/504) so the route's error boundary can offer a retry
 * instead of silently rendering stale/fallback data during an outage.
 */
export async function optionalData<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (err) {
    if (isTransientError(err)) throw err;
    return null;
  }
}
