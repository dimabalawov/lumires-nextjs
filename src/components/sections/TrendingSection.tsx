"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useEmblaSelectedIndex } from "@/hooks/useEmblaSelectedIndex";
import FilmCard from "@/components/ui/FilmCard";
import MobileFilmCard from "@/components/ui/MobileFilmCard";
import { films as defaultFilms } from "@/data/films";
import type { FilmCardData } from "@/types/film";
import { CENTER_W, CENTER_H, GAP } from "@/constants/carousel";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

interface TrendingSectionProps {
  title?: string;
  titleAccent?: string;
  films?: FilmCardData[];
}

export default function TrendingSection({
  title = "Trending in the community",
  titleAccent,
  films = defaultFilms,
}: TrendingSectionProps = {}) {
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: false,
  });
  const selectedIndex = useEmblaSelectedIndex(emblaApi);

  const handleSlideClick = useCallback(
    (slideIndex: number, filmId: string) => {
      if (!emblaApi) return;
      const current = emblaApi.selectedScrollSnap();
      // Clicking the focused card opens the film; side cards scroll into focus.
      if (slideIndex === current) {
        router.push(`/films/${filmId}`);
        return;
      }
      if (slideIndex < current) emblaApi.scrollPrev();
      else emblaApi.scrollNext();
    },
    [emblaApi, router]
  );

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header row */}
      <div className="section-container mb-8 lg:mb-17 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
        <AccentTitle text={title} accent={titleAccent} />
        <ShowAllLink isCenter={true} href="/films" className="hidden lg:flex uppercase 
        text-brand-light hover:opacity-70 transition-opacity items-center 
        gap-2 sm:mb-2 font-oswald font-light text-sm tracking-[0.06em]" withBorder={true} />
      </div>

      {/* Mobile: horizontal scroll (hidden on lg+) */}
      <div className="lg:hidden w-full">
        <div className="section-container">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {films.map((film) => (
              <MobileFilmCard key={film.id} film={film} />
            ))}
          </div>
        </div>
        <ShowAllLink href="/films" className="flex justify-end mr-5 lowercase
        text-brand-muted hover:opacity-70 transition-opacity items-center gap-2 
         sm:mb-2 font-oswald font-light text-[20px] tracking-[0.06em]" withBorder={false} />
      </div>

      {/* Desktop: Embla carousel (hidden below lg) */}
      <div className="hidden lg:block w-full">
        <div className="w-full overflow-hidden" ref={emblaRef} style={{ height: CENTER_H }}>
          <div className="flex items-center" style={{ height: CENTER_H }}>
            {films.map((film, i) => (
              <div
                key={film.id}
                className="relative shrink-0 flex items-center justify-center"
                style={{ flex: `0 0 ${CENTER_W}px`, width: CENTER_W, marginRight: GAP }}
                onClick={() => handleSlideClick(i, film.id)}
              >
                <FilmCard film={film} isCenter={i === selectedIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
