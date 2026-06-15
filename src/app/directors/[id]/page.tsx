import { notFound } from "next/navigation";
import type { Metadata } from "next";

import DirectorBiographySection from "@/components/sections/DirectorBiographySection";
import DirectorFilmographySection from "@/components/sections/DirectorFilmographySection";
import DirectorHeroSection from "@/components/sections/DirectorHeroSection";
import DirectorMostDiscussedSection from "@/components/sections/DirectorMostDiscussedSection";
import DirectorSimilarSection from "@/components/sections/DirectorSimilarSection";
import {
  getDirectorEditorial,
  getDirectorStats as getDirectorStatsFallback,
} from "@/data/directors";
import { optionalData } from "@/lib/api/client";
import {
  getDirector,
  getDirectorFilmography,
  getDirectorMostReviewed,
  getDirectorSimilar,
  getDirectorStats,
} from "@/lib/api/directors";
import { tmdbImage } from "@/lib/images/tmdb";
import {
  buildMostDiscussed,
  toFilmographyData,
  toProfileStats,
  toSimilarCards,
} from "@/lib/people/profile-sections";
import { createClient } from "@/lib/supabase/server";
import type { DirectorProfile } from "@/types/film";

interface DirectorPageProps {
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

export async function generateMetadata({ params }: DirectorPageProps): Promise<Metadata> {
  const { id } = await params;
  const api = await getDirector(id);
  if (!api) return { title: "Director not found" };
  return {
    title: api.name,
    description: firstParagraph(api.biography),
  };
}

export default async function DirectorPage({ params }: DirectorPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = Boolean(user);

  const [api, filmographyApi, mostReviewedApi, statsApi, similarApi] = await Promise.all([
    getDirector(id),
    getDirectorFilmography(id),
    getDirectorMostReviewed(id),
    optionalData(getDirectorStats(id)),
    getDirectorSimilar(id),
  ]);
  if (!api) notFound();

  const filmography = toFilmographyData(filmographyApi);
  const similarDirectors = toSimilarCards(
    similarApi.map((p) => ({ apiId: p.directorId, profilePath: p.profilePath, name: p.name })),
  );
  const stats = statsApi ? toProfileStats(statsApi) : getDirectorStatsFallback(api.directorId);
  const mostDiscussed = await buildMostDiscussed(mostReviewedApi, isAuthed);

  const director: DirectorProfile = {
    id: api.directorId,
    slug: String(api.directorId),
    name: api.name,
    imageUrl: tmdbImage(api.profilePath, "w500") ?? null,
    birthYear: yearFromDate(api.birthday),
    deathYear: yearFromDate(api.deathday),
    birthplace: api.placeOfBirth,
    bio: firstParagraph(api.biography),
    stats,
  };

  const editorial = getDirectorEditorial(api.directorId);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark pt-28 lg:pt-32">
      <DirectorHeroSection director={director} />
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
      {similarDirectors.length > 0 ? (
        <DirectorSimilarSection directors={similarDirectors} />
      ) : editorial.similarDirectors ? (
        <DirectorSimilarSection directors={editorial.similarDirectors} />
      ) : null}

      {api.biography && api.biography.length > 0 && (
        <DirectorBiographySection
          name={director.name}
          bio={api.biography}
          pullQuote={editorial.pullQuote}
          topGenres={editorial.topGenres}
        />
      )}

    </main>
  );
}
