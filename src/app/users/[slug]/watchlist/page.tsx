import { Suspense } from "react";
import { AccentTitle } from "@/components/ui/AccentTitle";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import WatchlistSection from "@/components/sections/WatchlistSection";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WatchlistPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle className="mb-10" text="Browse" accent="Watchlist" />

        <Suspense key={JSON.stringify(sp)} fallback={<SectionSkeleton />}>
          <WatchlistSection username={slug} searchParams={sp} />
        </Suspense>
      </div>
    </section>
  );
}