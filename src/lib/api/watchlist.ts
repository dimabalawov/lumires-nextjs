import { PagedResponse, FilmListItem } from "@/types/watchlist";
import { apiRequest } from "./client";
import { tmdbImage } from "../images/tmdb";

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(sp: RawSearchParams, key: string): string | undefined {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
}

function all(sp: RawSearchParams, key: string): string[] {
    const v = sp[key];
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
}

/**
 * URL keys map to the FastEndpoints Query class:
 *   filter -> Rating  (RatingEnum integer value)
 *   genre  -> Genres  (string[], repeatable)
 *   sortBy -> SortBy  (FilmContentOrder integer value)
 *   page   -> Page
 * WatchlistFilters strips defaults from the URL, so present values are
 * forwarded as-is.
 */
export async function getWatchlist(
    username: string,
    searchParams: RawSearchParams,
): Promise<PagedResponse<FilmListItem> | null> {
    const qs = new URLSearchParams();

    const rating = first(searchParams, "rating");
    const genres = all(searchParams, "genre").filter((g) => g && g !== "all");
    const sort = first(searchParams, "sortBy");
    const page = first(searchParams, "page");

    if (rating) qs.set("Rating", rating);
    for (const g of genres) qs.append("Genres", g);
    if (sort) qs.set("SortBy", sort);
    if (page) qs.set("Page", page);

    const query = qs.toString();

    // singular /user/ to match the backend route; AllowAnonymous => authExcep: true
    var res = await apiRequest<PagedResponse<FilmListItem>>(
        `/users/${encodeURIComponent(username)}/watchlist${query ? `?${query}` : ""}`,
        { cache: "no-store", auth: true, authExcep: true },
    );

    res.results = res.results.map((result) => ({
        ...result,
        posterPath: tmdbImage(result.posterPath, "w500") ?? "",
    }));

    return res;
}
