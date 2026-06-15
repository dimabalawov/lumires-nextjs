import "server-only";
import { apiRequest, nullOn404Or403 } from "./client";
import type { MovieDetail } from "@/types/movie";
import {
  FilmContentFilter,
  FilmContentOrder,
  RatingEnum,
  type FilmsResponse,
  type FilmSourcesResponse,
  type FilmsSummary,
  type RateFilmCommand,
  type SimilarFilmsResponse,
  type WeeklyReviewedResponse,
  type WeeklyPopularResponse,
  type WeeklyRecentResponse,
} from "@/types/api";

export interface GetFilmsParams {
  rating?: RatingEnum;
  content?: FilmContentFilter;
  genres?: string[];
  sortBy?: FilmContentOrder;
  page?: number;
  pageSize?: number;
}

/**
 * GET /films — paginated, filterable film catalogue.
 * `genres` is sent as a comma-separated list (the API accepts repeated keys or
 * a single joined string); empty/zero filters mean "all".
 */
export async function getFilms(
  { rating, content, genres, sortBy, page = 1, pageSize = 24 }: GetFilmsParams = {},
): Promise<FilmsResponse> {
  return apiRequest<FilmsResponse>("/films", {
    query: {
      rating,
      content,
      genres: genres?.length ? genres.join(",") : undefined,
      sortBy,
      page,
      pageSize,
    },
    cache: { revalidate: 300 },
  });
}

/**
 * GET /films/{id} — full film detail. Returns null on 404.
 * Pass `authed` to fetch per-user (Bearer + no-store) so `isLikedByMe` /
 * `isWatchedByMe` are accurate; otherwise the response is cached anonymously.
 */
export async function getFilm(
  id: string | number,
  { authed = false }: { authed?: boolean } = {},
): Promise<MovieDetail | null> {
  return nullOn404Or403(
    apiRequest<MovieDetail>(
      `/films/${encodeURIComponent(String(id))}`,
      authed ? { auth: true, cache: "no-store" } : { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /films/summary — catalogue counts for stat blocks. */
export async function getFilmsSummary(): Promise<FilmsSummary> {
  return apiRequest<FilmsSummary>("/films/summary", { cache: { revalidate: 3600 } });
}

/** GET /films/{id}/sources — where-to-watch providers. */
export async function getFilmSources(
  id: string | number,
): Promise<FilmSourcesResponse | null> {
  return nullOn404Or403(
    apiRequest<FilmSourcesResponse>(
      `/films/${encodeURIComponent(String(id))}/sources`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /films/{id}/similar — related films. Served anonymously. */
export async function getSimilarFilms(
  id: string | number,
): Promise<SimilarFilmsResponse | null> {
  return nullOn404Or403(
    apiRequest<SimilarFilmsResponse>(
      `/films/${encodeURIComponent(String(id))}/similar`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /films/rating-breakdown?id= — rating histogram for a film. Undocumented body. */
export async function getFilmRatingBreakdown(id: number): Promise<unknown> {
  return apiRequest<unknown>("/films/rating-breakdown", {
    query: { id },
    cache: { revalidate: 300 },
  });
}

/** GET /films/recent/weekly — this week's recent releases. */
export async function getThisWeekRecentReleases(): Promise<WeeklyRecentResponse> {
  return apiRequest<WeeklyRecentResponse>("/films/recent/weekly", {
    cache: { revalidate: 3600 },
  });
}

/** GET /films/popular/weekly — this week's popular films. */
export async function getThisWeekPopular(): Promise<WeeklyPopularResponse> {
  return apiRequest<WeeklyPopularResponse>("/films/popular/weekly", {
    cache: { revalidate: 3600 },
  });
}

/** GET /films/most-reviewed/weekly — this week's most-reviewed films. */
export async function getThisWeekMostReviewed(): Promise<WeeklyReviewedResponse> {
  return apiRequest<WeeklyReviewedResponse>("/films/most-reviewed/weekly", {
    cache: { revalidate: 3600 },
  });
}

/** POST /films/{filmId}/rate — rate a film (auth required). */
export async function rateFilm(filmId: number, rating: number): Promise<void> {
  const body: RateFilmCommand = { rating };
  await apiRequest<void>(`/films/${filmId}/rate`, { method: "POST", body, auth: true });
}

/** POST /films/{filmId}/unrate — remove a rating (auth required). */
export async function unrateFilm(filmId: number): Promise<void> {
  await apiRequest<void>(`/films/${filmId}/unrate`, { method: "POST", auth: true });
}

/** POST /films/{id}/like - toggle the current user's like on a film.
 * The endpoint is addressed by the same numeric (TMDB) id used everywhere else
 * for films (e.g. GET /films/{id}); the internal GUID 404s here.
 */
export async function likeFilm(filmId: string | number): Promise<unknown> {
  return apiRequest<unknown>(
    `/films/${encodeURIComponent(String(filmId))}/like`,
    { method: "POST", body: {}, auth: true },
  );
}

/** POST /films/{id}/watch — toggle the current user's "watched" mark on a film
 * (auth required). Sends an empty JSON body, like the other mutation endpoints. */
export async function watchFilm(filmId: string | number): Promise<unknown> {
  return apiRequest<unknown>(
    `/films/${encodeURIComponent(String(filmId))}/watch`,
    { method: "POST", body: {}, auth: true },
  );
}

