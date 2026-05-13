"use client";

import { useRouter } from "next/navigation";
import GradientDivider from "@/components/ui/GradientDivider";
import type { CollectionData } from "@/types/film";

// Flex ratios derived from Figma: container 548.52 wide, featured 434.32, then 4 right-side strips
// peeking out at offsets 34.63 / 62.71 / 89.86 / 114.2 from the featured frame (widths 35.56 / 27.15 / 27.15 / 24.34).
const FEATURED_FLEX = 79.18;
const STRIP_FLEXES = [6.48, 4.95, 4.95, 4.44];

// Pastel palettes — one per card. Index 0 is the featured fill; 1-4 are the right-side strips.
const PASTEL_PALETTES: string[][] = [
  ["#F5C2C7", "#F8C6A4", "#F4E4A1", "#B8E1C8", "#B8D4E3"], // pink / peach / butter / mint / sky
  ["#C4D7E0", "#E2C9D9", "#F1D6B8", "#D8E2C9", "#C9C2E0"], // sky / mauve / peach / sage / lavender
  ["#E8D5B7", "#D8C5E8", "#B7D8E8", "#E8B7C5", "#C5E8B7"], // sand / lilac / sky / rose / lime
  ["#B8C5E0", "#E0B8C5", "#C5E0B8", "#E0D8B8", "#D8B8E0"], // periwinkle / blush / pistachio / vanilla / orchid
];

export default function ListCard({ list, paletteIndex = 0 }: { list: CollectionData; paletteIndex?: number }) {
  const router = useRouter();
  const href = `/lists/${list.id}`;
  const palette = PASTEL_PALETTES[paletteIndex % PASTEL_PALETTES.length];

  return (
    <div
      className="flex flex-col w-full cursor-pointer group"
      onClick={() => router.push(href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(href)}
    >
      <div className="relative w-full overflow-hidden aspect-[548/237] rounded-[4px]">
        <div className="flex h-full w-full">
          <div
            className="h-full"
            style={{ flexGrow: FEATURED_FLEX, flexShrink: 0, flexBasis: 0, background: palette[0] }}
          />
          {STRIP_FLEXES.map((flex, i) => (
            <div
              key={i}
              className="h-full"
              style={{
                flexGrow: flex,
                flexShrink: 0,
                flexBasis: 0,
                background: palette[i + 1] ?? palette[palette.length - 1],
              }}
            />
          ))}
        </div>
      </div>

      <p className="font-oswald font-normal text-brand-gold mt-4 text-[32px] leading-[1.2] tracking-[0.01em] group-hover:opacity-80 transition-opacity">
        {list.title}
      </p>

      <GradientDivider className="mt-2" />
    </div>
  );
}
