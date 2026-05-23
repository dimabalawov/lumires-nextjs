import type { Metadata } from "next";

import ListsCarouselSection from "@/components/sections/ListsCarouselSection";
import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import { listsHeroCopy, listsHeroStats } from "@/data/listsHere";
import CollectionsSection from "@/components/sections/CollectionsSection";
import BrowseAllListsSection from "@/components/sections/BrowseAllListsSection";


export const metadata: Metadata = {
  title: "Lists · Lumires",
  description:
    "Long-form thoughts, short reactions, and the occasional rant — written by people who watch films like it's the best part of their week.",
};

export default function ListsPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={listsHeroCopy} stats={listsHeroStats} />
      <ListsCarouselSection title="Trending" titleAccent="This Week" />
      <CollectionsSection />
      <BrowseAllListsSection />
    </main>
  );
}