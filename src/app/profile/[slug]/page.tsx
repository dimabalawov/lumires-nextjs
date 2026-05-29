import type { Metadata } from "next";

import ProfileHeroSection from "@/components/sections/ProfileHeroSection";
import { getProfileBySlug } from "@/data/profiles";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  return {
    title: `${profile.username} · Lumires`,
    description: profile.tagline,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark pt-28 lg:pt-32">
      <ProfileHeroSection profile={profile} activeTab="profile" />
    </main>
  );
}
