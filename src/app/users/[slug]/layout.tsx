// app/users/[slug]/layout.tsx
import { ProfileContextProvider } from "@/components/context/ProfileContext";
import ProfileHeroSection from "@/components/sections/ProfileHeroSection";
import { getProfile, getProfileSummary } from "@/lib/api/users";
import { RelationshipType } from "@/types/profile";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

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

    return (
        <main className="min-h-screen bg-brand-dark pt-28 lg:pt-32">
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
