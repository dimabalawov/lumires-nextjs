import { Suspense } from "react";
import { AccentTitle } from "@/components/ui/AccentTitle";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import LikedFilmsSection from "@/components/sections/LikedFilmsSection";
import LikedListsSection from "@/components/sections/LikedListSection";
import LikedReviewsSection from "@/components/sections/LikedReviewsSection";
import LikesCategoryTabs from "@/components/sections/LikesCategoryTabs";

const TABS = ["films", "lists", "reviews"] as const;
type LikesTab = (typeof TABS)[number];

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LikesPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const rawTab = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab: LikesTab = TABS.includes(rawTab as LikesTab) ? (rawTab as LikesTab) : "films";

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle text="Browse" accent="All Likes" />

        <LikesCategoryTabs active={tab} />

        <Suspense key={`${tab}:${JSON.stringify(sp)}`} fallback={<SectionSkeleton />}>
          {tab === "films" && <LikedFilmsSection username={slug} searchParams={sp} />}
          {tab === "lists" && <LikedListsSection username={slug} searchParams={sp} />}
          {tab === "reviews" && <LikedReviewsSection username={slug} searchParams={sp} />}
        </Suspense>
      </div>
    </section>
  );
}