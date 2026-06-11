import { Suspense } from "react";

import HeroSection from "@/components/sections/HeroSection";
import TrendingThisWeekSection from "@/components/sections/TrendingThisWeekSection";
import WeeklySection from "@/components/sections/WeeklySection";
import CommunityReviewsSection from "@/components/sections/CommunityReviewsSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import CTASection from "@/components/sections/CTASection";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
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
        <Suspense fallback={<SectionSkeleton />}>
          <TrendingThisWeekSection />
        </Suspense>
        <WeeklySection title="This Week In" titleAccent="Cinema" />
        <CollectionsSection
          title="Lists Created By"
          titleAccent="Film Lovers"
          collections={featured.length > 0 ? featured : undefined}
          isAuthed={!!user}
        />
        <Suspense fallback={<SectionSkeleton />}>
          <CommunityReviewsSection
            title="Reviews From The"
            titleAccent="Community"
            uppercaseTitle={false}
          />
        </Suspense>
        <CTASection />
      </div>
    </main>
  );
}
