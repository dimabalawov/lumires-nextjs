"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import FilmCard from "@/components/ui/FilmCard";
import MobileFilmCard from "@/components/ui/MobileFilmCard";
import type { FilmCardData } from "@/types/film";
import { CENTER_W, CENTER_H, GAP } from "@/constants/carousel";

interface SimilarFilmsSectionProps {
  films: FilmCardData[];
  showAllHref?: string;
}

export default function SimilarFilmsSection({
  films,
  showAllHref = "#",
}: SimilarFilmsSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("settle", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("settle", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleSlideClick = useCallback(
    (slideIndex: number) => {
      if (!emblaApi) return;
      const current = emblaApi.selectedScrollSnap();
      if (slideIndex === current) return;
      if (slideIndex < current) emblaApi.scrollPrev();
      else emblaApi.scrollNext();
    },
    [emblaApi],
  );

  if (films.length === 0) return null;

  return (
    <section className="w-full pb-24 flex flex-col items-center">
      <div className="section-container mb-8 lg:mb-[68px] flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
        <h2 className="font-manrope font-light text-[28px] lg:text-[48px] leading-[1.2em] tracking-[0.02em] text-brand-light opacity-90">
          Similar <span className="text-brand-gold">Films</span>
        </h2>
        <Link
          href={showAllHref}
          className="uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2"
        >
          show all →
        </Link>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="lg:hidden w-full">
        <div className="section-container">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {films.map((film) => (
              <MobileFilmCard key={film.id} film={film} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Embla carousel */}
      <div className="hidden lg:block w-full">
        <div className="w-full overflow-hidden" ref={emblaRef} style={{ height: CENTER_H }}>
          <div className="flex items-center" style={{ height: CENTER_H }}>
            {films.map((film, i) => (
              <div
                key={film.id}
                className="relative shrink-0 flex items-center justify-center"
                style={{ flex: `0 0 ${CENTER_W}px`, width: CENTER_W, marginRight: GAP }}
                onClick={() => handleSlideClick(i)}
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
