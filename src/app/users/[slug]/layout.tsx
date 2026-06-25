// app/users/[slug]/layout.tsx
import { ProfileContextProvider } from "@/components/context/ProfileContext";
import ProfileHeroSection from "@/components/sections/ProfileHeroSection";
import { getProfile, getProfileSummary } from "@/lib/api/users";
import { RelationshipType } from "@/types/profile";
import { getBannerTheme } from "@/data/bannerThemes";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

export default async function ProfileLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const profile = await getProfile(slug);
    if (!profile) notFound();

    const summary = await getProfileSummary(slug);

    // Re-theme the whole profile subtree to the owner's chosen banner colour.
    // When no theme is set, --profile-accent stays the default gold and the soft
    // top tint is omitted, so the page looks exactly as before.
    const accentStyle = profile.accentTheme
        ? ({
              "--color-profile-accent": getBannerTheme(profile.accentTheme).accent,
              backgroundImage:
                  "radial-gradient(120% 420px at 50% 0, color-mix(in srgb, var(--color-profile-accent) 9%, transparent) 0%, transparent 100%)",
          } as CSSProperties)
        : undefined;

    return (
        <main className="min-h-screen bg-brand-dark pt-28 lg:pt-32" style={accentStyle}>
            <ProfileHeroSection profile={profile} summary={summary} />
            {profile.outgoingRelationship?.type !== RelationshipType.Block &&
                profile.incomingRelationship?.type !== RelationshipType.Block && (
                    <ProfileContextProvider value={{ profile, summary }}>
                        {children}
                    </ProfileContextProvider>
                )}

        </main>
    );
}
