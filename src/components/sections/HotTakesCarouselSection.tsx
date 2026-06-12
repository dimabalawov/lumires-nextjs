"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useEmblaSelectedIndex } from "@/hooks/useEmblaSelectedIndex";
import HotTakeCard from "@/components/ui/HotTakeCard";
import { hotTakes } from "@/data/hotTakes";
import {
  HOTTAKE_CARD_W,
  HOTTAKE_GAP,
  HOTTAKE_SIDE_SCALE,
  HOTTAKE_SIDE_OPACITY,
  HOTTAKE_VIEWPORT_H,
  TRANSITION,
} from "@/constants/carousel";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

interface HotTakesCarouselSectionProps {
  title?: string;
  titleAccent?: string;
}

export default function HotTakesCarouselSection({
  title = "Hot Takes",
  titleAccent = "This Week",
}: HotTakesCarouselSectionProps = {}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: false,
  });
  const selectedIndex = useEmblaSelectedIndex(emblaApi);

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
        <AccentTitle text={title} accent={titleAccent} />

        <ShowAllLink href="#" className="hidden lg:flex uppercase text-brand-light"
          withBorder={true}
          isCenter={true} />
      </div>

      {/* Mobile: horizontal scroll (hidden on lg+) */}
      <div className="lg:hidden w-full">
        <div className="section-container">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {hotTakes.map((take) => (
              <div key={take.id} className="shrink-0 w-[300px] snap-center">
                <HotTakeCard take={take} isCenter />
              </div>
            ))}
          </div>

          <ShowAllLink href="#" className="flex lg:hidden mt-2 lowercase text-brand-muted"
            withBorder={false}
            isCenter={true} />
        </div>
      </div>

      {/* Desktop: Embla carousel (hidden below lg) */}
      <div className="hidden lg:block w-full">
        <div
          className="w-full overflow-hidden"
          ref={emblaRef}
          style={{ height: HOTTAKE_VIEWPORT_H }}
        >
          <div className="flex items-center" style={{ height: HOTTAKE_VIEWPORT_H }}>
            {hotTakes.map((take, i) => {
              const isCenter = i === selectedIndex;
              return (
                <div
                  key={take.id}
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    flex: `0 0 ${HOTTAKE_CARD_W}px`,
                    width: HOTTAKE_CARD_W,
                    marginRight: HOTTAKE_GAP,
                  }}
                  onClick={() => handleSlideClick(i)}
                >
                  <div
                    className={isCenter ? "cursor-default" : "cursor-pointer"}
                    style={{
                      width: HOTTAKE_CARD_W,
                      transform: `scale(${isCenter ? 1 : HOTTAKE_SIDE_SCALE})`,
                      opacity: isCenter ? 1 : HOTTAKE_SIDE_OPACITY,
                      transition: TRANSITION,
                    }}
                  >
                    <HotTakeCard take={take} isCenter={isCenter} />
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
