import type { Metadata } from "next";

import ListsCarouselSection from "@/components/sections/ListsCarouselSection";
import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import { listsHeroCopy, listsHeroStats } from "@/data/listsHere";
import CollectionsSection from "@/components/sections/CollectionsSection";
import BrowseAllListsSection from "@/components/sections/BrowseAllListsSection";
import { getEditorialLists, getListsSummary, getTrendingLists } from "@/lib/api/lists";
import { getFeaturedCollections } from "@/lib/collections/featured";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import { createClient } from "@/lib/supabase/server";
import type { FilmsHeroStat } from "@/data/filmsHero";
import type { CollectionData, ListCardData } from "@/types/film";

export const metadata: Metadata = {
  title: "Lists · Lumires",
  description:
    "Long-form thoughts, short reactions, and the occasional rant — written by people who watch films like it's the best part of their week.",
};

/** Compact count for the hero stat blocks (e.g. 8200 → "8.2k"). */
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

/** Up to `length` unique stills — deduped so the CollectionCard filmstrip never
 * mirrors the same films on its left and right halves. */
function uniqueStills(items: string[], length: number): string[] {
  return [...new Set(items.filter(Boolean))].slice(0, length);
}

interface ListsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ListsPage({ searchParams }: ListsPageProps) {
  const supabase = await createClient();

  // Resolve auth first so the featured collections (and their Like/Save state)
  // can be fetched per-user.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = !!user;

  const [resolvedSearchParams, summary, trending, editorial, featured] = await Promise.all([
    searchParams,
    optionalData(getListsSummary()),
    optionalData(getTrendingLists()),
    optionalData(getEditorialLists()),
    getFeaturedCollections(isAuthed),
  ]);

  // Hero stats from the live summary, falling back to the static demo numbers.
  const heroStats: FilmsHeroStat[] = summary
    ? [
        { value: formatCount(summary.listsTotal), label: "lists" },
        { value: String(summary.listsThisDay), label: "Today" },
      ]
    : listsHeroStats;

  // Trending carousel → ListCardData (posters from poster paths).
  const trendingLists: ListCardData[] =
    trending?.items?.map((item) => ({
      id: item.id,
      title: item.title,
      filmCount: item.filmCount,
      author: item.username,
      posters: item.films
        .map((f) => tmdbImage(f.posterPath, "w342") ?? "")
        .filter(Boolean)
        .slice(0, 4),
    })) ?? [];

  // Editorial picks → CollectionData (backdrop filmstrips, padded to fill the card).
  const editorialCollections: CollectionData[] =
    editorial?.items?.map((item) => ({
      id: item.id,
      title: item.title,
      author: item.username,
      filmCount: item.filmCount,
      films: uniqueStills(
        item.films.map((f) => tmdbImage(f.backdropPath, "w780") ?? ""),
        11,
      ),
    })) ?? [];

  // "Collections Created By Film Lovers" — real user lists (GET /lists, most
  // films) take priority, then editorial picks, then the static demo collections.
  const collections: CollectionData[] =
    featured.length > 0 ? featured : editorialCollections;

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={listsHeroCopy} stats={heroStats} />
      <ListsCarouselSection
        title="Trending"
        titleAccent="This Week"
        lists={trendingLists.length > 0 ? trendingLists : undefined}
      />
      <CollectionsSection
        collections={collections.length > 0 ? collections : undefined}
        isAuthed={isAuthed}
      />
      <BrowseAllListsSection searchParams={resolvedSearchParams} isAuthed={isAuthed} />
    </main>
  );
}
