"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ListCarouselCard from "@/components/ui/ListCarouselCard";
import { lists as defaultLists } from "@/data/lists";
import type { ListCardData } from "@/types/film";
import {
  LIST_CARD_W,
  LIST_GAP,
  LIST_SIDE_SCALE,
  LIST_VIEWPORT_H,
  TRANSITION,
} from "@/constants/carousel";
import { AccentTitle } from "../ui/AccentTitle";

interface ListsCarouselSectionProps {
  title?: string;
  titleAccent?: string;
  /** Live trending lists; falls back to static demo data when empty/omitted. */
  lists?: ListCardData[];
}

export default function ListsCarouselSection({
  title = "Trending",
  titleAccent,
  lists = defaultLists,
}: ListsCarouselSectionProps = {}) {
  const router = useRouter();
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
      // Clicking the centered card opens its detail page; side cards scroll in.
      if (slideIndex === current) {
        const list = lists[slideIndex];
        if (list) router.push(`/lists/${list.id}`);
        return;
      }
      if (slideIndex < current) emblaApi.scrollPrev();
      else emblaApi.scrollNext();
    },
    [emblaApi, lists, router]
  );

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header row */}
      <div className="section-container mb-8 lg:mb-17 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
        <AccentTitle text={title} accent={titleAccent} />
      </div>

      {/* Mobile: horizontal scroll (hidden on lg+) */}
      <div className="lg:hidden w-full">
        <div className="section-container">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="shrink-0 w-70 snap-center"
              >
                <ListCarouselCard list={list} isCenter />
              </Link>
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
                    className="cursor-pointer"
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
