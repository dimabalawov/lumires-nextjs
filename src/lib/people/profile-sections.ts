import "server-only";
import { optionalData } from "@/lib/api/client";
import { getReviewsByFilm } from "@/lib/api/reviews";
import { tmdbImage } from "@/lib/images/tmdb";
import type { DirectorMostDiscussed, SimilarDirector } from "@/data/directors";
import type { EditorialFilm } from "@/data/editorialCollections";
import type {
  DirectorMostReviewedResponse,
  DirectorStats,
  FilmographyFilm,
} from "@/types/film";
import type { Review } from "@/types/review";

// Shared mappers for the director & actor profile pages — both render the same
// sections from the same `/{filmography,stats,similar,films/most-reviewed}`
// endpoint shapes, so the page-level logic lives here once.

export const FALLBACK_AVATAR = "/imgs/community/noirviewer.png";
export const FALLBACK_POSTER = "/imgs/editorial/image 12.png";
export const FALLBACK_PORTRAIT = "/imgs/directors/image 21.png";

export const withAt = (name: string) => (name.startsWith("@") ? name : `@${name}`);

export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${month} ${day} · ${d.getUTCFullYear()}`;
}

/** TMDB voteAverage (0–10) → nearest half-star on a 0–5 scale. */
function toHalfStar(voteAverage: number): number {
  const scaled = voteAverage > 5 ? voteAverage / 2 : voteAverage;
  return Math.round(scaled * 2) / 2;
}

/** Combine the films/rating/awards counters into the hero stats card shape. */
export function toProfileStats(api: {
  filmsCount: number;
  averageRating: number;
  awards: { wins: number; nominations: number };
}): DirectorStats {
  return {
    featureFilms: api.filmsCount,
    avgRating: api.averageRating,
    awards: api.awards.wins + api.awards.nominations,
  };
}

const FILMOGRAPHY_PREVIEW = 8;

/**
 * Map the full filmography to cards (oldest-first, like a timeline) and the ids
 * of the 8 most popular films — those are shown until "Show all" expands the rest.
 */
export function toFilmographyData(films: FilmographyFilm[]): {
  films: EditorialFilm[];
  previewIds: string[];
} {
  const cards = [...films]
    .sort((a, b) => (a.releaseYear ?? 0) - (b.releaseYear ?? 0))
    .map((f) => ({
      id: String(f.id),
      title: f.title,
      year: f.releaseYear != null ? String(f.releaseYear) : "",
      genre: f.genres[0] ?? "",
      rating: toHalfStar(f.voteAverage),
      poster: tmdbImage(f.posterPath, "w342") ?? "",
    }));

  const previewIds = [...films]
    .sort((a, b) => b.voteAverage - a.voteAverage)
    .slice(0, FILMOGRAPHY_PREVIEW)
    .map((f) => String(f.id));

  return { films: cards, previewIds };
}

/** Map the /similar payload onto the shared similar-people card grid. */
export function toSimilarCards(
  people: Array<{ apiId: number; profilePath: string | null; name: string }>,
): SimilarDirector[] {
  return people.map((p) => ({
    id: String(p.apiId),
    apiId: p.apiId,
    name: p.name,
    image: tmdbImage(p.profilePath, "w500") ?? FALLBACK_PORTRAIT,
    matchPercent: 0, // not provided by the API; the cards don't display it
  }));
}

/**
 * Map the most-reviewed payload onto the shared "Most Discussed" thread card.
 * `review` is the same review recovered from the film's review list — it carries
 * the review `id` (the most-reviewed endpoint omits it) plus authed like state,
 * which wires up the working LikeButton.
 */
function toMostDiscussed(
  api: DirectorMostReviewedResponse,
  review: Review | undefined,
): DirectorMostDiscussed {
  const reviewAvatar = api.avatarUrl || FALLBACK_AVATAR;
  return {
    filmTitle: api.filmTitle,
    filmPoster: tmdbImage(api.posterPath, "w500") ?? FALLBACK_POSTER,
    reviewsThisWeek: String(api.reviewsCount),
    author: withAt(api.username),
    authorAvatar: reviewAvatar,
    date: formatDate(review?.createdAt),
    replies: String(api.comments.length),
    title: api.title,
    quote: api.text,
    likes: String(review?.likesCount ?? api.likesCount),
    reviewId: review?.id,
    filmId: String(api.filmId),
    likedByMe: review?.isLikedByMe ?? api.isLikedByMe,
    likesCount: review?.likesCount ?? api.likesCount,
    topReplies: api.comments.slice(0, 3).map((c) => ({
      id: c.id,
      username: withAt(c.username),
      replyTo: withAt(api.username),
      // Comments carry no avatar; reuse the review author's when it's their own reply.
      avatarUrl: c.userId === api.userId ? reviewAvatar : FALLBACK_AVATAR,
      date: formatDate(c.createdAt),
      text: c.text,
      likes: String(c.likesCount),
      // A reply's like only works alongside its parent review id.
      replyId: review?.id ? c.id : undefined,
      likedByMe: c.isLikedByMe,
      likesCount: c.likesCount,
    })),
  };
}

/**
 * Build the "Most Discussed" thread from the most-reviewed payload. The endpoint
 * omits the review id (needed to like it), so recover it from the film's review
 * list by matching the author + title, which also yields authed like state.
 */
export async function buildMostDiscussed(
  api: DirectorMostReviewedResponse | null,
  isAuthed: boolean,
): Promise<DirectorMostDiscussed | null> {
  if (!api) return null;
  const reviews = await optionalData(
    getReviewsByFilm(api.filmId, { pageSize: 100, authed: isAuthed }),
  );
  const results = reviews?.results ?? [];
  const match =
    results.find(
      (r) => r.userId === api.userId && (r.title ?? "") === (api.title ?? ""),
    ) ?? results.find((r) => r.userId === api.userId);
  return toMostDiscussed(api, match);
}
