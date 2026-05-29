import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import HotTakesCarouselSection from "@/components/sections/HotTakesCarouselSection";
import EditorialPickSection from "@/components/sections/EditorialPickSection";
import { threadsHeroCopy, threadsHeroStats } from "@/data/threadsHero";

export const metadata: Metadata = {
  title: "Threads · Lumires",
  description:
    "Hot takes, deep dives, and everything in between. Talk films with people who actually mean it.",
};

export default function ThreadsPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={threadsHeroCopy} stats={threadsHeroStats} />
      <HotTakesCarouselSection title="Hot Takes" titleAccent="This Week" />
      <EditorialPickSection />
    </main>
  );
}
