"use client";

import { AccountSettings, FavouriteFilmCommand, FriendsResponse, NotificationPreferences, PrivacySettings, ProfileSettings } from "@/types/profile";
import { apiRequest } from "./auth.client";
import { createClient } from "../supabase/client";
import toAvatarUrl from "../images/storage";


export async function updateProfileSettings(profileSettings: ProfileSettings) {
    return apiRequest<void>('/settings/profile', {
        method: "PUT",
        cache: "no-store",
        body: profileSettings,
        auth: true,
        authExcep: true,
    })
}

export async function updatePrivacySettings(privacySettings: PrivacySettings) {
    return apiRequest<void>('/settings/privacy', {
        method: "PUT",
        cache: "no-store",
        body: privacySettings,
        auth: true,
        authExcep: true,
    })
}

export async function updateAccountSettings(accountSettings: AccountSettings) {
    return apiRequest<void>('/settings/account', {
        method: "PUT",
        cache: "no-store",
        body: accountSettings,
        auth: true,
        authExcep: true,
    })
}

export async function updateAccentTheme(accentTheme: string | null) {
    return apiRequest<void>('/settings/accent', {
        method: "PUT",
        cache: "no-store",
        body: { accentTheme },
        auth: true,
        authExcep: true,
    })
}

export async function updateNotificationSettings(notificationSettings: NotificationPreferences) {
    return apiRequest<void>('/settings/notifications', {
        method: "PUT",
        cache: "no-store",
        body: notificationSettings,
        auth: true,
        authExcep: true,
    })
}

export async function deleteAccount() {
    await apiRequest<void>("/settings/delete-account", {
        method: "DELETE",
        auth: true,
        authExcep: true,
        cache: "no-store",
    });
    await createClient().auth.signOut();
}

export async function updateFavouriteFilms(
    payload: { favouriteFilms: FavouriteFilmCommand[] }
): Promise<void> {
    return apiRequest<void>("/settings/favourite-films", {
        method: "PUT",
        body: payload,
        auth: true,
    });
}

export async function getFriends(username: string): Promise<FriendsResponse> {
    var res = await apiRequest<FriendsResponse>(`/users/${username}/friends`, {
        auth: true,
        authExcep: false,
        cache: 'no-store'
    });

    res.friends = await Promise.all(
        res.friends.map(async (friend) => ({
            ...friend,
            avatarUrl: (await toAvatarUrl(friend.avatarUrl)) ?? "",
        }))
    );

    return res;
}
