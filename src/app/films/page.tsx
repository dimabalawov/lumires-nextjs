import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import EditorialCollectionsSection from "@/components/sections/EditorialCollectionsSection";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import AllFilmsSection from "@/components/sections/AllFilmsSection";
import { getThisWeekMostReviewed } from "@/lib/api/films";
import { tmdbImage } from "@/lib/images/tmdb";
import type { FilmCardData } from "@/types/film";

export const metadata: Metadata = {
  title: "Films · Lumires",
  description:
    "Every film, rated and reviewed by people who actually care. Browse the Lumires archive by genre, decade, or director.",
};

async function getTrendingFilms(): Promise<FilmCardData[] | undefined> {
  try {
    const { items } = await getThisWeekMostReviewed();
    if (!items?.length) return undefined; // fall back to static demo data
    return items.map((item) => ({
      id: String(item.filmId),
      title: item.title,
      image: tmdbImage(item.backdropPath, "w780") ?? "",
      quote: item.quote ?? undefined,
      reviewer: item.reviewerName || undefined,
      rating: item.rating ?? undefined,
    }));
  } catch {
    return undefined;
  }
}

interface FilmsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const [trendingFilms, resolvedSearchParams] = await Promise.all([
    getTrendingFilms(),
    searchParams,
  ]);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection />
      <TrendingSection title="Trending" titleAccent="This Week" films={trendingFilms} />
      <EditorialCollectionsSection />
      <MostReviewedSection />
      <CollectionsSection title="Lists Created By" titleAccent="Film Lovers" />
      <AllFilmsSection searchParams={resolvedSearchParams} />
    </main>
  );
}
