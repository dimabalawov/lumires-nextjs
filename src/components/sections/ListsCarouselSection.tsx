"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ListCarouselCard from "@/components/ui/ListCarouselCard";
import { lists } from "@/data/lists";
import {
  LIST_CARD_W,
  LIST_GAP,
  LIST_SIDE_SCALE,
  LIST_VIEWPORT_H,
  TRANSITION,
} from "@/constants/carousel";

interface ListsCarouselSectionProps {
  title?: string;
  titleAccent?: string;
}

export default function ListsCarouselSection({
  title = "Trending",
  titleAccent,
}: ListsCarouselSectionProps = {}) {
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
        <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <span className="text-brand-gold">{titleAccent}</span>
            </>
          ) : null}
        </h2>
        <Link
          href="#"
          className="uppercase text-brand-light hover:opacity-70 transition-opacity flex items-center gap-2 sm:mb-2 font-oswald font-light text-sm tracking-[0.06em]"
        >
          <span className="border-b border-current pb-0.5">SHOW ALL</span>
          <span>→</span>
        </Link>
      </div>

      {/* Mobile: horizontal scroll (hidden on lg+) */}
      <div className="lg:hidden w-full">
        <div className="section-container">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {lists.map((list) => (
              <div key={list.id} className="shrink-0 w-[280px] snap-center">
                <ListCarouselCard list={list} isCenter />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Embla carousel (hidden below lg) */}
      <div className="hidden lg:block w-full">
        <div
          className="w-full overflow-hidden"
          ref={emblaRef}
          style={{ height: LIST_VIEWPORT_H }}
        >
          <div className="flex items-center" style={{ height: LIST_VIEWPORT_H }}>
            {lists.map((list, i) => {
              const isCenter = i === selectedIndex;
              return (
                <div
                  key={list.id}
                  className="shrink-0 flex items-center justify-center"
                  style={{ flex: `0 0 ${LIST_CARD_W}px`, width: LIST_CARD_W, marginRight: LIST_GAP }}
                  onClick={() => handleSlideClick(i)}
                >
                  <div
                    className={isCenter ? "cursor-default" : "cursor-pointer"}
                    style={{
                      width: LIST_CARD_W,
                      transform: `scale(${isCenter ? 1 : LIST_SIDE_SCALE})`,
                      opacity: isCenter ? 1 : 0.85,
                      transition: TRANSITION,
                    }}
                  >
                    <ListCarouselCard list={list} isCenter={isCenter} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
