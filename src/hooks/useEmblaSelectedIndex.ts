"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { EmblaCarouselType } from "embla-carousel";

/**
 * The carousel's currently selected snap index, kept in sync with Embla via
 * useSyncExternalStore (select/settle/reInit). Returns 0 until the API is ready.
 */
export function useEmblaSelectedIndex(emblaApi: EmblaCarouselType | undefined): number {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onChange);
      emblaApi.on("settle", onChange);
      emblaApi.on("reInit", onChange);
      return () => {
        emblaApi.off("select", onChange);
        emblaApi.off("settle", onChange);
        emblaApi.off("reInit", onChange);
      };
    },
    [emblaApi],
  );

  return useSyncExternalStore(
    subscribe,
    () => emblaApi?.selectedScrollSnap() ?? 0,
    () => 0,
  );
}
