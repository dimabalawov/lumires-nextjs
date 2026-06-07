import "server-only";
import { apiRequest, ApiError } from "./client";
import { createClient } from "@/lib/supabase/server";
import type { CreateProfileCommand, MeProfile } from "@/types/api";

/** GET /auth/me — the signed-in user's Lumires profile. Returns null if unauthenticated. */
export async function getMe(): Promise<MeProfile | null> {
  try {
    return await apiRequest<MeProfile>("/auth/me", { auth: true });
  } catch {
    // 401/403 (or no session) -> treat as "not signed in".
    return null;
  }
}

/** POST /auth/register — create the Lumires profile for the current user (auth required). */
export async function createProfile(command: CreateProfileCommand): Promise<void> {
  await apiRequest<void>("/auth/register", { method: "POST", body: command, auth: true });
}

/**
 * Best-effort: make sure the signed-in Supabase user has a Lumires profile.
 * App sign-up creates only the Supabase auth user, so without this the backend
 * 500s on any action that needs a user record (e.g. liking). Idempotent — a
 * "already registered" response is treated as success; never throws.
 */
export async function ensureProfile(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const username =
    (typeof user.user_metadata?.username === "string" && user.user_metadata.username) ||
    user.email?.split("@")[0] ||
    user.id;

  try {
    await createProfile({ id: user.id, username, email: user.email ?? "" });
  } catch (e) {
    // Already-registered (or a dup guard) — fine. Anything else: log, don't break.
    if (e instanceof ApiError && (e.status === 409 || e.status === 400)) return;
    console.error("ensureProfile failed:", e);
  }
}

/**
 * Run an authenticated API call; if it 500s (which can mean the user has no
 * Lumires profile yet), register the profile and retry once. Lets legacy
 * accounts self-heal without re-logging in.
 */
export async function withProfileRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ApiError && e.status === 500) {
      await ensureProfile();
      return await fn();
    }
    throw e;
  }
}
