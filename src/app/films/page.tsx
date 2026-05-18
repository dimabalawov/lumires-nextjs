import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import EditorialCollectionsSection from "@/components/sections/EditorialCollectionsSection";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import AllFilmsSection from "@/components/sections/AllFilmsSection";

export const metadata: Metadata = {
  title: "Films · Lumires",
  description:
    "Every film, rated and reviewed by people who actually care. Browse the Lumires archive by genre, decade, or director.",
};

export default function FilmsPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <Header />
      <FilmsHeroSection />
      <TrendingSection title="Trending" titleAccent="This Week" />
      <EditorialCollectionsSection />
      <MostReviewedSection />
      <CollectionsSection title="Lists Created By" titleAccent="Film Lovers" />
      <AllFilmsSection />
    </main>
  );
}
