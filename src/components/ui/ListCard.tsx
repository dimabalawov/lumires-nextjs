"use client";

import { useState } from "react";
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

// Heart + bookmark glyphs lifted from the provided LIKE/SAVE button SVG,
// re-framed into their own viewBoxes so they render crisp at any size.
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="12" viewBox="27.5 9 13 12" fill="none" aria-hidden>
      <path
        d="M34.0002 20.1C34.0002 20.1 29.9169 17.475 28.4585 14.85C27.9944 14.1151 27.8412 13.2259 28.0326 12.3781C28.2241 11.5303 28.7445 10.7933 29.4794 10.3291C30.2142 9.865 31.1034 9.71181 31.9512 9.90325C32.799 10.0947 33.5361 10.6151 34.0002 11.35C34.4643 10.6151 35.2014 10.0947 36.0492 9.90325C36.897 9.71181 37.7862 9.865 38.521 10.3291C39.2559 10.7933 39.7763 11.5303 39.9677 12.3781C40.1592 13.2259 40.006 14.1151 39.5419 14.85C38.0835 17.475 34.0002 20.1 34.0002 20.1Z"
        stroke="currentColor"
        strokeWidth="0.816667"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="11" height="12" viewBox="96.5 8.5 11 13" fill="none" aria-hidden>
      <path
        d="M97.333 21V10.3333C97.333 9.96667 97.4636 9.65278 97.7247 9.39167C97.9858 9.13056 98.2997 9 98.6663 9H105.333C105.7 9 106.014 9.13056 106.275 9.39167C106.536 9.65278 106.666 9.96667 106.666 10.3333V21L102 19L97.333 21ZM98.6663 18.9667L102 17.5333L105.333 18.9667V10.3333H98.6663V18.9667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ActionButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-12 w-[68px] flex-col items-center justify-center gap-1 rounded-[2px] border transition-colors ${
        active
          ? "border-brand-gold/70 bg-brand-gold/10 text-brand-gold"
          : "border-brand-gold/45 text-brand-gold hover:bg-brand-gold/5"
      }`}
    >
      {children}
      <span className="font-manrope text-[10px] uppercase tracking-[0.18em] leading-none">
        {label}
      </span>
    </button>
  );
}

export default function ListCard({
  list,
  paletteIndex = 0,
}: {
  list: CollectionData;
  paletteIndex?: number;
}) {
  const router = useRouter();
  const href = `/lists/${list.id}`;
  const palette = PASTEL_PALETTES[paletteIndex % PASTEL_PALETTES.length];
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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
          <span className="text-brand-light">{list.filmCount ?? list.films.length} films</span>{" "}
          {list.author ? <span className="text-brand-muted">by @{list.author}</span> : null}
        </p>

        <div className="flex items-center gap-3">
          <ActionButton label="Like" active={liked} onClick={() => setLiked((v) => !v)}>
            <HeartIcon filled={liked} />
          </ActionButton>
          <ActionButton label="Save" active={saved} onClick={() => setSaved((v) => !v)}>
            <BookmarkIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
