"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { UserSettingsResponse } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";
import { updateProfileSettings } from "@/lib/api/users.client";
import { Field } from "../ui/SettingsControls";

const inputClass =
    "w-full rounded-md border border-brand-gold/20 bg-[#171411] px-4 py-2.5 font-manrope text-[15px] text-brand-light placeholder:text-brand-muted/50 focus:border-brand-gold/50 focus:outline-none transition-colors";

export default function IdentityForm({ initial }: { initial: UserSettingsResponse }) {
    const [avatarPath, setAvatarPath] = useState(initial.profileSettings.avatarUrl);
    const [displayName, setDisplayName] = useState(initial.profileSettings.displayName ?? "");
    const [username, setUsername] = useState(initial.profileSettings.username ?? "");
    const [tagline, setTagline] = useState(initial.profileSettings.tagline ?? "");
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    // Convert relative path to public URL for preview
    const supabase = createClient();
    const publicUrl = avatarPath
        ? supabase.storage.from("avatars").getPublicUrl(avatarPath).data.publicUrl
        : null;

    const previewUrl = fileToUpload ? URL.createObjectURL(fileToUpload) : publicUrl;

    function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileToUpload(file);
        e.target.value = "";
    }

    useEffect(() => {
        return () => {
            if (fileToUpload && previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [fileToUpload]);

    async function uploadAvatar(file: File): Promise<string> {
        const sanitizedName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, "");

        const filePath = `${Date.now()}-${sanitizedName}`;

        const { error } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
                upsert: true,
                contentType: file.type,
            });

        if (error) throw error;

        return filePath;
    }

    async function handleSave() {
        if (saving) return;
        setSaving(true);

        try {
            let uploadedPath = avatarPath;

            if (fileToUpload) {
                uploadedPath = await uploadAvatar(fileToUpload);
                setAvatarPath(uploadedPath);
            }

            await updateProfileSettings({
                avatarUrl: uploadedPath,
                displayName,
                username,
                tagline,
            });

            toast.success("Profile updated");

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (e: any) {
            if (e?.status === 409) toast.error("That username is taken.");
            else if (e?.status === 401 || e?.status === 403) toast.error("Please sign in again.");
            else toast.error("Couldn't save changes.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="mt-8">
            <Field label="Profile photo" hint="A square image works best. PNG or JPG.">
                <div className="flex items-center justify-end gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-gold/40">
                        {previewUrl ? (
                            <Image src={previewUrl} alt="" fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-brand-gold text-xl font-medium text-black">
                                {username[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-md border bg-brand-gold/10 border-brand-gold px-4 py-2 font-manrope text-[12px] tracking-[0.14em] text-brand-gold transition-colors hover:border-brand-gold/60"
                    >
                        Upload new
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setAvatarPath(null);
                            setFileToUpload(null);
                        }}
                        className="font-manrope font-medium text-[12px] tracking-[0.14em] text-brand-danger transition-colors hover:text-brand-danger/80"
                    >
                        Remove
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={onAvatarChange}
                        className="hidden"
                    />
                </div>
            </Field>

            <Field label="Display name">
                <input
                    className={inputClass}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                />
            </Field>

            <Field label="Username" hint="Your unique @handle and profile URL.">
                <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
                        @
                    </span>
                    <input
                        className={`${inputClass} pl-8`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                        placeholder="username"
                    />
                </div>
            </Field>

            <Field label="Tagline" hint="One line shown under your name.">
                <input
                    className={inputClass}
                    value={tagline}
                    maxLength={120}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Watching films and collecting quiet moments."
                />
            </Field>

            <div className="mt-8 flex items-center gap-4 border-t border-brand-gold/8 pt-6">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl cursor-pointer bg-brand-gold px-6 py-2.5 font-manrope text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-dark transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </div>
        </div>
    );
}
