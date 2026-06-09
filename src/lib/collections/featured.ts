import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getList, getLists } from "@/lib/api/lists";
import { getFilm } from "@/lib/api/films";
import { tmdbImage } from "@/lib/images/tmdb";
import type { ListDetail } from "@/types/api";
import type { CollectionData } from "@/types/film";

/** Max stills in the Collections filmstrip (centre panel + side panels). */
const MAX_STILLS = 11;
/** Skip thin lists so the filmstrip always has enough distinct posters. */
const MIN_FILMS = 6;
/** Cap how many films we probe for a centre backdrop (bounded extra requests). */
const BACKDROP_PROBE = 6;

/** A featured collection row joined with its live list detail (admin panel view). */
export interface FeaturedCollectionRow {
  listId: string;
  position: number;
  title: string;
  author: string;
  filmCount: number;
}

interface UniqueFilm {
  filmId: number;
  poster: string;
}

/**
 * Up to MAX_STILLS *unique* films (id + poster URL) from a list. Deduped so the
 * filmstrip shows different films on the left and right of the centre panel
 * (never a mirrored repeat) and never an empty/black panel for a missing poster.
 */
function uniqueFilms(list: ListDetail): UniqueFilm[] {
  const seen = new Set<string>();
  const out: UniqueFilm[] = [];
  for (const f of list.films ?? []) {
    const url = tmdbImage(f.posterPath, "w500");
    if (url && !seen.has(url)) {
      seen.add(url);
      out.push({ filmId: f.filmId, poster: url });
    }
    if (out.length >= MAX_STILLS) break;
  }
  return out;
}

/**
 * Landscape still for the centre panel: the centre film's own backdrop if it has
 * one, otherwise the first probed film that does. List detail carries no backdrop,
 * so we resolve it from film detail (bounded to BACKDROP_PROBE requests). Returns
 * null when no probed film has a backdrop (card falls back to the poster).
 */
async function centerBackdrop(films: UniqueFilm[], centerIdx: number): Promise<string | null> {
  // Probe the centre film first, then fan out to its neighbours.
  const order = [centerIdx, ...films.map((_, i) => i).filter((i) => i !== centerIdx)].slice(
    0,
    BACKDROP_PROBE,
  );
  const details = await Promise.all(order.map((i) => getFilm(films[i].filmId).catch(() => null)));
  for (const d of details) {
    const url = tmdbImage(d?.backdropPath, "w780");
    if (url) return url;
  }
  return null;
}

async function toCollection(list: ListDetail): Promise<CollectionData> {
  const films = uniqueFilms(list);
  const centerIdx = Math.floor((films.length - 1) / 2);
  const backdrop = await centerBackdrop(films, centerIdx);
  return {
    id: list.id,
    title: list.title,
    author: list.username ?? list.authorName,
    filmCount: list.filmCount ?? list.films.length,
    films: films.map((f) => f.poster),
    backdrop: backdrop ?? undefined,
    isLiked: list.isLikedByMe,
    isSaved: list.isSavedByMe,
  };
}

/** Read the admin-curated featured list ids (ordered), or [] on any error. */
async function readFeaturedIds(): Promise<{ listId: string; position: number }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("featured_collections")
      .select("list_id, position")
      .order("position", { ascending: true });
    if (error || !data) return [];
    return data.map((r) => ({ listId: r.list_id as string, position: r.position as number }));
  } catch {
    return [];
  }
}

/**
 * The "Collections Created By Film Lovers" lists. Sourced straight from the real
 * lists API — GET /lists sorted by most films — then resolved to full detail for
 * their posters. No separate curation table: the lists themselves are the
 * source. Returns [] on any error so the section falls back to demo data.
 */
export async function getFeaturedCollections(
  authed = false,
  limit = 3,
): Promise<CollectionData[]> {
  try {
    const browse = await getLists({ sortBy: "mostFilms", pageSize: 24, authed });
    const candidates = (browse.results ?? [])
      .filter((l) => (l.filmsCount ?? l.filmCount ?? 0) >= MIN_FILMS)
      .slice(0, limit);

    const lists = await Promise.all(candidates.map((l) => getList(l.id, authed).catch(() => null)));
    const collections = await Promise.all(
      lists.filter((l): l is ListDetail => l != null).map(toCollection),
    );
    return collections.filter((c) => c.films.length >= MIN_FILMS);
  } catch {
    return [];
  }
}

/** Same featured lists, but as lightweight rows for the admin management table. */
export async function getFeaturedCollectionRows(): Promise<FeaturedCollectionRow[]> {
  const ids = await readFeaturedIds();
  if (ids.length === 0) return [];

  const rows = await Promise.all(
    ids.map(async (r) => {
      const list = await getList(r.listId).catch(() => null);
      if (!list) return null;
      return {
        listId: r.listId,
        position: r.position,
        title: list.title,
        author: list.username ?? list.authorName,
        filmCount: list.filmCount ?? list.films.length,
      } satisfies FeaturedCollectionRow;
    }),
  );
  return rows.filter((r): r is FeaturedCollectionRow => r != null);
}
