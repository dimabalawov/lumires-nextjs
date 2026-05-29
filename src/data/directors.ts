import type { EditorialFilm } from "./editorialCollections";
import { DirectorCardData, DirectorStats, EditorialReply } from "@/types/film";

export interface SimilarDirector {
  id: string; // slug for href, e.g. "paul-thomas-anderson"
  apiId: number; // director id used in /directors/[slug]/[id]
  name: string;
  image: string;
  matchPercent: number; // 0-100
}

export interface DirectorMostDiscussed {
  filmTitle: string;
  filmPoster: string;
  reviewsThisWeek: string; // pre-formatted, e.g. "847"
  author: string; // with leading "@"
  authorAvatar: string;
  date: string; // pre-formatted, e.g. "MAY 02 · 2026"
  replies: string; // pre-formatted, e.g. "48"
  title: string;
  quote: string;
  likes: string; // pre-formatted, e.g. "324"
  topReplies: EditorialReply[];
}

// Portraits live in /public/imgs/directors (image 21 variants); mapped in order.
export const discussedDirectors: DirectorCardData[] = [
  {
    id: "paul-thomas-anderson",
    name: "Paul Thomas Anderson",
    image: "/imgs/directors/image 21.png",
    mentions: "1.8k",
    currentFilm: "There Will Be Blood",
  },
  {
    id: "denis-villeneuve",
    name: "Denis Villeneuve",
    image: "/imgs/directors/image 21 (1).png",
    mentions: "2.4k",
    currentFilm: "Dune: Part Two",
  },
  {
    id: "david-lynch",
    name: "David Lynch",
    image: "/imgs/directors/image 21 (2).png",
    mentions: "1.5k",
    currentFilm: "Mulholland Drive",
  },
];

// Stats aren't exposed by the API yet — fall back to per-director static stats
// keyed by the API directorId, or a generic default if missing.
const DEFAULT_DIRECTOR_STATS: DirectorStats = {
  featureFilms: 0,
  avgRating: 0,
  reviewsCount: "0",
};

const directorStatsById: Record<number, DirectorStats> = {
  1: { featureFilms: 6, avgRating: 4.2, reviewsCount: "18.4K" }, // George Lucas
};

export function getDirectorStats(id: number): DirectorStats {
  return directorStatsById[id] ?? DEFAULT_DIRECTOR_STATS;
}

// Editorial extras (pull-quote, top genres, filmography, top thread, similar directors)
// — not in the API.
export interface DirectorEditorial {
  pullQuote?: string;
  topGenres?: string[];
  filmography?: EditorialFilm[];
  mostDiscussed?: DirectorMostDiscussed;
  similarDirectors?: SimilarDirector[];
}

const PLACEHOLDER_POSTER_A = "/imgs/editorial/image 12.png";
const PLACEHOLDER_POSTER_B = "/imgs/editorial/image 13.png";
const PLACEHOLDER_POSTER_C = "/imgs/editorial/image 13 (1).png";

const directorEditorialById: Record<number, DirectorEditorial> = {
  1: {
    pullQuote:
      "A special effect without a story is a pretty boring thing.",
    topGenres: [
      "Science Fiction",
      "Adventure",
      "Fantasy",
      "Mythic Storytelling",
      "Coming Of Age",
      "World Building",
    ],
    filmography: [
      { id: "gl-1", title: "THX 1138", year: "1971", genre: "Sci-Fi", rating: 4, poster: PLACEHOLDER_POSTER_A },
      { id: "gl-2", title: "American Graffiti", year: "1973", genre: "Drama", rating: 5, poster: PLACEHOLDER_POSTER_B },
      { id: "gl-3", title: "Star Wars", year: "1977", genre: "Sci-Fi", rating: 5, poster: PLACEHOLDER_POSTER_C },
      { id: "gl-4", title: "The Phantom Menace", year: "1999", genre: "Sci-Fi", rating: 3, poster: PLACEHOLDER_POSTER_A },
      { id: "gl-5", title: "Attack Of The Clones", year: "2002", genre: "Sci-Fi", rating: 3, poster: PLACEHOLDER_POSTER_B },
      { id: "gl-6", title: "Revenge Of The Sith", year: "2005", genre: "Sci-Fi", rating: 4, poster: PLACEHOLDER_POSTER_C },
    ],
    mostDiscussed: {
      filmTitle: "Star Wars",
      filmPoster: PLACEHOLDER_POSTER_C,
      reviewsThisWeek: "847",
      author: "@lightandshadow",
      authorAvatar: "/imgs/community/cinephile.png",
      date: "MAY 02 · 2026",
      replies: "48",
      title: "Power Demands Belief.",
      quote:
        "There is no film I have returned to more. Every watch reveals something new — a detail in the background, a line that lands differently, a moment that didn't make sense until now.",
      likes: "324",
      topReplies: [
        {
          id: "gl-md-r1",
          username: "@silvergrain",
          replyTo: "@lightandshadow",
          avatarUrl: "/imgs/community/quietobserver.png",
          date: "MAY 02 · 2026",
          text: "I had the same feeling. It's like the film slowly shifts your perspective without you noticing. You start off seeing him as a hero, and then suddenly you're questioning everything.",
          likes: "186",
        },
        {
          id: "gl-md-r2",
          username: "@cinemaluna",
          replyTo: "@lightandshadow",
          avatarUrl: "/imgs/community/midnightframes.png",
          date: "MAY 02 · 2026",
          text: "Exactly this. It's almost uncomfortable to watch how Paul changes, but that's what makes it so powerful. You don't fully root for him anymore — and I think that's intentional.",
          likes: "186",
        },
      ],
    },
    similarDirectors: [
      { id: "paul-thomas-anderson", apiId: 2, name: "Paul Thomas Anderson", image: "/imgs/directors/image 21.png", matchPercent: 87 },
      { id: "denis-villeneuve", apiId: 3, name: "Denis Villeneuve", image: "/imgs/directors/image 21 (1).png", matchPercent: 82 },
      { id: "david-lynch", apiId: 4, name: "David Lynch", image: "/imgs/directors/image 21 (2).png", matchPercent: 78 },
      { id: "paul-thomas-anderson", apiId: 2, name: "Paul Thomas Anderson", image: "/imgs/directors/image 21.png", matchPercent: 74 },
    ],
  },
};

export function getDirectorEditorial(id: number): DirectorEditorial {
  return directorEditorialById[id] ?? {};
}

// "george-lucas" → "George Lucas"
export function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
