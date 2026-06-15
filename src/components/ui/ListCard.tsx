"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import GradientDivider from "@/components/ui/GradientDivider";
import ListActions from "@/components/ui/ListActions";
import type { CollectionData } from "@/types/film";

const FEATURED_FLEX = 79.18;
const STRIP_FLEXES = [6.48, 4.95, 4.95, 4.44];

const PASTEL_PALETTES: string[][] = [
  ["#F5C2C7", "#F8C6A4", "#F4E4A1", "#B8E1C8", "#B8D4E3"],
  ["#C4D7E0", "#E2C9D9", "#F1D6B8", "#D8E2C9", "#C9C2E0"],
  ["#E8D5B7", "#D8C5E8", "#B7D8E8", "#E8B7C5", "#C5E8B7"],
  ["#B8C5E0", "#E0B8C5", "#C5E0B8", "#E0D8B8", "#D8B8E0"],
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

  const posters = list.films.filter(Boolean);
  const slotFlexes = [FEATURED_FLEX, ...STRIP_FLEXES];
  const filmCount = list.filmsCount || list.films.length;

  const validBackdrops = (list.backdrops ?? []).filter(
    (url): url is string => typeof url === "string" && url.length > 0
  );
  const backdrop = validBackdrops[0];
  const useStack = validBackdrops.length > 1;


  return (
    <div className="flex flex-col w-full group">
      <div
        className="relative w-full overflow-hidden aspect-548/237 rounded-sm cursor-pointer"
        onClick={() => router.push(href)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push(href)}
      >
        {backdrop && !useStack && (
          <Image
            src={backdrop}
            alt=""
            fill
            unoptimized
            className="object-cover object-center"
          />
        )}
        {useStack &&
          validBackdrops.slice(0, 5).map((url, i) => {
            const total = Math.min(validBackdrops.length, 5);
            const rightOffset = (total - 1 - i) * 40;
            return (
              <div
                key={i}
                className="absolute inset-y-0 overflow-hidden"
                style={{
                  left: `${i * 20}px`,
                  right: `${rightOffset}px`,
                  zIndex: total - i,
                }}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
                {i > 0 && (
                  <div
                    className="absolute inset-0"
                    style={{ background: `rgba(0,0,0,${i * 0.2})` }}
                  />
                )}
              </div>
            );
          })}

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative flex h-full w-full">
          {!backdrop && slotFlexes.map((flex, i) => {
            const poster =
              posters.length ? posters[i] : null;
            return (
              <div
                key={`slot-${i}`}
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


      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push(href)}
          className="cursor-pointer mt-4 text-left font-oswald font-normal text-brand-gold leading-[1.2] tracking-[0.01em] hover:opacity-80 transition-opacity"
          style={{ fontSize: "clamp(20px, 3vw, 32px)" }}
        >
          {list.title}
        </button>

        <div className="flex flex-row gap-2.5 items-center">
          {list.isPrivate ?
            (
              <Image src="/imgs/profile/private.svg" width={15} height={15} alt="Private icon" />
            )
            :
            (
              <Image src="/imgs/profile/public.svg" width={15} height={15} alt="Private icon" />
            )
          }
          <span className="font-mono uppercase text-[11px] h-fit tracking-[2px] text-brand-gold">
            {list.isPrivate ? "Private" : "Public"}
          </span>
        </div>


      </div>


      <GradientDivider className="mt-2" />

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="font-manrope font-light text-[16px] leading-none tracking-[0.02em] pb-1.5">
          <span className="text-brand-light">{filmCount} films</span>{" "}
          {list.author ? <span className="text-brand-muted">by @{list.author}</span> : null}
        </p>

        <ListActions
          listId={list.id}
          initialLiked={list.isLiked}
          isAuthed={isAuthed}
        />
      </div>
    </div>
  );
}
