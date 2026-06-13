import "server-only";
import type { MovieDetail } from "@/types/movie";
import { getFilm } from "./films";

/**
 * GET /films/{id} — full film detail by numeric id.
 * Thin wrapper around {@link getFilm} kept for existing call sites. Pass `authed`
 * to include the current user's per-user state (isLikedByMe / isWatchedByMe).
 */
export async function getMovie(
  id: string,
  opts?: { authed?: boolean },
): Promise<MovieDetail | null> {
  return getFilm(id, opts);
}
