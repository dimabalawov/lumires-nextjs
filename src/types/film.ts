export interface FilmCardData {
  id: string;
  title: string;
  quote: string;
  reviewer: string;
  image: string;
  rating: number;
}

export interface WeeklyFilmData {
  id: string;
  title: string;
  image: string;
  reviewCount: string;
  isFeatured?: boolean;
}
