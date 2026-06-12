"use client";

import { createClient } from "@/lib/supabase/client";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";

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

export type CacheOption = { revalidate: number } | "no-store";


export interface ApiRequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    query?: Record<string, QueryValue>;
    body?: unknown;
    auth?: boolean;
    headers?: Record<string, string>;
    explicitToken?: string;
    cache?: CacheOption;
}

export async function apiRequest<T>(
    path: string,
    { method = "GET", query, body, auth = false, explicitToken = "", cache = "no-store", headers = {} }: ApiRequestOptions = {},
): Promise<T> {
    const url = `${API_BASE_URL}${path}${query ? buildQuery(query) : ""}`;

    const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers };
    if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

    if (auth) {
        if (explicitToken) {
            finalHeaders.Authorization = `Bearer ${explicitToken}`;
        }
        else {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            if (!token) throw new ApiError(401, "Unauthorized", "No active Supabase session");
            finalHeaders.Authorization = `Bearer ${token}`;
        }
    }

    const init: RequestInit & { next?: { revalidate?: number } } = {
        method,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    };

    if (cache === "no-store") {
        init.cache = "no-store";
    } else if (typeof cache === "object" && cache.revalidate) {
        init.next = { revalidate: cache.revalidate };
    }

    const res = await fetch(url, init);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new ApiError(res.status, res.statusText, text || undefined);
    }

    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

