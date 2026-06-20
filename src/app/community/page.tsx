import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import MostActiveMembersSection from "@/components/sections/MostActiveMembersSection";
import MostDiscussedDirectorsSection from "@/components/sections/MostDiscussedDirectorsSection";
import CommunitySection from "@/components/sections/CommunitySection";
import WeeklySection from "@/components/sections/WeeklySection";
import QuoteOfTheWeekSection from "@/components/sections/QuoteOfTheWeekSection";
import { communityHeroCopy, communityHeroStats } from "@/data/communityHero";
import type { FilmsHeroStat } from "@/data/filmsHero";
import { getUsersSummary } from "@/lib/api/users";
import { optionalData } from "@/lib/api/client";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Every obsessive, every contrarian, every person who has ever paused a film just to look something up — the community that watches together and argues together.",
};

const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
    .format(n)
    .toLowerCase();

export default async function CommunityPage() {
  const summary = await optionalData(getUsersSummary());

  const heroStats: FilmsHeroStat[] = summary
    ? [
        { value: compact(summary.totalMembers), label: "Members" },
        { value: compact(summary.onlineNow), label: "Online now" },
      ]
    : communityHeroStats;

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={communityHeroCopy} stats={heroStats} />
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
