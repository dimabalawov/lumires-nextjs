import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import PopularReviewsSection from "@/components/sections/PopularReviewsSection";
import { reviewsHeroCopy, reviewsHeroStats } from "@/data/reviewsHero";
import type { FilmsHeroStat } from "@/data/filmsHero";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import RecentActivitySection from "@/components/sections/RecentActivitySection";
import BrowseAllReviewsSection from "@/components/sections/BrowseAllReviewsSection";
import BrowseByTagSection from "@/components/sections/BrowseByTagSection";
import { getReviewsSummary } from "@/lib/api/reviews";
import { optionalData } from "@/lib/api/client";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Long-form thoughts, short reactions, and the occasional rant — written by people who watch films like it's the best part of their week.",
};

const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
    .format(n)
    .toLowerCase();

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const summary = await optionalData(getReviewsSummary());

  const heroStats: FilmsHeroStat[] = summary
    ? [
        { value: compact(summary.reviewsThisWeek), label: "This Week" },
        { value: compact(summary.reviewsThisDay), label: "Today" },
      ]
    : reviewsHeroStats;

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={reviewsHeroCopy} stats={heroStats} />
      <PopularReviewsSection />
      <MostReviewedSection />
      <RecentActivitySection />
      <BrowseAllReviewsSection searchParams={sp} />
      <BrowseByTagSection />
    </main>
  );
}
