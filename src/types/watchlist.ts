import { apiRequest } from "@/lib/api/client";

export interface FilmListItem {
  id: number;
  title: string;
  posterPath: string | null;
  releaseYear: number | null;
  genres: string[];
  voteAverage: number;
}
 
export interface PagedResponse<T> {
  results: T[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

