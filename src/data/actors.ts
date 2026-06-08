import type { EditorialFilm } from "./editorialCollections";
import type { DirectorMostDiscussed } from "./directors";
import type { DirectorStats } from "@/types/film";

/** Similar-actor card on an actor profile (mirrors SimilarDirector). */
export interface SimilarActor {
  id: string; // slug for href, e.g. "timothee-chalamet"
  apiId: number; // actor id used in /actors/[slug]/[id]
  name: string;
  image: string;
  matchPercent: number; // 0-100
}

// Stats aren't exposed by the API yet — fall back to per-actor static stats
// keyed by the API actorId, or a generic default if missing.
const DEFAULT_ACTOR_STATS: DirectorStats = {
  featureFilms: 0,
  avgRating: 0,
  reviewsCount: "0",
};

const actorStatsById: Record<number, DirectorStats> = {
  505710: { featureFilms: 24, avgRating: 4.1, reviewsCount: "12.6K" }, // Zendaya
};

export function getActorStats(id: number): DirectorStats {
  return actorStatsById[id] ?? DEFAULT_ACTOR_STATS;
}

// Editorial extras (pull-quote, top genres, filmography, top thread, similar actors)
// — not in the API.
export interface ActorEditorial {
  pullQuote?: string;
  topGenres?: string[];
  filmography?: EditorialFilm[];
  mostDiscussed?: DirectorMostDiscussed;
  similarActors?: SimilarActor[];
}

const PLACEHOLDER_POSTER_A = "/imgs/editorial/image 12.png";
const PLACEHOLDER_POSTER_B = "/imgs/editorial/image 13.png";
const PLACEHOLDER_POSTER_C = "/imgs/editorial/image 13 (1).png";

const actorEditorialById: Record<number, ActorEditorial> = {
  505710: {
    pullQuote: "I want to keep playing characters that scare me a little.",
    topGenres: [
      "Drama",
      "Science Fiction",
      "Coming Of Age",
      "Romance",
      "Thriller",
      "Musical",
    ],
    filmography: [
      { id: "zen-1", title: "Spider-Man: Homecoming", year: "2017", genre: "Action", rating: 4, poster: PLACEHOLDER_POSTER_A },
      { id: "zen-2", title: "The Greatest Showman", year: "2017", genre: "Musical", rating: 4, poster: PLACEHOLDER_POSTER_B },
      { id: "zen-3", title: "Malcolm & Marie", year: "2021", genre: "Drama", rating: 4, poster: PLACEHOLDER_POSTER_C },
      { id: "zen-4", title: "Dune", year: "2021", genre: "Sci-Fi", rating: 5, poster: PLACEHOLDER_POSTER_A },
      { id: "zen-5", title: "Dune: Part Two", year: "2024", genre: "Sci-Fi", rating: 5, poster: PLACEHOLDER_POSTER_B },
      { id: "zen-6", title: "Challengers", year: "2024", genre: "Drama", rating: 4, poster: PLACEHOLDER_POSTER_C },
    ],
    mostDiscussed: {
      filmTitle: "Dune: Part Two",
      filmPoster: PLACEHOLDER_POSTER_C,
      reviewsThisWeek: "612",
      author: "@lightandshadow",
      authorAvatar: "/imgs/community/cinephile.png",
      date: "MAY 02 · 2026",
      replies: "37",
      title: "Power Demands Belief.",
      quote:
        "There is no film I have returned to more. Every watch reveals something new — a detail in the background, a line that lands differently, a moment that didn't make sense until now.",
      likes: "284",
      topReplies: [
        {
          id: "zen-md-r1",
          username: "@silvergrain",
          replyTo: "@lightandshadow",
          avatarUrl: "/imgs/community/quietobserver.png",
          date: "MAY 02 · 2026",
          text: "I had the same feeling. It's like the film slowly shifts your perspective without you noticing. You start off seeing him as a hero, and then suddenly you're questioning everything.",
          likes: "164",
        },
        {
          id: "zen-md-r2",
          username: "@cinemaluna",
          replyTo: "@lightandshadow",
          avatarUrl: "/imgs/community/midnightframes.png",
          date: "MAY 02 · 2026",
          text: "Exactly this. Every quiet scene feels intentional, and the performances carry a weight that lingers long after the credits.",
          likes: "151",
        },
      ],
    },
    similarActors: [
      { id: "timothee-chalamet", apiId: 1190668, name: "Timothée Chalamet", image: "/imgs/directors/image 21.png", matchPercent: 88 },
      { id: "florence-pugh", apiId: 234352, name: "Florence Pugh", image: "/imgs/directors/image 21 (1).png", matchPercent: 81 },
      { id: "anya-taylor-joy", apiId: 1397778, name: "Anya Taylor-Joy", image: "/imgs/directors/image 21 (2).png", matchPercent: 76 },
      { id: "saoirse-ronan", apiId: 36592, name: "Saoirse Ronan", image: "/imgs/directors/image 21.png", matchPercent: 72 },
    ],
  },
};

export function getActorEditorial(id: number): ActorEditorial {
  return actorEditorialById[id] ?? {};
}
