import { Suspense } from "react";
import { AccentTitle } from "@/components/ui/AccentTitle";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import ThreadsSection from "@/components/sections/ThreadsSection";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ThreadsPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle className="mb-10" text="Browse" accent="Threads" />

        <Suspense key={JSON.stringify(sp)} fallback={<SectionSkeleton />}>
          <ThreadsSection username={slug} searchParams={sp} />
        </Suspense>
      </div>
    </section>
  );
}