import { NextResponse } from "next/server";
import { apiRequest, ApiError } from "@/lib/api/client";
import { getFilms } from "@/lib/api/films";

export interface PickerFilm {
  id: number;
  title: string;
  posterPath: string | null;
}

/**
 * Pull film-like records out of an arbitrary JSON tree. The /search body is
 * undocumented and may nest results under films/results/items, so we walk the
 * tree and keep any object that has a numeric id + a title/name. Dedupes by id.
 */
function extractFilms(node: unknown, out: Map<number, PickerFilm>): void {
  if (Array.isArray(node)) {
    for (const child of node) extractFilms(child, out);
    return;
  }
  if (!node || typeof node !== "object") return;

  const rec = node as Record<string, unknown>;
  const rawId = rec.id ?? rec.filmId ?? rec.externalId ?? rec.tmdbId;
  const title = rec.title ?? rec.name ?? rec.filmTitle;
  const idNum = typeof rawId === "number" ? rawId : Number(rawId);

  if (Number.isFinite(idNum) && typeof title === "string" && title.trim()) {
    const poster = rec.posterPath ?? rec.poster_path ?? rec.poster ?? null;
    if (!out.has(idNum)) {
      out.set(idNum, {
        id: idNum,
        title,
        posterPath: typeof poster === "string" ? poster : null,
      });
    }
  }

  for (const value of Object.values(rec)) {
    if (value && typeof value === "object") extractFilms(value, out);
  }
}

/** GET /api/search/films?q= — film picker source for the Create-List modal. */
export async function GET(req: Request) {
  const term = new URL(req.url).searchParams.get("q")?.trim() ?? "";

  try {
    if (term.length >= 2) {
      const raw = await apiRequest<unknown>("/search", {
        query: { filter: "films", searchTerm: term, page: 1 },
        cache: { revalidate: 60 },
      });
      const found = new Map<number, PickerFilm>();
      extractFilms(raw, found);
      if (found.size > 0) {
        return NextResponse.json({ films: [...found.values()].slice(0, 20) });
      }
    }

    // Empty/short query, or search returned nothing parseable: fall back to the
    // catalogue's first page so the picker still has selectable films.
    const catalogue = await getFilms({ page: 1, pageSize: 20 });
    const films: PickerFilm[] = (catalogue.results ?? []).map((f) => ({
      id: f.id,
      title: f.title,
      posterPath: f.posterPath,
    }));
    return NextResponse.json({ films });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[search films] route handler error:", e);
    return NextResponse.json({ films: [] });
  }
}
