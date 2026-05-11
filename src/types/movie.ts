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
  id: string;
  releaseDate: string;
  trailerUrl: string;
  posterPath: string;
  backdropPath: string;
  localization: MovieLocalization;
  genres: { items: MovieGenre[] };
  // Not yet exposed by the Lumires API; filled in by FILM_EXTRAS fallback in the page for now.
  runtime?: string;
  tagline?: string;
  rating?: number;
  cast?: string[];
  director?: string;
  studio?: string;
}
