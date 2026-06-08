import "server-only";
import { apiRequest, nullOn404 } from "./client";
import type {
  LikeToggleResponse,
  ReviewDetail,
  ReviewRepliesResponse,
  ReviewsResponse,
} from "@/types/review";
import {
  ContentFilterEnum,
  ContentOrderEnum,
  RatingEnum,
  type CreateReviewCommand,
  type CreateReviewCommentCommand,
  type PopularReviewsResponse,
  type ReviewsSummary,
} from "@/types/api";

export interface GetReviewsParams {
  filter?: RatingEnum;
  category?: ContentFilterEnum;
  sortBy?: ContentOrderEnum;
  page?: number;
  pageSize?: number;
  /** Fetch per-user (Bearer + no-store) so each item's `isLikedByMe` is accurate. */
  authed?: boolean;
}

/**
 * GET /films/{filmId}/reviews — paginated reviews for a film.
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
    authed = false,
  }: GetReviewsParams = {},
): Promise<ReviewsResponse> {
  return apiRequest<ReviewsResponse>(
    `/films/${encodeURIComponent(String(filmId))}/reviews`,
    {
      query: { filter, category, sortBy, page, pageSize },
      ...(authed ? { auth: true, cache: "no-store" as const } : { cache: { revalidate: 300 } }),
    },
  );
}

/**
 * Backwards-compatible alias used by the film page. Prefer `getReviewsByFilm`.
 */
export async function getFilmReviews(
  filmId: string | number,
  opts: { page?: number; pageSize?: number; authed?: boolean } = {},
): Promise<ReviewsResponse> {
  return getReviewsByFilm(filmId, opts);
}

/** GET /films/{filmId}/reviews/preview — lightweight review preview. Undocumented body. */
export async function getReviewsByFilmPreview(
  filmId: string | number,
): Promise<unknown> {
  return apiRequest<unknown>(
    `/films/${encodeURIComponent(String(filmId))}/reviews/preview`,
    { cache: { revalidate: 300 } },
  );
}

/**
 * GET /films/{filmId}/reviews/{reviewId} — a single review with comments.
 * The backend resolves the review by reviewId alone (filmId is not validated),
 * so a placeholder filmId ("-") is acceptable. Returns null on 404.
 * Pass `authed` to fetch per-user (Bearer + no-store) so `isLikedByMe` is
 * accurate; otherwise the response is cached anonymously.
 */
export async function getReview(
  filmId: string | number,
  reviewId: string,
  authed = false,
): Promise<ReviewDetail | null> {
  return nullOn404(
    apiRequest<ReviewDetail>(
      `/films/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}`,
      authed ? { auth: true, cache: "no-store" } : { cache: { revalidate: 300 } },
    ),
  );
}

/**
 * GET /films/{filmId}/reviews/{reviewId}/replies — paginated replies on a
 * review. Resolves by reviewId alone (filmId is not validated), so a
 * placeholder filmId ("-") is acceptable. Same item shape as the detail
 * `comments[]`; prefer this endpoint as the source of truth for replies.
 */
export async function getReviewReplies(
  filmId: string | number,
  reviewId: string,
  {
    page = 1,
    pageSize = 50,
    authed = false,
  }: { page?: number; pageSize?: number; authed?: boolean } = {},
): Promise<ReviewRepliesResponse> {
  return apiRequest<ReviewRepliesResponse>(
    `/films/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}/replies`,
    {
      query: { page, pageSize },
      ...(authed ? { auth: true, cache: "no-store" as const } : { cache: { revalidate: 300 } }),
    },
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

/** POST /films/{filmId}/reviews — publish a review (auth required). */
export async function createReview(
  filmId: number,
  command: CreateReviewCommand,
): Promise<void> {
  await apiRequest<void>(
    `/films/${filmId}/reviews`,
    { method: "POST", body: command, auth: true },
  );
}

/** POST /films/{filmId}/reviews/{reviewId}/reply — reply to a review (auth required). */
export async function createReviewComment(
  filmId: string | number,
  reviewId: string,
  command: CreateReviewCommentCommand,
): Promise<void> {
  await apiRequest<void>(
    `/films/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}/reply`,
    { method: "POST", body: command, auth: true },
  );
}

/**
 * POST /films/{filmId}/reviews/{reviewId}/like — toggle like on a review
 * (auth required). The endpoint requires a JSON body (an empty `{}` is enough —
 * without it the server replies 415/400) and returns the new like state.
 */
export async function likeReview(
  filmId: string | number,
  reviewId: string,
): Promise<LikeToggleResponse> {
  return apiRequest<LikeToggleResponse>(
    `/films/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}/like`,
    { method: "POST", body: {}, auth: true },
  );
}

/**
 * POST /films/{filmId}/reviews/{reviewId}/replies/{replyId}/like — toggle
 * like on a reply (auth required). Same empty-JSON-body requirement as
 * `likeReview`; returns the new like state.
 */
export async function likeReviewComment(
  filmId: string | number,
  reviewId: string,
  replyId: string,
): Promise<LikeToggleResponse> {
  return apiRequest<LikeToggleResponse>(
    `/films/${encodeURIComponent(String(filmId))}/reviews/${encodeURIComponent(reviewId)}/replies/${encodeURIComponent(replyId)}/like`,
    { method: "POST", body: {}, auth: true },
  );
}
