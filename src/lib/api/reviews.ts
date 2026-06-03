import "server-only";
import { apiRequest } from "./client";
import type { ReviewsResponse } from "@/types/review";
import {
  ContentFilterEnum,
  ContentOrderEnum,
  RatingEnum,
  type CreateReviewCommand,
  type CreateReviewCommentCommand,
  type PopularReviewsResponse,
  type ReviewsSummary,
} from "@/types/api";

const DEFAULT_SLUG = "-";

export interface GetReviewsParams {
  filter?: RatingEnum;
  category?: ContentFilterEnum;
  sortBy?: ContentOrderEnum;
  page?: number;
  pageSize?: number;
}

/**
 * GET /films/{slug}/{filmId}/reviews — paginated reviews for a film.
 * The API does not document the 200 body; we type it as the app's existing
 * ReviewsResponse shape (best-guess until real data lands).
 */
export async function getReviewsByFilm(
  filmId: string | number,
  {
    filter = RatingEnum.All,
    category = ContentFilterEnum.All,
    sortBy = ContentOrderEnum.MostRecent,
    page = 1,
    pageSize = 6,
  }: GetReviewsParams = {},
  slug: string = DEFAULT_SLUG,
): Promise<ReviewsResponse> {
  return apiRequest<ReviewsResponse>(
    `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(filmId))}/reviews`,
    {
      query: { filter, category, sortBy, page, pageSize },
      cache: { revalidate: 300 },
    },
  );
}

/**
 * Backwards-compatible alias used by the film page. Prefer `getReviewsByFilm`.
 */
export async function getFilmReviews(
  filmId: string | number,
  opts: { page?: number; pageSize?: number } = {},
): Promise<ReviewsResponse> {
  return getReviewsByFilm(filmId, opts);
}

/** GET /films/{slug}/{filmId}/reviews/preview — lightweight review preview. Undocumented body. */
export async function getReviewsByFilmPreview(
  filmId: string | number,
  slug: string = DEFAULT_SLUG,
): Promise<unknown> {
  return apiRequest<unknown>(
    `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(filmId))}/reviews/preview`,
    { cache: { revalidate: 300 } },
  );
}

/** GET /films/{slug}/{filmId}/reviews/{reviewId} — a single review. Undocumented body. */
export async function getReview(
  filmId: string | number,
  reviewId: string,
  slug: string = DEFAULT_SLUG,
): Promise<unknown> {
  return apiRequest<unknown>(
    `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}`,
    { cache: { revalidate: 300 } },
  );
}

/** GET /reviews/summary — review counts for the current week / day. */
export async function getReviewsSummary(): Promise<ReviewsSummary> {
  return apiRequest<ReviewsSummary>("/reviews/summary", { cache: { revalidate: 300 } });
}

/**
 * GET /reviews/popular/{daySpan} — most popular reviews over the last `daySpan`
 * days. Item shape is undocumented (see PopularReviewItem).
 */
export async function getPopularReviews(daySpan = 365): Promise<PopularReviewsResponse> {
  return apiRequest<PopularReviewsResponse>(`/reviews/popular/${daySpan}`, {
    cache: { revalidate: 600 },
  });
}

/** POST /films/{slug}/{filmId}/reviews — publish a review (auth required). */
export async function createReview(
  filmId: number,
  command: CreateReviewCommand,
  slug: string = DEFAULT_SLUG,
): Promise<void> {
  await apiRequest<void>(
    `/films/${encodeURIComponent(slug)}/${filmId}/reviews`,
    { method: "POST", body: command, auth: true },
  );
}

/** POST /films/{slug}/{filmId}/reviews/{reviewId}/reply — reply to a review (auth required). */
export async function createReviewComment(
  filmId: string | number,
  reviewId: string,
  command: CreateReviewCommentCommand,
  slug: string = DEFAULT_SLUG,
): Promise<void> {
  await apiRequest<void>(
    `/films/${encodeURIComponent(slug)}/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}/reply`,
    { method: "POST", body: command, auth: true },
  );
}

/** POST /films/{slug}/{filmId}/reviews/{reviewId}/like — like / unlike a review (auth required). */
export async function likeReview(
  filmId: number,
  reviewId: string,
  slug: string = DEFAULT_SLUG,
): Promise<void> {
  await apiRequest<void>(
    `/films/${encodeURIComponent(slug)}/${filmId}/reviews/${encodeURIComponent(reviewId)}/like`,
    { method: "POST", auth: true },
  );
}

/**
 * POST /films/{slug}/{filmId}/reviews/{reviewId}/replies/{replyId}/like —
 * like / unlike a reply on a review (auth required).
 */
export async function likeReviewComment(
  filmId: number,
  reviewId: string,
  replyId: string,
  slug: string = DEFAULT_SLUG,
): Promise<void> {
  await apiRequest<void>(
    `/films/${encodeURIComponent(slug)}/${filmId}/reviews/${encodeURIComponent(reviewId)}/replies/${encodeURIComponent(replyId)}/like`,
    { method: "POST", auth: true },
  );
}
