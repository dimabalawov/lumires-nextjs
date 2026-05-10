import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMovie } from "@/lib/api/movies";
import { tmdbImage } from "@/lib/images/tmdb";

interface FilmPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: FilmPageProps): Promise<Metadata> {
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

  const backdrop = tmdbImage(movie.backdropPath, "original");
  const poster = tmdbImage(movie.posterPath, "w500");
  const year = movie.releaseDate?.slice(0, 4);
  const trailerSrc = movie.trailerUrl
    ? `https://www.youtube.com/embed/${movie.trailerUrl}`
    : null;

  return (
    <main className="flex min-h-screen flex-col bg-brand-dark">
      <Header />

      {/* Backdrop hero */}
      <section className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
        {backdrop && (
          <Image
            src={backdrop}
            alt={movie.localization.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/30 to-transparent" />
      </section>

      {/* Main content */}
      <section className="section-container relative -mt-48 z-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">
          {/* Poster */}
          <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden border border-white/10 shadow-2xl">
            {poster ? (
              <Image
                src={poster}
                alt={movie.localization.title}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 260px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-dark/60" />
            )}
          </div>

          {/* Title block */}
          <div className="flex flex-col gap-6 pt-2 md:pt-8">
            <div>
              <h1 className="uppercase font-oswald font-normal text-brand-gold tracking-[0.06em] leading-[1.05] text-4xl md:text-5xl lg:text-6xl">
                {movie.localization.title}
              </h1>
              {year && (
                <p className="mt-3 font-manrope text-brand-muted text-sm tracking-[0.12em] uppercase">
                  {year}
                </p>
              )}
            </div>

            {movie.genres.items.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {movie.genres.items.map((g) => (
                  <li
                    key={g.id}
                    className="px-3 py-1 border border-brand-gold/40 text-brand-gold font-manrope text-xs uppercase tracking-[0.08em] rounded-full"
                  >
                    {g.name}
                  </li>
                ))}
              </ul>
            )}

            {movie.localization.overview && (
              <p className="font-manrope text-brand-light/90 text-base md:text-lg leading-relaxed max-w-2xl">
                {movie.localization.overview}
              </p>
            )}
          </div>
        </div>

        {/* Trailer */}
        {trailerSrc && (
          <div className="mt-16">
            <h2 className="uppercase font-oswald text-brand-light tracking-[0.06em] text-2xl mb-4">
              Trailer
            </h2>
            <div className="relative w-full aspect-video max-w-4xl rounded-md overflow-hidden border border-white/10">
              <iframe
                src={trailerSrc}
                title={`${movie.localization.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
