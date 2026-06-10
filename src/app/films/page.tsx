import { Suspense } from "react";
import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import EditorialCollectionsSection from "@/components/sections/EditorialCollectionsSection";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import AllFilmsSection from "@/components/sections/AllFilmsSection";
import { getThisWeekMostReviewed } from "@/lib/api/films";
import { getFeaturedCollections } from "@/lib/collections/featured";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import { createClient } from "@/lib/supabase/server";
import type { FilmCardData } from "@/types/film";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

export const metadata: Metadata = {
  title: "Films · Lumires",
  description:
    "Every film, rated and reviewed by people who actually care. Browse the Lumires archive by genre, decade, or director.",
};

async function getTrendingFilms(): Promise<FilmCardData[] | undefined> {
  const response = await optionalData(getThisWeekMostReviewed());
  const items = response?.items;
  if (!items?.length) return undefined;
  return items.map((item) => ({
    id: String(item.filmId),
    title: item.title,
    image: tmdbImage(item.backdropPath, "w780") ?? "",
    quote: item.quote ?? undefined,
    reviewer: item.reviewerName || undefined,
    rating: item.rating ?? undefined,
  }));
}

async function TrendingSectionWrapper() {
  const films = await getTrendingFilms();
  return <TrendingSection title="Trending" titleAccent="This Week" films={films} />;
}

interface FilmsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedSearchParams = await searchParams;

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection />

      <Suspense fallback={<SectionSkeleton />}>
        <TrendingSectionWrapper />
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