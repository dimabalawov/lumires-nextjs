"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { NotificationPreferences, UserSettingsResponse } from "@/types/profile";
import { updateNotificationSettings } from "@/lib/api/users.client";
import { ToggleRow, SaveButton } from "../ui/SettingsControls";

const KEYS = [
    { key: "newFollower", label: "New follower" },
    { key: "likesOnContent", label: "Likes on your reviews" },
    { key: "repliesAndMentions", label: "Replies & mentions" },
    { key: "activityFromFollowed", label: "Activity from people you follow" },
    { key: "savesOnLists", label: "Saves on your lists" },
    { key: "weeklyDigest", label: "Weekly digest" },
] as const;


type NotifKey = (typeof KEYS)[number]["key"];

export default function NotificationsForm({ initial }: { initial: UserSettingsResponse }) {
    const n = initial.notificationPreferences;

    const [state, setState] = useState<NotificationPreferences>({
        newFollower: n?.newFollower ?? true,
        likesOnContent: n?.likesOnContent ?? true,
        repliesAndMentions: n?.repliesAndMentions ?? true,
        activityFromFollowed: n?.activityFromFollowed ?? false,
        savesOnLists: n?.savesOnLists ?? false,
        weeklyDigest: n?.weeklyDigest ?? false,
    });

    const [saving, setSaving] = useState(false);

    function set<K extends keyof NotificationPreferences>(key: K, value: boolean) {
        setState((prev) => ({ ...prev, [key]: value }));
    }


    async function handleSave() {
        if (saving) return;
        setSaving(true);
        try {
            await updateNotificationSettings(state);
            toast.success("Notification settings updated");
        } catch {
            toast.error("Couldn't save changes.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="mt-8">
            {KEYS.map((k) => (
                <ToggleRow
                    key={k.key}
                    label={k.label}
                    checked={state[k.key]}
                    onChange={(v) => set(k.key, v)}
                />
            ))}
            <SaveButton saving={saving} onClick={handleSave} />
        </div>
    );
}