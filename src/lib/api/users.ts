
import "server-only";
import { PopularList, PopularListsResponse, ProfileFeaturedReview, UserProfile, UserProfileSummary } from "@/types/profile";
import { apiRequest } from "./client";
import { createClient } from "../supabase/server";
import { FavoriteFilms } from "@/types/film";
import { tmdbImage } from "../images/tmdb";

async function toAvatarUrl(path: string | undefined) {
    if (path === undefined || path === null)
        return;

    const supabase = await createClient();
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    return data.publicUrl;
}

export async function getProfile(username: string): Promise<UserProfile | null> {
    const res = await apiRequest<UserProfile>(`/users/${username}`, {
        cache: { revalidate: 120 },
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
}

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

export async function getUserFeaturedReview(username: string): Promise<ProfileFeaturedReview> {

    var res = await apiRequest<ProfileFeaturedReview>(`/users/${username}/featured-review`, {
        cache: { revalidate: 120 },
        auth: true,
        authExcep: false
    });

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

export async function followUser(targetUserId: string): Promise<void> {
    await apiRequest<void>(`/users/${targetUserId}/follow`, {
        method: "POST",
        body: { targetUserId },
        auth: true,
    });
}
