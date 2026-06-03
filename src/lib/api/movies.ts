import "server-only";
import type { MovieDetail } from "@/types/movie";
import { getFilm } from "./films";

/**
 * GET /films/-/{id} — full film detail by numeric id.
 * Thin wrapper around {@link getFilm} kept for existing call sites.
 */
export async function getMovie(
  id: string,
  _locale: string = "en-US",
): Promise<MovieDetail | null> {
  return getFilm(id);
}
