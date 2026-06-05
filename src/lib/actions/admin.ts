"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { getPersonPopularity } from "@/lib/api/tmdb";
import { popularityToMentions } from "@/lib/directors/discussed";
import { discussedDirectors } from "@/data/directors";

export interface UpdateMentionsResult {
  ok?: true;
  mentions?: number;
  error?: string;
}

export interface SyncResult {
  ok?: true;
  mentions?: number;
  popularity?: number;
  error?: string;
}

export interface SyncAllResult {
  ok?: true;
  updated?: number;
  failed?: string[];
  error?: string;
}

function revalidateDirectors() {
  revalidatePath("/community");
  revalidatePath("/admin/directors");
}

/** Set a director's mention count for the "Most Discussed Directors" section. */
export async function updateDirectorMentions(
  id: string,
  mentions: number,
): Promise<UpdateMentionsResult> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  if (!id) return { error: "Missing director id" };
  if (!Number.isInteger(mentions) || mentions < 0) {
    return { error: "Mentions must be a non-negative whole number" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("discussed_directors")
    .upsert({ id, mentions, updated_at: new Date().toISOString() });

  if (error) return { error: error.message };

  revalidateDirectors();
  return { ok: true, mentions };
}

/** Sync ONE director's mention count from its live TMDB popularity. */
export async function syncDirectorMentions(id: string): Promise<SyncResult> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  const director = discussedDirectors.find((d) => d.id === id);
  if (!director) return { error: "Unknown director" };
  if (!director.tmdbId) return { error: "No TMDB id for this director" };

  let popularity: number | null;
  try {
    popularity = await getPersonPopularity(director.tmdbId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "TMDB request failed" };
  }
  if (popularity == null) return { error: "TMDB returned no popularity" };

  const mentions = popularityToMentions(popularity);
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("discussed_directors")
    .upsert({ id, mentions, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };

  revalidateDirectors();
  return { ok: true, mentions, popularity };
}

/** Sync ALL syncable directors' mention counts from TMDB popularity in one pass. */
export async function syncAllDirectorMentions(): Promise<SyncAllResult> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  const syncable = discussedDirectors.filter((d) => d.tmdbId);
  const rows: { id: string; mentions: number; updated_at: string }[] = [];
  const failed: string[] = [];
  const now = new Date().toISOString();

  const results = await Promise.all(
    syncable.map(async (d) => {
      try {
        const pop = await getPersonPopularity(d.tmdbId!);
        return { id: d.id, pop };
      } catch {
        return { id: d.id, pop: null };
      }
    }),
  );

  for (const r of results) {
    if (r.pop == null) failed.push(r.id);
    else rows.push({ id: r.id, mentions: popularityToMentions(r.pop), updated_at: now });
  }

  if (rows.length === 0) {
    return { error: "No directors could be synced (check TMDB_API_KEY)", failed };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("discussed_directors").upsert(rows);
  if (error) return { error: error.message };

  revalidateDirectors();
  return { ok: true, updated: rows.length, failed };
}
