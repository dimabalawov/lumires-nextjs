import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FilmHero, { type FilmHeroData } from "@/components/sections/FilmHero";
import { getMovie } from "@/lib/api/movies";
import { tmdbImage } from "@/lib/images/tmdb";
import { filmExtras, genreShortName } from "@/data/filmExtras";

interface FilmPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return { title: "Film not found · Lumires" };

  return {
    title: `${movie.localization.title} · Lumires`,
    description: movie.localization.overview,
  };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) notFound();

  const extras = filmExtras[movie.id] ?? {};
  const backdrop = tmdbImage(movie.backdropPath, "original");
  const genres = movie.genres.items.map((g) => genreShortName[g.name] ?? g.name);

  const data: FilmHeroData = {
    title: movie.localization.title,
    posterUrl: tmdbImage(movie.posterPath, "w500"),
    year: movie.releaseDate?.slice(0, 4),
    primaryGenre: genres[0],
    runtime: extras.runtime,
    rating: extras.rating,
    tagline: extras.tagline,
    overview: movie.localization.overview,
    cast: extras.cast ?? [],
    genres,
    director: extras.director,
    studio: extras.studio,
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="absolute top-0 left-0 right-0 -z-10 bg-brand-dark overflow-hidden h-[760px] lg:h-[820px]">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center blur-[2px] scale-[1.02]"
          />
        )}
        <div className="absolute inset-0 bg-brand-dark/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/40 to-brand-dark" />
      </div>

      <Header />

      <section className="section-container pt-28 lg:pt-32 pb-24 relative">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Films", href: "/films" },
            { label: movie.localization.title },
          ]}
        />
        <FilmHero data={data} />
      </section>

      <Footer />
    </main>
  );
}
