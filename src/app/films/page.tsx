import { Suspense } from "react";
import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import TrendingThisWeekSection from "@/components/sections/TrendingThisWeekSection";
import EditorialCollectionsSection from "@/components/sections/EditorialCollectionsSection";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import AllFilmsSection from "@/components/sections/AllFilmsSection";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

export const metadata: Metadata = {
  title: "Films",
  description:
    "Every film, rated and reviewed by people who actually care. Browse the Lumires archive by genre, decade, or director.",
};

interface FilmsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection />

      <Suspense fallback={<SectionSkeleton />}>
        <TrendingThisWeekSection />
      </Suspense>

      <EditorialCollectionsSection />

      <Suspense fallback={<SectionSkeleton />}>
        <MostReviewedSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AllFilmsSection searchParams={resolvedSearchParams} />
      </Suspense>
    </main>
  );
}