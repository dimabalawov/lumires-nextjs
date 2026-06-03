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
  /** Defaults to "no-store" (safe for mutations). Pass `{ revalidate }` for GETs. */
  cache?: CacheOption;
  headers?: Record<string, string>;
}

/**
 * Single fetch wrapper for every Lumires endpoint. Handles query building,
 * JSON (de)serialization, Bearer auth, Next caching, and error normalization.
 * Returns `undefined` (typed as T) for empty / 204 responses.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", query, body, auth = false, cache = "no-store", headers = {} }: ApiRequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}${query ? buildQuery(query) : ""}`;

  const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = await getAccessToken();
    if (!token) throw new ApiError(401, "Unauthorized", "No active Supabase session");
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  if (cache === "no-store") init.cache = "no-store";
  else init.next = { revalidate: cache.revalidate };

  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, res.statusText, text || undefined);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Run a request, returning `null` instead of throwing on a 404. */
export async function nullOn404<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
