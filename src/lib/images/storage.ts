import { createClient } from "../supabase/client";

export default async function toAvatarUrl(path: string | undefined | null) {
    if (path === undefined || path === null)
        return;

    const supabase = await createClient();
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    return data.publicUrl;
}