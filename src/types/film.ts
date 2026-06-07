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
  films: string[]; // exactly 11 image paths; index 5 is the center/featured card
  filmCount?: number; // shown in the "N films by @author" meta on browse-list cards
  author?: string; // handle without leading "@"
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
  biography: string;
  birthday: string | null; // YYYY-MM-DD
  deathday: string | null; // YYYY-MM-DD
  gender: number;
  placeOfBirth: string | null;
  profilePath: string | null; // TMDB path, e.g. "/abc.jpg"
}

export interface DirectorStats {
  featureFilms: number;
  avgRating: number; // e.g. 4.4
  reviewsCount: string; // pre-formatted, e.g. "28.7K"
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
