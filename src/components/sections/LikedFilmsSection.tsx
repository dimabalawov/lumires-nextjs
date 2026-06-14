import Link from "next/link";
import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import Pagination from "@/components/ui/Pagination";
import FilmFilters from "@/components/sections/FilmFilters";
import { getGenres } from "@/lib/api/genres";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import type { EditorialFilm } from "@/data/editorialCollections";
import type { FilmCatalogueItem } from "@/types/api";
import { getLikedFilms } from "@/lib/api/users";

const PAGE_SIZE = 20;
const toInt = (v: string | undefined, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);

function mapToCards(items: FilmCatalogueItem[]): EditorialFilm[] {
    return items.map((f) => ({
        id: String(f.id),
        title: f.title,
        poster: tmdbImage(f.posterPath, "w500") ?? "",
        year: f.releaseYear != null ? String(f.releaseYear) : "",
        genre: f.genres?.[0] ?? "",
        rating: f.voteAverage ? Math.round(f.voteAverage * 2) / 2 : 0,
    }));
}

interface Props {
    username: string;
    searchParams?: Record<string, string | string[] | undefined>;
}

export default async function LikedFilmsSection({ username, searchParams = {} }: Props) {
    const read = (k: string) => (Array.isArray(searchParams[k]) ? searchParams[k]![0] : searchParams[k]);

    const rating = toInt(read("rating"));
    const sortBy = toInt(read("sortBy"));
    const genre = read("genres") ?? "";
    const page = Math.max(1, toInt(read("page"), 1));

    const [filmsResult, genresResult] = await Promise.all([
        optionalData(getLikedFilms(username, { rating, sortBy, genres: genre ? [genre] : undefined, page, pageSize: PAGE_SIZE, authed: true })),
        optionalData(getGenres()),
    ]);

    const films = mapToCards(filmsResult?.results ?? []);
    const currentPage = filmsResult?.page ?? page;
    const totalPages = filmsResult?.totalPages ?? 1;
    const genreNames = genresResult?.genres?.map((g) => g.name) ?? [];

    return (
        <>
            <FilmFilters userSection={true} value={{ content: 0, rating, sortBy, genre }} genres={genreNames} />

            {films.length === 0 ? (
                <p className="py-16 text-center font-manrope font-light text-brand-muted">No liked films yet.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {films.map((film) => (
                        <Link key={film.id} href={`/films/${film.id}`} className="block transition-opacity hover:opacity-90">
                            <EditorialPosterCard film={film} />
                        </Link>
                    ))}
                </div>
            )}

            <Pagination page={currentPage} totalPages={totalPages} />
        </>
    );
}