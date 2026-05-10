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
}
