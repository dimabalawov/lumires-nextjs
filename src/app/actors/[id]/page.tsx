import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ActorSimilarSection from "@/components/sections/ActorSimilarSection";
import DirectorBiographySection from "@/components/sections/DirectorBiographySection";
import DirectorFilmographySection from "@/components/sections/DirectorFilmographySection";
import DirectorHeroSection from "@/components/sections/DirectorHeroSection";
import DirectorMostDiscussedSection from "@/components/sections/DirectorMostDiscussedSection";
import { getActorEditorial, getActorStats } from "@/data/actors";
import { getActor } from "@/lib/api/actors";
import { tmdbImage } from "@/lib/images/tmdb";
import type { DirectorProfile } from "@/types/film";

interface ActorPageProps {
  params: Promise<{ id: string }>;
}

function yearFromDate(date: string | null): number | null {
  if (!date) return null;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function firstParagraph(text: string): string {
  return text.split(/\n\s*\n/)[0].trim();
}

export async function generateMetadata({ params }: ActorPageProps): Promise<Metadata> {
  const { id } = await params;
  const api = await getActor(id);
  if (!api) return { title: "Actor not found - Lumires" };
  return {
    title: `${api.name} - Lumires`,
    description: firstParagraph(api.biography),
  };
}

export default async function ActorPage({ params }: ActorPageProps) {
  const { id } = await params;
  const api = await getActor(id);
  if (!api) notFound();

  // The profile id comes from the route param so we don't depend on whether the
  // backend keys the payload as `actorId` or `directorId`.
  const actorId = api.actorId ?? api.directorId ?? Number(id);

  const actor: DirectorProfile = {
    id: actorId,
    slug: String(actorId),
    name: api.name,
    imageUrl: tmdbImage(api.profilePath, "w500"),
    birthYear: yearFromDate(api.birthday),
    deathYear: yearFromDate(api.deathday),
    birthplace: api.placeOfBirth,
    bio: firstParagraph(api.biography),
    stats: getActorStats(actorId),
  };

  const editorial = getActorEditorial(actorId);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark pt-28 lg:pt-32">
      <DirectorHeroSection director={actor} />
      <DirectorBiographySection
        name={actor.name}
        bio={api.biography}
        pullQuote={editorial.pullQuote}
        topGenres={editorial.topGenres}
      />
      {editorial.filmography && (
        <DirectorFilmographySection films={editorial.filmography} />
      )}
      {editorial.mostDiscussed && (
        <DirectorMostDiscussedSection thread={editorial.mostDiscussed} />
      )}
      {editorial.similarActors && (
        <ActorSimilarSection actors={editorial.similarActors} />
      )}
    </main>
  );
}
