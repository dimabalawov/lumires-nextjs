import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ActorSimilarSection from "@/components/sections/ActorSimilarSection";
import DirectorBiographySection from "@/components/sections/DirectorBiographySection";
import DirectorFilmographySection from "@/components/sections/DirectorFilmographySection";
import DirectorHeroSection from "@/components/sections/DirectorHeroSection";
import DirectorMostDiscussedSection from "@/components/sections/DirectorMostDiscussedSection";
import {
  getActorEditorial,
  getActorStats as getActorStatsFallback,
} from "@/data/actors";
import { optionalData } from "@/lib/api/client";
import {
  getActor,
  getActorFilmography,
  getActorMostReviewed,
  getActorSimilar,
  getActorStats,
} from "@/lib/api/actors";
import { tmdbImage } from "@/lib/images/tmdb";
import {
  buildMostDiscussed,
  toFilmographyData,
  toProfileStats,
  toSimilarCards,
} from "@/lib/people/profile-sections";
import { createClient } from "@/lib/supabase/server";
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
  if (!api) return { title: "Actor not found" };
  return {
    title: api.name,
    description: firstParagraph(api.biography),
  };
}

export default async function ActorPage({ params }: ActorPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = Boolean(user);

  const [api, filmographyApi, mostReviewedApi, statsApi, similarApi] = await Promise.all([
    getActor(id),
    getActorFilmography(id),
    getActorMostReviewed(id),
    optionalData(getActorStats(id)),
    getActorSimilar(id),
  ]);
  if (!api) notFound();

  // The profile id comes from the route param so we don't depend on whether the
  // backend keys the payload as `actorId` or `directorId`.
  const actorId = api.actorId ?? api.directorId ?? Number(id);

  const filmography = toFilmographyData(filmographyApi);
  const similarActors = toSimilarCards(
    similarApi.map((p) => ({ apiId: p.actorId, profilePath: p.profilePath, name: p.name })),
  );
  const stats = statsApi ? toProfileStats(statsApi) : getActorStatsFallback(actorId);
  const mostDiscussed = await buildMostDiscussed(mostReviewedApi, isAuthed);

  const actor: DirectorProfile = {
    id: actorId,
    slug: String(actorId),
    name: api.name,
    imageUrl: tmdbImage(api.profilePath, "w500") ?? null,
    birthYear: yearFromDate(api.birthday),
    deathYear: yearFromDate(api.deathday),
    birthplace: api.placeOfBirth,
    bio: firstParagraph(api.biography),
    stats,
  };

  const editorial = getActorEditorial(actorId);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark pt-28 lg:pt-32">
      <DirectorHeroSection director={actor} />
      {mostDiscussed ? (
        <DirectorMostDiscussedSection thread={mostDiscussed} isAuthed={isAuthed} />
      ) : editorial.mostDiscussed ? (
        <DirectorMostDiscussedSection thread={editorial.mostDiscussed} />
      ) : null}
      {filmography.films.length > 0 ? (
        <DirectorFilmographySection
          films={filmography.films}
          previewIds={filmography.previewIds}
        />
      ) : editorial.filmography ? (
        <DirectorFilmographySection films={editorial.filmography} />
      ) : null}
      {similarActors.length > 0 ? (
        <ActorSimilarSection actors={similarActors} />
      ) : editorial.similarActors ? (
        <ActorSimilarSection actors={editorial.similarActors} />
      ) : null}

      {api.biography && api.biography.length > 0 && (
        <DirectorBiographySection
          name={actor.name}
          bio={api.biography}
          pullQuote={editorial.pullQuote}
          topGenres={editorial.topGenres}
        />
      )}

    </main>
  );
}
