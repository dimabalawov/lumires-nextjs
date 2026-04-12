"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import FilmCard from "@/components/ui/FilmCard";
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
    <section className="w-full pt-24 pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header row */}
      <div className="w-[80%] max-w-[1200px] mb-[68px] flex justify-between items-end pb-4">
        <h2
          className="uppercase font-oswald text-brand-light"
          style={{ fontWeight: 300, fontSize: 56, letterSpacing: "0.06em", lineHeight: "64px" }}
        >
          Trending in the community
        </h2>
        <Link
          href="#"
          className="uppercase text-brand-muted hover:text-brand-light transition-colors flex items-center gap-2 mb-2 font-oswald"
          style={{ fontSize: 14, fontWeight: 300, letterSpacing: "0.06em" }}
        >
          <span className="border-b border-current pb-0.5">SHOW ALL</span>
          <span>→</span>
        </Link>
      </div>

      {/* Carousel viewport */}
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
    </section>
  );
}
