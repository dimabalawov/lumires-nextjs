import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import EditorialCollectionsSection from "@/components/sections/EditorialCollectionsSection";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import AllFilmsSection from "@/components/sections/AllFilmsSection";
import { getThisWeekPopular } from "@/lib/api/films";
import { tmdbImage } from "@/lib/images/tmdb";
import type { FilmCardData } from "@/types/film";

export const metadata: Metadata = {
  title: "Films · Lumires",
  description:
    "Every film, rated and reviewed by people who actually care. Browse the Lumires archive by genre, decade, or director.",
};

async function getTrendingFilms(): Promise<FilmCardData[] | undefined> {
  try {
    const { items } = await getThisWeekPopular();
    if (!items?.length) return undefined; // fall back to static demo data
    return items.map((item) => ({
      id: String(item.externalId),
      title: item.title,
      image: tmdbImage(item.backdropPath, "w780") ?? "",
      year: item.releaseYear ? String(item.releaseYear) : undefined,
    }));
  } catch {
    return undefined;
  }
}

export default async function FilmsPage() {
  const trendingFilms = await getTrendingFilms();

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection />
      <TrendingSection title="Trending" titleAccent="This Week" films={trendingFilms} />
      <EditorialCollectionsSection />
      <MostReviewedSection />
      <CollectionsSection title="Lists Created By" titleAccent="Film Lovers" />
      <AllFilmsSection />
    </main>
  );
}
