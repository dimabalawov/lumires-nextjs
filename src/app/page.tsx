import HeroSection from "@/components/sections/HeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import WeeklySection from "@/components/sections/WeeklySection";
import CommunitySection from "@/components/sections/CommunitySection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import CTASection from "@/components/sections/CTASection";
import { getFeaturedCollections } from "@/lib/collections/featured";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const featured = await getFeaturedCollections(!!user);

  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <div className="relative">
        <HeroSection />
        <TrendingSection title="Trending In The" titleAccent="Community" />
        <WeeklySection title="This Week In" titleAccent="Cinema" />
        <CollectionsSection
          title="Lists Created By"
          titleAccent="Film Lovers"
          collections={featured.length > 0 ? featured : undefined}
          isAuthed={!!user}
        />
        <CommunitySection
          title="Reviews From The"
          titleAccent="Community"
          uppercaseTitle={false}
        />
        <CTASection />
      </div>
    </main>
  );
}
