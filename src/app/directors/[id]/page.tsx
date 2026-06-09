import { notFound } from "next/navigation";
import type { Metadata } from "next";

import DirectorBiographySection from "@/components/sections/DirectorBiographySection";
import DirectorFilmographySection from "@/components/sections/DirectorFilmographySection";
import DirectorHeroSection from "@/components/sections/DirectorHeroSection";
import DirectorMostDiscussedSection from "@/components/sections/DirectorMostDiscussedSection";
import DirectorSimilarSection from "@/components/sections/DirectorSimilarSection";
import { getDirectorEditorial, getDirectorStats } from "@/data/directors";
import { getDirector } from "@/lib/api/directors";
import { tmdbImage } from "@/lib/images/tmdb";
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
  if (!api) return { title: "Director not found - Lumires" };
  return {
    title: `${api.name} - Lumires`,
    description: firstParagraph(api.biography),
  };
}

export default async function DirectorPage({ params }: DirectorPageProps) {
  const { id } = await params;
  const api = await getDirector(id);
  if (!api) notFound();

  const director: DirectorProfile = {
    id: api.directorId,
    slug: String(api.directorId),
    name: api.name,
    imageUrl: tmdbImage(api.profilePath, "w500"),
    birthYear: yearFromDate(api.birthday),
    deathYear: yearFromDate(api.deathday),
    birthplace: api.placeOfBirth,
    bio: firstParagraph(api.biography),
    stats: getDirectorStats(api.directorId),
  };

  const editorial = getDirectorEditorial(api.directorId);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark pt-28 lg:pt-32">
      <DirectorHeroSection director={director} />
      <DirectorBiographySection
        name={director.name}
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
      {editorial.similarDirectors && (
        <DirectorSimilarSection directors={editorial.similarDirectors} />
      )}
    </main>
  );
}
