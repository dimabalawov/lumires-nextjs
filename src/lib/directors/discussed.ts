import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { discussedDirectors } from "@/data/directors";
import type { DiscussedDirectorRow } from "@/types/film";

/** Format a raw mention count for display: 2400 → "2.4k", 12000 → "12k", 950 → "950". */
export function formatMentions(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  // One decimal, but drop a trailing ".0" (e.g. 12000 → "12k", not "12.0k").
  const rounded = Math.round(k * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}k`;
}

/**
 * TMDB person "popularity" is a small float (~0.4–8 for these directors). Scale
 * it into the thousands-range "mentions" counter the cards display, e.g.
 * popularity 5.77 → 5770 → "5.8k". Tune POPULARITY_SCALE if numbers feel off.
 */
export const POPULARITY_SCALE = 1000;
export function popularityToMentions(popularity: number): number {
  return Math.max(0, Math.round(popularity * POPULARITY_SCALE));
}

/** Parse a pre-formatted mentions string ("1.8k") back to a number, for fallback seeds. */
function parseMentions(s: string): number {
  const m = s.trim().toLowerCase();
  if (m.endsWith("k")) return Math.round(parseFloat(m) * 1000);
  const n = parseInt(m.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * The directors for the "Most Discussed Directors This Week" section, with
 * editable mention counts overlaid from Supabase and sorted high → low.
 *
 * Reads via the service-role client (server-only) so the self-hosted instance's
 * anon-key / RLS quirks can't break the public section. On any error or missing
 * row, falls back to the static seed value baked into src/data/directors.ts.
 */
export async function getDiscussedDirectors(): Promise<DiscussedDirectorRow[]> {
  let counts: Record<string, number> = {};
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("discussed_directors")
      .select("id, mentions");
    if (!error && data) {
      counts = Object.fromEntries(data.map((r) => [r.id as string, r.mentions as number]));
    }
  } catch {
    // Leave counts empty — fall back to static seeds below.
  }

  return discussedDirectors
    .map((d) => {
      const mentionsCount = counts[d.id] ?? parseMentions(d.mentions);
      return { ...d, mentionsCount, mentions: formatMentions(mentionsCount) };
    })
    .sort((a, b) => b.mentionsCount - a.mentionsCount);
}
