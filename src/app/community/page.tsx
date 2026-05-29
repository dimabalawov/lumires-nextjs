import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import MostActiveMembersSection from "@/components/sections/MostActiveMembersSection";
import MostDiscussedDirectorsSection from "@/components/sections/MostDiscussedDirectorsSection";
import CommunitySection from "@/components/sections/CommunitySection";
import WeeklySection from "@/components/sections/WeeklySection";
import QuoteOfTheWeekSection from "@/components/sections/QuoteOfTheWeekSection";
import { communityHeroCopy, communityHeroStats } from "@/data/communityHero";

export const metadata: Metadata = {
  title: "Community · Lumires",
  description:
    "Every obsessive, every contrarian, every person who has ever paused a film just to look something up — the community that watches together and argues together.",
};

export default function CommunityPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={communityHeroCopy} stats={communityHeroStats} />
      <MostActiveMembersSection />
      <MostDiscussedDirectorsSection />
      <CommunitySection
        title="Conversations"
        titleAccent="Worth Following"
        uppercaseTitle={false}
      />
      <WeeklySection title="Trending In Community" titleAccent="This Week" />
      <QuoteOfTheWeekSection />
    </main>
  );
}
