import type { EditorialFilm } from "./editorialCollections";

export type AllFilm = EditorialFilm;

const editorialA = "/imgs/editorial/image 12.png";
const editorialB = "/imgs/editorial/image 13.png";
const editorialC = "/imgs/editorial/image 13 (1).png";

export const allFilms: AllFilm[] = [
  { id: "af-1", title: "Dune: Part Two", year: "2024", genre: "Sci-Fi", rating: 5, poster: editorialA },
  { id: "af-2", title: "Apex", year: "2026", genre: "Thriller", rating: 4, poster: editorialB },
  { id: "af-3", title: "The Devil Wears Prada", year: "2024", genre: "Comedy", rating: 4, poster: editorialC },
  { id: "af-4", title: "Michael", year: "2026", genre: "Music-Drama", rating: 4, poster: editorialA },
  { id: "af-5", title: "Dune: Part Two", year: "2024", genre: "Sci-Fi", rating: 5, poster: editorialA },
  { id: "af-6", title: "Apex", year: "2026", genre: "Thriller", rating: 4, poster: editorialB },
  { id: "af-7", title: "The Devil Wears Prada", year: "2024", genre: "Comedy", rating: 4, poster: editorialC },
  { id: "af-8", title: "Michael", year: "2026", genre: "Music-Drama", rating: 4, poster: editorialA },
  { id: "af-9", title: "Dune: Part Two", year: "2024", genre: "Sci-Fi", rating: 5, poster: editorialA },
  { id: "af-10", title: "Apex", year: "2026", genre: "Thriller", rating: 4, poster: editorialB },
  { id: "af-11", title: "The Devil Wears Prada", year: "2024", genre: "Comedy", rating: 4, poster: editorialC },
  { id: "af-12", title: "Michael", year: "2026", genre: "Music-Drama", rating: 4, poster: editorialA },
  { id: "af-13", title: "Dune: Part Two", year: "2024", genre: "Sci-Fi", rating: 5, poster: editorialA },
  { id: "af-14", title: "Apex", year: "2026", genre: "Thriller", rating: 4, poster: editorialB },
  { id: "af-15", title: "The Devil Wears Prada", year: "2024", genre: "Comedy", rating: 4, poster: editorialC },
  { id: "af-16", title: "Michael", year: "2026", genre: "Music-Drama", rating: 4, poster: editorialA },
];
