"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import GradientDivider from "@/components/ui/GradientDivider";
import ListActions from "@/components/ui/ListActions";
import type { CollectionData } from "@/types/film";

// Flex ratios derived from Figma: container 548.52 wide, featured 434.32, then 4 right-side strips
// peeking out at offsets 34.63 / 62.71 / 89.86 / 114.2 from the featured frame (widths 35.56 / 27.15 / 27.15 / 24.34).
const FEATURED_FLEX = 79.18;
const STRIP_FLEXES = [6.48, 4.95, 4.95, 4.44];

// Pastel palettes — fallback fills used only when a list has no poster artwork.
const PASTEL_PALETTES: string[][] = [
  ["#F5C2C7", "#F8C6A4", "#F4E4A1", "#B8E1C8", "#B8D4E3"], // pink / peach / butter / mint / sky
  ["#C4D7E0", "#E2C9D9", "#F1D6B8", "#D8E2C9", "#C9C2E0"], // sky / mauve / peach / sage / lavender
  ["#E8D5B7", "#D8C5E8", "#B7D8E8", "#E8B7C5", "#C5E8B7"], // sand / lilac / sky / rose / lime
  ["#B8C5E0", "#E0B8C5", "#C5E0B8", "#E0D8B8", "#D8B8E0"], // periwinkle / blush / pistachio / vanilla / orchid
];

export default function ListCard({
  list,
  paletteIndex = 0,
  isAuthed = false,
}: {
  list: CollectionData;
  paletteIndex?: number;
  isAuthed?: boolean;
}) {
  const router = useRouter();
  const href = `/lists/${list.id}`;
  const palette = PASTEL_PALETTES[paletteIndex % PASTEL_PALETTES.length];

  // One slot per region (featured + 4 strips). Use the list's real posters,
  // cycling them to fill all five; fall back to the pastel fill if none exist.
  const posters = list.films.filter(Boolean);
  const slotFlexes = [FEATURED_FLEX, ...STRIP_FLEXES];
  const filmCount = list.filmCount || list.films.length;

  return (
    <div className="flex flex-col w-full group">
      <div
        className="relative w-full overflow-hidden aspect-[548/237] rounded-[4px] cursor-pointer"
        onClick={() => router.push(href)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push(href)}
      >
        <div className="flex h-full w-full">
          {slotFlexes.map((flex, i) => {
            const poster = posters.length ? posters[i % posters.length] : null;
            return (
              <div
                key={i}
                className="relative h-full overflow-hidden border-l border-black/30 first:border-l-0"
                style={{
                  flexGrow: flex,
                  flexShrink: 0,
                  flexBasis: 0,
                  background: poster ? undefined : palette[i] ?? palette[palette.length - 1],
                }}
              >
                {poster && (
                  <Image
                    src={poster}
                    alt=""
                    fill
                    unoptimized
                    sizes={i === 0 ? "440px" : "60px"}
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push(href)}
        className="mt-4 text-left font-oswald font-normal text-brand-gold text-[32px] leading-[1.2] tracking-[0.01em] hover:opacity-80 transition-opacity"
      >
        {list.title}
      </button>

      <GradientDivider className="mt-2" />

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="font-manrope font-light text-[16px] leading-none tracking-[0.02em] pb-1.5">
          <span className="text-brand-light">{filmCount} films</span>{" "}
          {list.author ? <span className="text-brand-muted">by @{list.author}</span> : null}
        </p>

        <ListActions
          listId={list.id}
          initialLiked={list.isLiked}
          initialSaved={list.isSaved}
          isAuthed={isAuthed}
        />
      </div>
    </div>
  );
}
