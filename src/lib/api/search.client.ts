import { apiRequest } from "@/lib/api/auth.client";
import { ExternalFilmShort, MemberResult, SearchResponse } from "@/types/search";
import { tmdbImage } from "../images/tmdb";
import toAvatarUrl from "../images/storage";


export type SearchFilter = "All" | "Films" | "Directors" | "Actors" | "Lists" | "Members";

export async function searchArchive(
    filter: SearchFilter,
    term: string,
    page = 1,
): Promise<SearchResponse> {
    const q = term.trim();
    if (!q) return {};

    const qs = new URLSearchParams({
        Filter: filter,
        SearchTerm: q,
        Page: String(page),
    });

    const res = await apiRequest<SearchResponse>(`/search?${qs.toString()}`, {
        auth: true,
        cache: "no-store",
    });

    res.actors = res.actors?.map((actor) => ({
        ...actor,
        profilePath: actor.profilePath ? tmdbImage(actor.profilePath, "w342") : null,
    }));

    res.directors = res.directors?.map((director) => ({
        ...director,
        profilePath: director.profilePath ? tmdbImage(director.profilePath, "w342") : null,
    }))

    res.films = res.films?.map((film) => ({
        ...film,
        posterPath: film.posterPath ? tmdbImage(film.posterPath, "w342") : null,
    }))

    res.lists = res.lists?.map((list) => ({
        ...list,
        films: list.films.map((film) => ({
            ...film,
            posterUrl: film.posterPath ? tmdbImage(film.posterPath, "w500") : null,
        })),
    }));

    if (res.members) {
        res.members = await enrichMembers(res.members);
    }

    return res ?? {};
}

async function enrichMembers(res: MemberResult[]) {
    res = await Promise.all(
        res?.map(async (member) => ({
            ...member,
            avatarUrl: (await toAvatarUrl(member.avatarUrl)) ?? "",
        })) ?? []
    );
    return res;
}


export async function searchFilms(term: string, page = 1): Promise<ExternalFilmShort[]> {
    const q = term.trim();
    if (!q) return [];

    const qs = new URLSearchParams({
        Filter: "Films",
        SearchTerm: q,
        Page: String(page),
    });

    const res = await apiRequest<SearchResponse>(`/search?${qs.toString()}`, {
        auth: true,
        cache: "no-store",
    });

    const films: ExternalFilmShort[] = res.films?.map((film) => ({
        ...film,
        posterPath: tmdbImage(film.posterPath, "w500") ?? "",
        releaseYear: film.releaseYear ?? null,
    })) ?? [];

    return films;
}
