export interface MovieGenre {
  id: number;
  name: string;
  languageCode: string;
}

export interface MovieLocalization {
  languageCode: string;
  title: string;
  overview: string;
}

export interface MoviePerson {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  releaseDate: string;
  trailerUrl: string;
  posterPath: string;
  backdropPath: string;
  localization: MovieLocalization;
  genres: { items: MovieGenre[] };
  cast: MoviePerson[];
  directors: MoviePerson[];
  productionCompany: string;
  runtime: number;
  voteAverage?: number;
  voteCount?: number;
  // Not yet exposed by the Lumires API; filled in by FILM_EXTRAS fallback in the page for now.
  tagline?: string;
  rating?: number;
  // Per-user state, only populated when GET /films/{id} is fetched with the user's
  // Bearer token. Undefined when anonymous or until the backend ships these fields.
  isLikedByMe?: boolean;
  isWatchedByMe?: boolean;
  myRating?: number | null;
}
