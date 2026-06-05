import "server-only";
import { apiRequest, nullOn404 } from "./client";
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

// Slug is cosmetic in the route; the numeric id is the real key. Use "-" when
// the human-readable slug is unknown.
const DEFAULT_SLUG = "-";

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

/** GET /films/{slug}/{id} — full film detail. Returns null on 404. */
export async function getFilm(
  id: string | number,
  slug: string = DEFAULT_SLUG,
): Promise<MovieDetail | null> {
  return nullOn404(
    apiRequest<MovieDetail>(
      `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(id))}`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /films/summary — catalogue counts for stat blocks. */
export async function getFilmsSummary(): Promise<FilmsSummary> {
  return apiRequest<FilmsSummary>("/films/summary", { cache: { revalidate: 3600 } });
}

/** GET /films/{slug}/{id}/sources — where-to-watch providers. */
export async function getFilmSources(
  id: string | number,
  slug: string = DEFAULT_SLUG,
): Promise<FilmSourcesResponse | null> {
  return nullOn404(
    apiRequest<FilmSourcesResponse>(
      `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(id))}/sources`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /films/{slug}/{id}/similar — related films. Served anonymously. */
export async function getSimilarFilms(
  id: string | number,
  slug: string = DEFAULT_SLUG,
): Promise<SimilarFilmsResponse | null> {
  return nullOn404(
    apiRequest<SimilarFilmsResponse>(
      `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(id))}/similar`,
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

/** POST /films/{slug}/{filmId}/rate — rate a film (auth required). */
export async function rateFilm(
  filmId: number,
  rating: number,
  slug: string = DEFAULT_SLUG,
): Promise<void> {
  const body: RateFilmCommand = { rating };
  await apiRequest<void>(
    `/films/${encodeURIComponent(slug)}/${filmId}/rate`,
    { method: "POST", body, auth: true },
  );
}

/** POST /films/{slug}/{filmId}/unrate — remove a rating (auth required). */
export async function unrateFilm(
  filmId: number,
  slug: string = DEFAULT_SLUG,
): Promise<void> {
  await apiRequest<void>(
    `/films/${encodeURIComponent(slug)}/${filmId}/unrate`,
    { method: "POST", auth: true },
  );
}
