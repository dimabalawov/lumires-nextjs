import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import PopularReviewsSection from "@/components/sections/PopularReviewsSection";
import { reviewsHeroCopy, reviewsHeroStats } from "@/data/reviewsHero";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import RecentActivitySection from "@/components/sections/RecentActivitySection";
import BrowseAllReviewsSection from "@/components/sections/BrowseAllReviewsSection";
import BrowseByTagSection from "@/components/sections/BrowseByTagSection";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Long-form thoughts, short reactions, and the occasional rant — written by people who watch films like it's the best part of their week.",
};

export default function ReviewsPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={reviewsHeroCopy} stats={reviewsHeroStats} />
      <PopularReviewsSection />
      <MostReviewedSection />
      <RecentActivitySection />
      <BrowseAllReviewsSection />
      <BrowseByTagSection />
    </main>
  );
}
    
