"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import FilmCard from "@/components/ui/FilmCard";
import MobileFilmCard from "@/components/ui/MobileFilmCard";
import { films } from "@/data/films";
import { CENTER_W, CENTER_H, GAP } from "@/constants/carousel";

export default function TrendingSection() {
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
    [emblaApi]
  );

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header row */}
      <div className="section-container mb-8 lg:mb-[68px] flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
        <h2 className="uppercase font-oswald font-light text-brand-light text-[28px] leading-[36px] lg:text-[56px] lg:leading-[64px] tracking-[0.06em]">
          Trending in the community
        </h2>
        <Link
          href="#"
          className="uppercase text-brand-muted hover:text-brand-light transition-colors flex items-center gap-2 sm:mb-2 font-oswald font-light text-sm tracking-[0.06em]"
        >
          <span className="border-b border-current pb-0.5">SHOW ALL</span>
          <span>→</span>
        </Link>
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
