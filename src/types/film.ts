export interface FilmCardData {
  id: string;
  title: string;
  image: string;
  // Review-centric fields — present for editorial/static cards, absent for
  // catalogue data (e.g. /films/popular/weekly).
  quote?: string;
  reviewer?: string;
  rating?: number;
  // Shown in the meta line when no reviewer is available (e.g. "2019").
  year?: string;
}

export interface WeeklyFilmData {
  id: string;
  title: string;
  image: string;
  reviewCount: string;
  isFeatured?: boolean;
}

export interface CollectionData {
  id: string;
  title: string;
  films: string[]; // up to 11 unique poster paths; the middle one is the centre/featured panel
  backdrops?: string[]; // landscape stills for the centre panel (the featured film's backdrop)
  filmCount?: number; // shown in the "N films by @author" meta on browse-list cards
  author?: string; // handle without leading "@"
  // Per-user list state — present when the card is backed by a live API list, so
  // ListCard can seed its Like/Save buttons. Absent for static/demo data.
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ListCardData {
  id: string;
  title: string;
  filmCount: number;
  author: string; // handle without leading "@"
  posters: string[]; // exactly 4 poster image paths, left-to-right
}

export interface HotTakeCardData {
  id: string;
  image: string; // film still
  title: string; // the hot-take headline
  author: string; // handle without leading "@"
  date: string; // pre-formatted, e.g. "MAY 02 · 2026"
  replies: string; // pre-formatted, e.g. "1.2k"
}

export interface WeeklyQuote {
  id: string;
  text: string; // normal case; the featured quote is capitalized via CSS
  author: string; // handle without leading "@"
  film: string;
}

export interface DirectorCardData {
  id: string;
  name: string;
  image: string;
  mentions: string; // pre-formatted, e.g. "1.8k"
  currentFilm: string; // film "currently discussed"
}

/** A discussed-director card enriched with its raw numeric mention count
 *  (for sorting / admin editing). `mentions` stays the formatted display string. */
export interface DiscussedDirectorRow extends DirectorCardData {
  mentionsCount: number;
  tmdbId?: number; // TMDB person id, present when the row can be synced from TMDB
}

export interface DirectorApiResponse {
  directorId: number;
  lang: string;
  name: string;
  biography: string;
  birthday: string | null; // YYYY-MM-DD
  deathday: string | null; // YYYY-MM-DD
  gender: number | string;
  placeOfBirth: string | null;
  profilePath: string | null; // TMDB path, e.g. "/abc.jpg"
}

/** One film from GET /directors/{id}/filmography (also /actors/{id}/filmography). */
export interface FilmographyFilm {
  id: number;
  title: string;
  posterPath: string | null; // TMDB path, e.g. "/abc.jpg"
  releaseYear: number | null;
  genres: string[];
  voteAverage: number; // TMDB 0–10 scale
}

export interface FilmographyResponse {
  films: FilmographyFilm[];
}

/** A reply on the director's most-reviewed review (GET .../films/most-reviewed). */
export interface DirectorMostReviewedComment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string; // ISO
  likesCount: number;
  isLikedByMe: boolean;
}

/** GET /directors/{id}/films/most-reviewed - the director's most-reviewed film
 *  with its top review and that review's comments. 204 when the director has none. */
export interface DirectorMostReviewedResponse {
  filmId: number;
  filmTitle: string;
  filmSlug: string;
  posterPath: string | null;
  reviewsCount: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  title: string;
  text: string;
  likesCount: number;
  isLikedByMe: boolean;
  comments: DirectorMostReviewedComment[];
}

export interface DirectorStats {
  featureFilms: number;
  avgRating: number; // e.g. 4.4
  awards: number; // wins + nominations combined
}

/** GET /directors/{id}/stats - headline counters for the director hero card. */
export interface DirectorStatsResponse {
  directorId: number;
  filmsCount: number;
  averageRating: number;
  awards: { nominations: number; wins: number };
}

/** One person from GET /directors/{id}/similar. */
export interface SimilarDirectorPerson {
  directorId: number;
  profilePath: string | null;
  name: string;
}

