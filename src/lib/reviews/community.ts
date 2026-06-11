import "server-only";

import { getThisWeekMostReviewed } from "@/lib/api/films";
import { getFilmReviews, getReviewReplies } from "@/lib/api/reviews";
import { optionalData } from "@/lib/api/client";
import type { CommunityThread } from "@/types/film";
import type { Review, ReviewComment } from "@/types/review";

/**
 * Shared helpers for turning real API reviews into the `CommunityThread` shape
 * the ThreadCard renders. Used by the film detail page, the home "Reviews From
 * The Community" section, and the admin reviews view.
 *
 * There is no cross-film "community reviews" feed endpoint, so the home feed is
 * aggregated: it reads this week's most-reviewed films and pulls a few reviews
 * from each (GET /films/{id}/reviews).
 */

export const REVIEW_BG_VARIANTS = [
  "[background:linear-gradient(41deg,rgba(210,166,106,0.08)_10%,rgba(18,16,14,0)_99%),#12100E]",
  "[background:linear-gradient(-44deg,rgba(210,166,106,0.08)_10%,rgba(18,16,14,0)_100%),#12100E]",
];
export const REVIEW_BORDER_VARIANTS = [
  "[background:linear-gradient(225deg,rgba(210,166,106,0.44)_0%,rgba(18,16,14,0)_100%)]",
  "[background:linear-gradient(-44deg,rgba(18,16,14,0)_0%,rgba(210,166,106,0.44)_100%)]",
];
export const FALLBACK_AVATAR = "/imgs/community/noirviewer.png";

export const withAt = (name: string) => (name.startsWith("@") ? name : `@${name}`);

/**
 * Pick a review's most-liked reply that has visible text. Returns null when the
 * review has no usable reply. NOTE: the replies API currently omits the reply
 * `text` and misattributes the author (backend serializer bug), so this yields
 * null until that's fixed — the card then renders without a reply.
 */
export async function fetchTopReply(
  filmId: string,
  reviewId: string,
  authed: boolean,
): Promise<ReviewComment | null> {
  const res = await optionalData(
    getReviewReplies(filmId, reviewId, { pageSize: 50, authed }),
  );
  const items = (res?.results ?? []).filter((c) => (c.text ?? "").trim() !== "");
  if (!items.length) return null;
  return items.reduce((best, c) => ((c.likesCount ?? 0) > (best.likesCount ?? 0) ? c : best));
}

/** Map one API review (+ optional top reply) to a ThreadCard `CommunityThread`. */
export function buildThread(
  review: Review,
  filmId: string,
  filmTitle: string | undefined,
  topReply: ReviewComment | null,
  index: number,
): CommunityThread {
  return {
    id: String(review.id),
    username: withAt(review.username),
    avatarUrl: review.avatarUrl || FALLBACK_AVATAR,
    filmTitle,
    href: `/review/${encodeURIComponent(review.id)}?film=${encodeURIComponent(filmId)}`,
    text: review.text,
    replies: review.repliesCount ?? 0,
    likes: review.likesCount ?? 0,
    rating: review.rating ?? undefined,
    filmId,
    slug: "-",
    likedByMe: review.isLikedByMe ?? false,
    reply: topReply
      ? {
          username: withAt(topReply.username),
          replyTo: withAt(review.username),
          avatarUrl: topReply.avatarUrl || FALLBACK_AVATAR,
          text: topReply.text ?? "",
          likes: topReply.likesCount ?? 0,
        }
      : { username: "", replyTo: withAt(review.username), avatarUrl: FALLBACK_AVATAR, text: "" },
    bgGradient: REVIEW_BG_VARIANTS[index % 2],
    borderGradient: REVIEW_BORDER_VARIANTS[index % 2],
  };
}

/** Map a film's reviews (with pre-fetched top replies) to threads. */
export function mapReviewsToThreads(
  reviews: Review[],
  filmId: string,
  topReplies: (ReviewComment | null)[],
): CommunityThread[] {
  return reviews.map((r, i) => buildThread(r, filmId, undefined, topReplies[i], i));
}

/**
 * Aggregate real reviews for the home "Reviews From The Community" section.
 * Pulls a handful of reviews from this week's most-reviewed films and previews
 * each one's top reply. Returns at most `limit` threads (empty if no data).
 */
export async function getCommunityReviews(
  limit = 6,
  authed = false,
): Promise<CommunityThread[]> {
  const weekly = await optionalData(getThisWeekMostReviewed());
  const films = weekly?.items ?? [];
  if (!films.length) return [];

  const collected: { review: Review; filmId: string; filmTitle: string }[] = [];
  for (const film of films) {
    if (collected.length >= limit) break;
    const filmId = String(film.filmId);
    const res = await optionalData(getFilmReviews(filmId, { pageSize: 3, authed }));
    for (const review of res?.results ?? []) {
      collected.push({ review, filmId, filmTitle: film.title });
      if (collected.length >= limit) break;
    }
  }
  if (!collected.length) return [];

  const topReplies = await Promise.all(
    collected.map((c) => fetchTopReply(c.filmId, c.review.id, authed)),
  );
  return collected.map((c, i) =>
    buildThread(c.review, c.filmId, c.filmTitle, topReplies[i], i),
  );
}

/** A review plus its film context and replies, for the admin reviews view. */
export interface AdminReviewRow {
  review: Review;
  filmId: string;
  filmTitle: string;
  replies: ReviewComment[];
}

/**
 * Aggregate real reviews (with all their replies) across this week's
 * most-reviewed films, for read-only management in the admin panel.
 */
export async function getReviewsWithReplies(
  maxReviews = 12,
  authed = false,
): Promise<AdminReviewRow[]> {
  const weekly = await optionalData(getThisWeekMostReviewed());
  const films = weekly?.items ?? [];
  if (!films.length) return [];

  const collected: { review: Review; filmId: string; filmTitle: string }[] = [];
  for (const film of films) {
    if (collected.length >= maxReviews) break;
    const filmId = String(film.filmId);
    const res = await optionalData(getFilmReviews(filmId, { pageSize: 4, authed }));
    for (const review of res?.results ?? []) {
      collected.push({ review, filmId, filmTitle: film.title });
      if (collected.length >= maxReviews) break;
    }
  }
  if (!collected.length) return [];

  const replyLists = await Promise.all(
    collected.map(async (c) => {
      const res = await optionalData(
        getReviewReplies(c.filmId, c.review.id, { pageSize: 50, authed }),
      );
      return res?.results ?? [];
    }),
  );
  return collected.map((c, i) => ({ ...c, replies: replyLists[i] }));
}
