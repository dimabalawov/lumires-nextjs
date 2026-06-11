// src/lib/auth/client.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import type { MeProfile } from "@/types/api";
import { apiRequest } from "../api/auth.client";

export async function getMeWithAvatarClient(accessToken?: string): Promise<MeProfile | null> {
    const supabase = createClient();

    const token = accessToken ?? (await supabase.auth.getSession()).data.session?.access_token;
    if (!token) return null;

    const profile = await apiRequest<MeProfile>("/auth/me", {
        auth: true, 
        explicitToken: token,
        cache: "no-store",
    });

    if (!profile?.avatarUrl) return profile;

    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatarUrl);
    return { ...profile, avatarUrl: data.publicUrl };
}