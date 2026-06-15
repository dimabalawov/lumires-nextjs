// Lumires reviews API shape (best-guess until non-empty data lands).
// Endpoint: GET /films/-/{id}/reviews?filter=0&category=0&sortBy=0&page=1&pageSize=N
// Update fields here once the real payload is available.

export interface ReviewReply {
  username: string;
  avatarUrl: string;
  text: string;
}

// One item from GET /films/{slug}/{id}/reviews. Field names mirror the live API.
export interface Review {
  id: string;
  userId?: string;
  username: string;
  avatarUrl?: string;
  title?: string | null;
  text: string;
  rating?: number | null;
  repliesCount?: number;
  likesCount?: number;
  createdAt: string; 
  isLikedByMe?: boolean;
  isSavedByMe?: boolean;
  isSpoilerFree?: boolean;
  filmId: number;
  filmTitle: string;
  filmPosterPath: string | null;
}

export interface ReviewsResponse {
  results: Review[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// One comment/reply on a review. This is both the item shape of the review
// detail `comments[]` (GET /films/{slug}/{id}/reviews/{reviewId}) and of the
// paginated GET /films/{slug}/{id}/reviews/{reviewId}/replies endpoint.
// NOTE: the API currently does NOT return the reply body (`text` is absent) and
// misattributes `username`/`targetedUserUsername` to the review author for every
// reply — a backend serializer bug. Treat those fields as unreliable until fixed.
export interface ReviewComment {
  id: string;
  userId?: string;
  username: string;
  avatarUrl: string | null;
  text?: string | null;
  likesCount?: number;
  createdAt?: string; // date-time
  targetedUserId?: string | null;
  targetedUserUsername?: string | null;
  isLikedByMe?: boolean;
  isSpoilerFree?: boolean;
}

// POST .../like response — the authoritative new state after toggling.
export interface LikeToggleResponse {
  isLiked: boolean;
  likesCount: number;
}

// GET /films/{slug}/{filmId}/reviews/{reviewId}/replies — paginated replies on a review.
export interface ReviewRepliesResponse {
  results: ReviewComment[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// GET /films/{slug}/{filmId}/reviews/{reviewId} — a single review with its comments.
export interface ReviewDetail {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  title: string | null;
  text: string;
  rating: number | null;
  repliesCount: number;
  likesCount: number;
  createdAt: string; // date-time
  isLikedByMe: boolean;
  isSpoilerFree: boolean;
  comments: ReviewComment[];
}

// Editorial featured review used in the "Popular Reviews" carousel on /reviews.
export interface FeaturedReview {
  id: string;
  href?: string; // link to the full review page (/review/{reviewId})
  tag: string; // "Editor's Pick"
  timeAgo: string; // "4 days ago"
  title: string;
  posterUrl: string;
  year: string;
  genre: string;
  runtime: string;
  director: string;
  pullQuote: string;
  body: string[];
  username: string;
  avatarUrl: string;
  date: string; // "May 2"
  readTime: string; // "8 min read"
  rating: number;
  likes: number;
  replies: number;
}

// Flat review item used in the "Recent Activity" feed on /reviews.
export interface ActivityReview {
  id: string;
  href?: string; // link to the full review page (/review/{reviewId})
  avatarUrl: string;
  username: string;
  rating: number | undefined | null; 
  timeAgo: string;
  replies: number;
  filmTitle: string;
  filmHref: string;
  title: string;
  body: string[];
  likes: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  posterUrl: string;
}
