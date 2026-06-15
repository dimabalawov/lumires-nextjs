import { getWatchlist } from "@/lib/api/watchlist";
import FilmFilters, { type FilmFiltersValue } from "@/components/sections/FilmFilters";
import WatchlistCard from "./WatchlistCard";

interface Props {
    username: string;
    searchParams: Record<string, string | string[] | undefined>;
}

function first(sp: Props["searchParams"], key: string): string | undefined {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
}

export default async function WatchlistSection({ username, searchParams }: Props) {
    const data = await getWatchlist(username, searchParams);

    const hasActiveFilters = ["rating", "genres", "sortBy"].some((k) => k in searchParams);

    // Stopgap: derive genre options from the current page's films. This only
    // reflects genres present on the loaded page — replace with a dedicated
    // genres endpoint or your genre enum for the full list.
    const genres = data
        ? Array.from(new Set(data.results.flatMap((f) => f.genres))).sort()
        : [];

    // FilmFilters writes rating/sortBy as plain numbers, so parse them directly.
    const filterValue: FilmFiltersValue = {
        content: 0,
        rating: Number(first(searchParams, "rating") ?? 0),
        sortBy: Number(first(searchParams, "sortBy") ?? 0),
        genre: first(searchParams, "genres") ?? "",
    };

    if (!data || data.results.length === 0) {
        return (
            <>
                <FilmFilters value={filterValue} genres={genres} userSection />
                <p className="font-manrope text-brand-light/50 text-sm tracking-wide py-16 text-center">
                    {hasActiveFilters
                        ? "No films match these filters."
                        : "Nothing on this watchlist yet."}
                </p>
            </>
        );
    }

    return (
        <>
            <FilmFilters value={filterValue} genres={genres} userSection />

            <p className="font-manrope text-brand-light/40 text-xs uppercase tracking-[0.2em] mb-6">
                {data.totalResults} {data.totalResults === 1 ? "film" : "films"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {data.results.map((film) => (
                    <WatchlistCard key={film.id} film={film} username={username} />
                ))}
            </div>
        </>
    );
}