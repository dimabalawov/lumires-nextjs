import "server-only";
import { apiRequest } from "./client";
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
