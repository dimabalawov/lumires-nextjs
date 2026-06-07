// Types generated from the Lumires API OpenAPI spec.
// Spec: https://lumires-api.supabase.win/openapi/v1.json (docs at /scalar)
// Keep enum values in sync with the `x-enumNames` ordering in the spec.

// ---------------------------------------------------------------------------
// Enums (sent as integers in query strings)
// ---------------------------------------------------------------------------

/** Review rating filter (`/films/{slug}/{id}/reviews?filter=`). */
export enum RatingEnum {
  All = 0,
  MoreThanFourHalf = 1,
  FourStars = 2,
  ThreeStars = 3,
  UnderThree = 4,
}

/** Review category filter (`?category=`). */
export enum ContentFilterEnum {
  All = 0,
  LongForm = 1,
  SpoilerFree = 2,
  FirstWatches = 3,
  FromFriends = 4,
}

/** Review sort order (`?sortBy=`). */
export enum ContentOrderEnum {
  MostRecent = 0,
  MostLiked = 1,
  MostReplies = 2,
  HighestRated = 3,
}

/** Film catalogue content filter (`/films?content=`). */
export enum FilmContentFilter {
  All = 0,
  Popular = 1,
  TopRated = 2,
  NewReleases = 3,
  FirstWatches = 4,
  HiddenGems = 5,
}

/** Film catalogue sort order (`/films?sortBy=`). */
export enum FilmContentOrder {
  MostRecent = 0,
  MostLiked = 1,
  MostReplies = 2,
  HighestRated = 3,
  LeastRated = 4,
}

/** Director gender (`Response11.gender`). */
export enum GenderType {
  NotSpecified = 0,
  Female = 1,
  Male = 2,
  NonBinary = 3,
}

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------

export interface GenreItem {
  id: string; // guid
  name: string;
  languageCode: string;
}

export interface GenresResponse {
  genres: GenreItem[];
}

// ---------------------------------------------------------------------------
// Films
// ---------------------------------------------------------------------------

export interface FilmsSummary {
  filmCount: number;
  genreCount: number;
}

/** One item in GET /films (paginated catalogue). */
export interface FilmCatalogueItem {
  id: number;
  title: string;
  releaseYear: number | null;
  genres: string[];
  voteAverage: number; // 0–5
  posterPath: string | null;
}

/** GET /films — sorted, filtered, paginated catalogue. */
export interface FilmsResponse {
  results: FilmCatalogueItem[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilmSource {
  externalId: number;
  providerName: string;
  type: string;
  url: string;
  quality: string;
  price: number | null;
}

export interface FilmSourcesResponse {
  sources: FilmSource[];
}

export interface WeeklyRecentItem {
  externalId: number;
  title: string;
  voteCount: number;
  releaseYear: number | null;
  slug: string;
  trailerUrl: string | null;
  backdropPath: string | null;
}

export interface WeeklyPopularItem {
  externalId: number;
  title: string;
  releaseYear: number | null;
  voteCount: number;
  slug: string;
  trailerUrl: string | null;
  backdropPath: string | null;
}

export interface WeeklyReviewedItem {
  filmId: number;
  id: string; // guid — the featured review's id (deep-link target)
  title: string;
  quote: string | null;
  slug: string;
  backdropPath: string | null;
  reviewerId: string; // guid
  reviewerName: string;
  rating: number | null;
}

/** One item in GET /films/{slug}/{id}/similar. */
export interface SimilarFilmItem {
  externalId: number;
  posterPath: string | null;
  title: string;
  slug: string;
  releaseYear: number | null;
  // Spec documents this as string[], but the API returns {id, name} objects.
  // Accept both so callers must resolve the display name explicitly.
  genres: (string | { id: string; name: string })[];
  rating: number | null; // 0–10 vote average
}

export interface SimilarFilmsResponse {
  films: SimilarFilmItem[];
}

export interface WeeklyRecentResponse {
  items: WeeklyRecentItem[];
}
export interface WeeklyPopularResponse {
  items: WeeklyPopularItem[];
}
export interface WeeklyReviewedResponse {
  items: WeeklyReviewedItem[];
}

/** Body for POST /films/{slug}/{filmId}/rate. */
export interface RateFilmCommand {
  rating: number;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface ReviewsSummary {
  reviewsThisWeek: number;
  reviewsThisDay: number;
}

/** Body for POST /films/{slug}/{filmId}/reviews. */
export interface CreateReviewCommand {
  title?: string | null;
  text: string;
  rating?: number | null;
  isSpoilerFree?: boolean;
}

/** Body for POST /films/{slug}/{filmId}/reviews/{reviewId}/reply. */
export interface CreateReviewCommentCommand {
  text: string;
  targetedUserId?: string | null; // guid
}

/**
 * GET /reviews/popular/{daySpan} item.
 * The API does not document this body and currently returns an empty list, so
 * every field is best-guess (and optional), modeled on sibling review/film
 * endpoints (e.g. WeeklyReviewedItem). Tighten once real data is available.
 */
export interface PopularReviewItem {
  reviewId?: string; // guid
  externalId?: number; // film id
  slug?: string; // film slug
  filmTitle?: string;
  title?: string; // review title
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseYear?: number | null;
  genre?: string | null;
  runtime?: number | null;
  director?: string | null;
  quote?: string | null;
  text?: string | null;
  reviewerId?: string; // guid
  reviewerName?: string;
  avatarUrl?: string | null;
  createdAt?: string; // date-time
  rating?: number | null;
  likes?: number;
  replies?: number;
}

export interface PopularReviewsResponse {
  items: PopularReviewItem[];
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

export interface FilmListPreviewItem {
  backdropPath: string | null;
}

export interface FilmsListsGroup {
  name: string;
  films: FilmListPreviewItem[];
}

export interface FilmsListsByFilmResponse {
  filmLists: FilmsListsGroup[];
}

export interface ListFilmItem {
  filmId: number;
  title: string;
  posterPath: string | null;
  order: number;
}

export interface ListDetail {
  id: string; // guid
  title: string;
  description: string | null;
  authorName: string;
  createdAt: string; // date-time
  films: ListFilmItem[];
}

/** Body for POST /lists. */
export interface CreateFilmsListCommand {
  title: string;
  description?: string | null;
  isPrivate?: boolean;
  filmIds: number[];
}

export interface CreateFilmsListResponse {
  filmsListId: string; // guid
  title: string;
  createdAt: string; // date-time
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface MeProfile {
  id: string; // guid
  email: string;
  username: string | null;
  avatarUrl: string | null;
}

/** Body for POST /auth/register. */
export interface CreateProfileCommand {
  id?: string; // guid
  username: string;
  email: string;
}
