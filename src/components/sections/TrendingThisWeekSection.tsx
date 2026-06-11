import TrendingSection from "@/components/sections/TrendingSection";
import { getThisWeekMostReviewed } from "@/lib/api/films";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import type { FilmCardData } from "@/types/film";

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

/** Live "Trending This Week" carousel, backed by GET /films/most-reviewed/weekly. */
export default async function TrendingThisWeekSection() {
  const films = await getTrendingFilms();
  return <TrendingSection title="Trending" titleAccent="This Week" films={films} />;
}