export interface SimilarDirectorsResponse {
  similarDirectors: SimilarDirectorPerson[];
}

/** GET /actors/{id}/stats - mirrors the director stats payload (keyed actorId). */
export interface ActorStatsResponse {
  actorId: number;
  filmsCount: number;
  averageRating: number;
  awards: { nominations: number; wins: number };
}

/** One person from GET /actors/{id}/similar. */
export interface SimilarActorPerson {
  actorId: number;
  profilePath: string | null;
  name: string;
}

export interface SimilarActorsResponse {
  similarActors: SimilarActorPerson[];
}

/** Actor biography & metadata from GET /actors/{id} - mirrors the
 *  director payload (the backend may key the id as `actorId` or `directorId`;
 *  the page resolves the profile id from the route param either way). */
export interface ActorApiResponse {
  actorId?: number;
  directorId?: number;
  lang: string;
  name: string;
  biography: string;
  birthday: string | null; // YYYY-MM-DD
  deathday: string | null; // YYYY-MM-DD
  gender: number | string;
  placeOfBirth: string | null;
  profilePath: string | null; // TMDB path, e.g. "/abc.jpg"
}

export interface DirectorProfile {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null; // resolved (TMDB)
  birthYear: number | null;
  deathYear: number | null;
  birthplace: string | null;
  bio: string;
  stats: DirectorStats;
}

export interface ActiveMember {
  id: string;
  username: string; // with leading "@"
  avatarUrl: string;
  reviews: number;
  films: number;
}

export interface PopularMember {
  id: string;
  rank: string; // e.g. "01"
  username: string; // with leading "@"
  quote: string; // short, shown uppercase
  replies: string; // pre-formatted, e.g. "324"
}

export interface EditorialReply {
  id: string;
  username: string; // with leading "@"
  replyTo: string; // with leading "@"
  avatarUrl: string;
  date: string; // pre-formatted, e.g. "MAY 02 · 2026"
  text: string;
  likes: string; // pre-formatted, e.g. "186"
  // Live fields (present when backed by a real review comment). When set, the
  // reply renders a working LikeButton instead of the static like count.
  replyId?: string;
  likedByMe?: boolean;
  likesCount?: number;
}

export interface EditorialPick {
  image: string; // hero still
  title: string;
  body: string;
  author: string; // handle without leading "@"
  date: string; // pre-formatted, e.g. "MAY 02 · 2026"
  replies: string; // pre-formatted, e.g. "1.2k"
  views: string; // pre-formatted, e.g. "58.2k"
  topReplies: EditorialReply[];
}

export interface CommunityReply {
  username: string;
  replyTo: string;
  avatarUrl: string;
  text: string;
  // Like count on the reply; shown on the card only when > 0.
  likes?: number;
}

export interface UserProfileStats {
  totalFilmsRated: string; // pre-formatted, e.g. "2,341"
  listsCreated: string; // e.g. "8"
  reviewsWritten: string; // e.g. "187"
  joined: string; // e.g. "Mar 2021"
}

export interface UserProfile {
  slug: string;
  username: string; // with leading "@"
  avatarUrl: string;
  tagline: string; // shown uppercase under the username
  bio: string; // multi-paragraph, "\n\n" separated
  followers: string; // pre-formatted, e.g. "120"
  following: string; // pre-formatted, e.g. "342"
  friends: string; // pre-formatted, e.g. "12" (mobile-only stat row)
  stats: UserProfileStats;
}

export interface CommunityThread {
  id: string;
  username: string;
  filmTitle?: string;
  // Link to the full review page (/review/{reviewId}). Absent for static/demo
  // threads that have no backing review.
  href?: string;
  avatarUrl: string;
  text: string;
  replies: number;
  likes: number;
  // Reviewer's star rating (0–5, half-steps). Present for real reviews; absent
  // for static/demo threads that carry no rating.
  rating?: number;
  // Like context — present when the thread is backed by a real review, so the
  // card renders the interactive (fetching) LikeButton instead of static text.
  // `id` doubles as the reviewId.
  filmId?: string;
  slug?: string;
  likedByMe?: boolean;
  reply: CommunityReply;
  bgGradient: string;
  borderGradient: string;
}
