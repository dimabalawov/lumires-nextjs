
import "server-only";
import { PopularList, PopularListsResponse, ProfileFeaturedReview, ProfileSettings, UserProfile, UserProfileStats, UserProfileSummary, UserSettingsResponse } from "@/types/profile";
import { apiRequest } from "./client";
import { FavoriteFilms } from "@/types/film";
import { tmdbImage } from "../images/tmdb";
import { cache } from "react";
import toAvatarUrl from "../images/storage";
import { BrowseListsResponse, FilmsResponse } from "@/types/api";
import { ReviewsResponse } from "@/types/review";

export const getProfile = cache(
    async (username: string): Promise<UserProfile | null> => {
        const res = await apiRequest<UserProfile>(`/users/${encodeURIComponent(username)}`, {
            cache: "no-store",
            auth: true,
            authExcep: false,
        });

        if (!res) return null;

        const avatarUrl = await toAvatarUrl(res.avatarUrl);

        return {
            ...res,
            avatarUrl,
            isMe: res.isMe ?? false,
        };
    },
);

export async function getFavouriteFilms(username: string): Promise<FavoriteFilms> {

    var res = await apiRequest<FavoriteFilms>(`/users/${username}/favourite-films`, {
        cache: { revalidate: 120 },
        auth: true,
        authExcep: false
    })

    res.favouriteFilms = res.favouriteFilms.map((film) => ({
        ...film,
        posterPath: tmdbImage(film.posterPath, "w500") ?? "",
    }));

    return res;
}

export async function getUserFeaturedReview(username: string): Promise<ProfileFeaturedReview | null> {

    var res = await apiRequest<ProfileFeaturedReview>(`/users/${username}/featured-review`, {
        cache: { revalidate: 120 },
        auth: true,
        authExcep: false
    });

    if (!res) {
        return null;
    }

    const avatarUrl = await toAvatarUrl(res.avatarUrl);

    return {
        ...res,
        avatarUrl: avatarUrl,
        posterPath: tmdbImage(res.posterPath, "w780") ?? "",
    };
}

export async function getUserPopularLists(username: string): Promise<PopularListsResponse> {

    var res = await apiRequest<PopularListsResponse>(`/users/${username}/popular-lists`, {
        cache: { revalidate: 120 },
        auth: true,
        authExcep: false
    });

    res.lists = res.lists.map((list) => ({
        ...list,
        films: list.films
            .slice(0, 4)
            .map((film) => ({
                ...film,
                posterPath: tmdbImage(film.posterPath, "w500") ?? "",
            })),
    }));

    return res;
}

export async function getProfileSummary(username: string): Promise<UserProfileSummary> {
    const res = await apiRequest<UserProfileSummary>(`/users/${username}/summary`, {
        cache: { revalidate: 120 },
    });

    return {
        ...res,
        joinedAt: new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
        }).format(new Date(res.joinedAt))
    };
}

export async function getProfileStatistics(username: string): Promise<UserProfileStats> {
    return await apiRequest<UserProfileStats>(`/users/${username}/stats`, {
        cache: { revalidate: 120 },
    });
}

export async function followUser(targetUserId: string): Promise<void> {
    await apiRequest<void>(`/users/${targetUserId}/follow`, {
        method: "POST",
        body: { targetUserId },
        auth: true,
    });
}

export async function getLikedFilms(
    username: string,
    { rating = 0, sortBy = 0, genres, page = 1, pageSize = 20, authed = false }: {
        rating?: number; sortBy?: number; genres?: string[]; page?: number; pageSize?: number; authed?: boolean;
    } = {},
): Promise<FilmsResponse> {
    return apiRequest<FilmsResponse>(`/users/${encodeURIComponent(username)}/liked/films`, {
        query: { rating, sortBy, genres, page, pageSize },
        ...(authed ? { auth: true, cache: "no-store" as const } : { cache: { revalidate: 300 } }),
    }
    )
}

export async function getLikedLists(
    username: string,
    { sortBy = "mostRecent", page = 1, pageSize = 10, authed = false } = {},
): Promise<BrowseListsResponse> {
    return apiRequest<BrowseListsResponse>(`/users/${encodeURIComponent(username)}/liked/lists`, {
        query: { sortBy, page, pageSize },
        ...(authed ? { auth: true, cache: "no-store" as const } : { cache: { revalidate: 300 } }),
    });
}

export async function getLikedReviews(
    username: string,
    { filter = 0, sortBy = 0, page = 1, pageSize = 6, authed = false }: {
        filter?: number; sortBy?: number; page?: number; pageSize?: number; authed?: boolean;
    } = {},
): Promise<ReviewsResponse> {
    const res = await apiRequest<ReviewsResponse>(
        `/users/${encodeURIComponent(username)}/liked/reviews`,
        {
            query: { filter, sortBy, page, pageSize },
            ...(authed ? { auth: true, cache: "no-store" as const } : { cache: { revalidate: 300 } }),
        }
    );


    res.results = await Promise.all(
        res.results.map(async (review) => ({
            ...review,
            filmPosterPath: tmdbImage(review.filmPosterPath, "w500") ?? "",
            avatarUrl: await toAvatarUrl(review.avatarUrl),
        }))
    );

    return res;
}

export const getSettings = cache(async (): Promise<UserSettingsResponse | null> => {
    var res =  await apiRequest<UserSettingsResponse>(`/settings`, {
        cache: "no-store",
        auth: true,
        authExcep: true,
    });

    res.favouriteFilms.favouriteFilms = res.favouriteFilms.favouriteFilms.map((film) => ({
        ...film,
        posterPath: tmdbImage(film.posterPath, "w500") ?? ""
    }))

    return res;
    
});

