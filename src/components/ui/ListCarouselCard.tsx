import Image from "next/image";
import { ListCardData } from "@/types/film";
import { LIST_STRIP_RATIO } from "@/constants/carousel";

interface ListCarouselCardProps {
  list: ListCardData;
  isCenter: boolean;
}

// A single list as a 4-poster strip with title + "N films by @author" meta below.
// Sizing/dimming for the side cards is handled by ListsCarouselSection.
export default function ListCarouselCard({ list, isCenter }: ListCarouselCardProps) {
  return (
    <div className="flex w-full flex-col items-center text-center select-none">
      {/* Poster strip — 4 posters flush, cropped to a shared height */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: LIST_STRIP_RATIO }}
      >
        <div className="grid h-full w-full grid-cols-4">
          {list.posters.map((src, i) => (
            <div
              key={i}
              className="relative h-full w-full overflow-hidden border-l border-black/40 first:border-l-0"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="200px" />
            </div>
          ))}
        </div>
        {/* Dim the non-centered cards */}
        <div
          className="absolute inset-0 bg-brand-dark/55"
          style={{ opacity: isCenter ? 0 : 1, transition: "opacity 0.5s" }}
        />
      </div>

      {/* Title */}
      <h3 className="mt-6 font-oswald font-medium tracking-[0.04em] text-brand-gold text-[28px] leading-[34px] lg:text-[40px] lg:leading-[48px]">
        {list.title}
      </h3>

      {/* Symmetric divider */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-brand-light/15 to-transparent" />

      {/* Meta */}
      <p className="mt-4 font-manrope text-[15px] leading-[20px] lg:text-[18px] lg:leading-[24px]">
        <span className="text-brand-light">{list.filmCount} films</span>
        <span className="text-brand-muted">{" "}by @{list.author}</span>
      </p>
    </div>
  );
}
