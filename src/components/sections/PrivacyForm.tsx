"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ProfileVisibility, type UserSettingsResponse } from "@/types/profile";
import { Field, RadioCard, Toggle, SaveButton } from "../ui/SettingsControls";
import { updatePrivacySettings } from "@/lib/api/users.client";

const VISIBILITY = [
    { value: ProfileVisibility.Everyone, title: "Everyone", description: "Your profile is public and can appear in search." },
    { value: ProfileVisibility.Followers, title: "Followers only", description: "Only people who follow you can see your activity." },
    { value: ProfileVisibility.OnlyMe, title: "Only me", description: "Your profile is hidden for everyone else." },
];


const FOLLOW = [
    { value: 0, title: "Anyone", description: "Anyone can follow you instantly." },
    { value: 1, title: "Approved followers", description: "You approve each follow request." },
];

export default function PrivacyForm({ initial }: { initial: UserSettingsResponse }) {
    const p = initial.privacySettings;

    const [visibility, setVisibility] = useState<ProfileVisibility>(
        p.profileVisibility ?? ProfileVisibility.Everyone
    );
    const [isAnyoneCanFollow, setIsAnyoneCanFollow] = useState<boolean>(p.isAnyoneCanFollow ?? true);
    const [isWatchlistPublic, setIsWatchlistPublic] = useState(p.isWatchlistPublic ?? true);
    const [areLikesPublic, setAreLikesPublic] = useState(p.areLikesPublic ?? true);
    const [areRatingsShowInFeeds, setAreRatingsShowInFeeds] = useState(p.areRatingsShowInFeeds ?? false);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (saving) return;
        setSaving(true);
        try {
            await updatePrivacySettings({
                profileVisibility: visibility,
                isAnyoneCanFollow,
                isWatchlistPublic,
                areLikesPublic,
                areRatingsShowInFeeds,
            });
            toast.success("Privacy updated");
        } catch {
            toast.error("Couldn't save changes.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="mt-8">
            <Field label="Profile visibility">
                <div className="flex flex-col gap-3">
                    {VISIBILITY.map((o) => (
                        <RadioCard
                            key={o.value}
                            selected={visibility === o.value}
                            title={o.title}
                            description={o.description}
                            onSelect={() => setVisibility(o.value)}
                        />
                    ))}
                </div>
            </Field>

            <Field label="Who can follow you">
                <div className="flex flex-col gap-3">
                    {FOLLOW.map((o) => (
                        <RadioCard
                            key={o.value}
                            selected={isAnyoneCanFollow === (o.value === 0)}
                            title={o.title}
                            description={o.description}
                            onSelect={() => setIsAnyoneCanFollow(o.value === 0)}
                        />
                    ))}
                </div>
            </Field>

            <Field label="Show watchlist publicly">
                <div className="flex lg:justify-end">
                    <Toggle checked={isWatchlistPublic} onChange={setIsWatchlistPublic} label="Show watchlist publicly" />
                </div>
            </Field>

            <Field label="Show liked films">
                <div className="flex lg:justify-end">
                    <Toggle checked={areLikesPublic} onChange={setAreLikesPublic} label="Show liked films" />
                </div>
            </Field>

            <Field label="Show ratings in friends' feeds">
                <div className="flex lg:justify-end">
                    <Toggle checked={areRatingsShowInFeeds} onChange={setAreRatingsShowInFeeds} label="Show ratings in friends' feeds" />
                </div>
            </Field>

            <SaveButton saving={saving} onClick={handleSave} />
        </div>
    );
}
