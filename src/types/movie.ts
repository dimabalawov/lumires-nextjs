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

export interface MovieDetail {
  id: number;
  releaseDate: string;
  trailerUrl: string;
  posterPath: string;
  backdropPath: string;
  localization: MovieLocalization;
  genres: { items: MovieGenre[] };
  cast: string[];
  directors: string[];
  productionCompany: string;
  runtime: number;
  // Not yet exposed by the Lumires API; filled in by FILM_EXTRAS fallback in the page for now.
  tagline?: string;
  rating?: number;
}
