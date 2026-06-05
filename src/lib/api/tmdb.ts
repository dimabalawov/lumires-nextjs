import "server-only";

const TMDB_BASE = "https://api.themoviedb.org/3";

/**
 * Fetch a person's current TMDB "popularity" score (a float TMDB recomputes
 * daily from page views, searches, etc.). Returns null if the request fails or
 * the field is absent. Requires TMDB_API_KEY (v3 key) in the environment.
 */
export async function getPersonPopularity(personId: number): Promise<number | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("Missing TMDB_API_KEY");

  const res = await fetch(
    `${TMDB_BASE}/person/${personId}?api_key=${encodeURIComponent(key)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as { popularity?: number };
  return typeof data.popularity === "number" ? data.popularity : null;
}
