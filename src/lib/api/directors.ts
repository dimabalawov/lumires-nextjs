import "server-only";
import { apiRequest, nullOn404Or403 } from "./client";
import type {
  DirectorApiResponse,
  DirectorMostReviewedResponse,
  DirectorStatsResponse,
  FilmographyFilm,
  FilmographyResponse,
  SimilarDirectorPerson,
  SimilarDirectorsResponse,
} from "@/types/film";

/** GET /directors/{id} - director biography & metadata. Returns null on 404. */
export async function getDirector(id: string | number): Promise<DirectorApiResponse | null> {
  return nullOn404Or403(
    apiRequest<DirectorApiResponse>(
      `/directors/${encodeURIComponent(String(id))}`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /directors/{id}/filmography - films directed. Returns [] on 404. */
export async function getDirectorFilmography(
  id: string | number,
): Promise<FilmographyFilm[]> {
  const data = await nullOn404Or403(
    apiRequest<FilmographyResponse>(
      `/directors/${encodeURIComponent(String(id))}/filmography`,
      { cache: { revalidate: 3600 } },
    ),
  );
  return data?.films ?? [];
}

/** GET /directors/{id}/stats - headline counters (films, rating, awards). Null on 404. */
export async function getDirectorStats(
  id: string | number,
): Promise<DirectorStatsResponse | null> {
  return nullOn404Or403(
    apiRequest<DirectorStatsResponse>(
      `/directors/${encodeURIComponent(String(id))}/stats`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /directors/{id}/similar - directors with a similar style. Returns [] on 404. */
export async function getDirectorSimilar(
  id: string | number,
): Promise<SimilarDirectorPerson[]> {
  const data = await nullOn404Or403(
    apiRequest<SimilarDirectorsResponse>(
      `/directors/${encodeURIComponent(String(id))}/similar`,
      { cache: { revalidate: 3600 } },
    ),
  );
  return data?.similarDirectors ?? [];
}

/**
 * GET /directors/{id}/films/most-reviewed - the director's most-reviewed film
 * with its top review and comments. Returns null on 404 or 204 (no reviews).
 */
export async function getDirectorMostReviewed(
  id: string | number,
): Promise<DirectorMostReviewedResponse | null> {
  const data = await nullOn404Or403(
    apiRequest<DirectorMostReviewedResponse | undefined>(
      `/directors/${encodeURIComponent(String(id))}/films/most-reviewed`,
      { cache: { revalidate: 300 } },
    ),
  );
  return data ?? null;
}
