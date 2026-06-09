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

export const metadata: Metadata = {
  title: "Films · Lumires",
  description:
    "Every film, rated and reviewed by people who actually care. Browse the Lumires archive by genre, decade, or director.",
};

async function getTrendingFilms(): Promise<FilmCardData[] | undefined> {
  // `optionalData` rethrows transient origin errors (502/503/504) so the route
  // error boundary can offer a retry; an empty/missing result falls back to
  // static demo data.
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

interface FilmsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [trendingFilms, resolvedSearchParams, featured] = await Promise.all([
    getTrendingFilms(),
    searchParams,
    getFeaturedCollections(!!user),
  ]);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection />
      <TrendingSection title="Trending" titleAccent="This Week" films={trendingFilms} />
      <EditorialCollectionsSection />
      <MostReviewedSection />
      <CollectionsSection
        title="Lists Created By"
        titleAccent="Film Lovers"
        collections={featured.length > 0 ? featured : undefined}
        isAuthed={!!user}
      />
      <AllFilmsSection searchParams={resolvedSearchParams} />
    </main>
  );
}
