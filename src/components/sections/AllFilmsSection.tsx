import Link from "next/link";
import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import Pagination from "@/components/ui/Pagination";
import FilmFilters from "@/components/sections/FilmFilters";
import { getFilms } from "@/lib/api/films";
import { getGenres } from "@/lib/api/genres";
import { tmdbImage } from "@/lib/images/tmdb";
import { allFilms } from "@/data/allFilms";
import type { EditorialFilm } from "@/data/editorialCollections";
import type { FilmCatalogueItem } from "@/types/api";

const PAGE_SIZE = 20;

function toInt(value: string | undefined, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapToCards(items: FilmCatalogueItem[]): EditorialFilm[] {
  return items.map((f) => ({
    id: String(f.id),
    title: f.title,
    poster: tmdbImage(f.posterPath, "w500") ?? "",
    year: f.releaseYear != null ? String(f.releaseYear) : "",
    genre: f.genres?.[0] ?? "",
    // API voteAverage is 0–10; the card renders an out-of-5 score.
    rating: f.voteAverage ? Math.round(f.voteAverage) / 2 : 0,
  }));
}

interface AllFilmsSectionProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function AllFilmsSection({ searchParams = {} }: AllFilmsSectionProps) {
  const read = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const content = toInt(read("content"));
  const rating = toInt(read("rating"));
  const sortBy = toInt(read("sortBy"));
  const genre = read("genres") ?? "";
  const requestedPage = Math.max(1, toInt(read("page"), 1));

  const [filmsResult, genresResult] = await Promise.all([
    getFilms({
      content,
      rating,
      sortBy,
      genres: genre ? [genre] : undefined,
      page: requestedPage,
      pageSize: PAGE_SIZE,
    }).catch(() => null),
    getGenres().catch(() => null),
  ]);

  const apiFilms = filmsResult?.results ?? [];
  const films = apiFilms.length > 0 ? mapToCards(apiFilms) : allFilms; // static demo on API failure
  const isLive = apiFilms.length > 0;
  const currentPage = filmsResult?.page ?? requestedPage;
  const totalPages = filmsResult?.totalPages ?? 1;
  const genreNames = genresResult?.genres?.map((g) => g.name) ?? [];

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <FilmFilters value={{ content, rating, sortBy, genre }} genres={genreNames} />

        {films.length === 0 ? (
          <p className="py-16 text-center font-manrope font-light text-brand-muted">
            No films match these filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
            {films.map((film) =>
              isLive ? (
                <Link
                  key={film.id}
                  href={`/films/${film.id}`}
                  className="block transition-opacity hover:opacity-90"
                >
                  <EditorialPosterCard film={film} />
                </Link>
              ) : (
                <EditorialPosterCard key={film.id} film={film} />
              ),
            )}
          </div>
        )}

        <Pagination page={currentPage} totalPages={totalPages} />
      </div>
    </section>
  );
}
