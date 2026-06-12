
import "server-only";
import { UserProfile, UserProfileSummary } from "@/types/profile";
import { apiRequest } from "./client";
import { createClient } from "../supabase/server";
import toast from "react-hot-toast";

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
        authExcep: false
    });

    if (!res) return null;

    const avatarUrl = await toAvatarUrl(res.avatarUrl);

    return {
        id: res.id,
        username: res.username,
        displayName: res.displayName,
        tagline: res.tagline,
        biography: res.biography,
        location: res.location,
        pronouns: res.pronouns,
        avatarUrl: avatarUrl,
        followers: res.followers,
        followings: res.followings,
        friends: res.friends,
        isMe: res.isMe ?? false,
        incomingRelationship: res.incomingRelationship,
        outgoingRelationship: res.outgoingRelationship
    };
}

export async function getProfileSummary(username: string): Promise<UserProfileSummary> {
    const res = await apiRequest<UserProfileSummary>(`/users/${username}/summary`, {
        cache: { revalidate: 120 },
    });

    return {
        totalFilmsRated: res.totalFilmsRated,
        listsCreated: res.listsCreated,
        reviewsWritten: res.reviewsWritten,
        joinedAt: new Date(res.joinedAt).toISOString().split("T")[0]
    };
}

export async function followUser(targetUserId: string): Promise<void> {
    await apiRequest<void>(`/users/${targetUserId}/follow`, {
        method: "POST",
        body: { targetUserId },
        auth: true,
    });
}
