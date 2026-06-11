"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ListActions from "@/components/ui/ListActions";
import { CollectionData } from "@/types/film";

const CENTER_FLEX = 8;
const SIDE_FLEX = 1;
// On mobile only the centre panel plus this many panels on each side are shown.
const MOBILE_SIDE_REACH = 2;

interface CollectionCardProps {
  collection: CollectionData;
  /** Enables the Like/Save buttons to act for the current user (else they route to /login). */
  isAuthed?: boolean;
}

export default function CollectionCard({ collection, isAuthed = false }: CollectionCardProps) {
  const router = useRouter();
  const films = collection.films;
  if (films.length === 0) return null;

  // Centre is the middle poster; everything left/right of it fans out as thin
  // slices. Derived from the actual count so the strip always fills its width
  // (no black gaps) and the two halves are different films (no mirrored repeat).
  const centerIdx = Math.floor((films.length - 1) / 2);
  const href = `/lists/${collection.id}`;

  function shadow(i: number): string {
    if (i < centerIdx) return "inset -50px 0 35px rgba(18, 16, 14, 0.85)";
    if (i > centerIdx) return "inset 50px 0 35px rgba(18, 16, 14, 0.85)";
    return "none";
  }

  return (
    <div
      className="flex flex-col w-full cursor-pointer group"
      onClick={() => router.push(href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(href)}
    >
      {/* Filmstrip */}
      <div className="relative w-full overflow-hidden h-45 lg:h-75 rounded-sm">
        <div className="flex h-full w-full">
          {films.map((src, i) => {
            const isCenter = i === centerIdx;
            const farFromCenter = Math.abs(i - centerIdx) > MOBILE_SIDE_REACH;
            // Centre uses the featured film's landscape backdrop when available
            // (fills the wide panel naturally); otherwise the poster shown in full.
            const useBackdrop = isCenter && !!collection.backdrop;
            const imgSrc = useBackdrop ? collection.backdrop! : src;

            return (
              <div
                key={i}
                className={`relative h-full overflow-hidden ${isCenter && !useBackdrop ? "bg-brand-dark" : ""} ${farFromCenter ? "hidden sm:block" : ""}`}
                style={{
                  flexGrow: isCenter ? CENTER_FLEX : SIDE_FLEX,
                  flexShrink: 0,
                  flexBasis: 0,
                }}
              >
                <Image
                  src={imgSrc}
                  alt=""
                  fill
                  unoptimized
                  // Backdrop fills the wide centre; a poster centre shows in full
                  // (no crop); side slivers cover-crop from the top.
                  className={
                    useBackdrop
                      ? "object-cover object-center"
                      : isCenter
                        ? "object-contain"
                        : "object-cover object-top"
                  }
                  sizes={isCenter ? "44vw" : "300px"}
                />

                {!isCenter && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ boxShadow: shadow(i) }}
                  />
                )}

                {i === centerIdx - 1 && (
                  <div className="absolute right-0 inset-y-0 flex items-center z-10">
                    <span className="text-white/55 select-none translate-x-1/2 text-[40px] lg:text-[72px] leading-none font-thin font-sans">
                      )
                    </span>
                  </div>
                )}

                {i === centerIdx + 1 && (
                  <div className="absolute left-0 inset-y-0 flex items-center z-10">
                    <span className="text-white/55 select-none -translate-x-1/2 text-[40px] lg:text-[72px] leading-none font-thin font-sans">
                      (
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Collection title */}
      <p className="font-oswald font-normal text-brand-gold text-center lg:uppercase mt-4 text-[20px] leading-7 lg:text-[36px] lg:leading-12 tracking-[2.16px] group-hover:opacity-80 transition-opacity">
        {collection.title}
      </p>

      {/* Symmetrical gradient divider — bright in the middle, fading to both edges */}
      <div className="mt-3 h-px w-full bg-linear-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Film count + author, under the divider */}
      {(collection.author || collection.filmCount != null) && (
        <p className="mt-4 text-center font-manrope text-[13px] lg:text-[15px] text-brand-muted tracking-[0.02em]">
          {collection.filmCount != null && (
            <span className="text-brand-light/80">{collection.filmCount} films</span>
          )}
          {collection.filmCount != null && collection.author && (
            <span className="mx-2 text-brand-muted/60">·</span>
          )}
          {collection.author && (
            <>
              by <span className="text-brand-gold/90">@{collection.author}</span>
            </>
          )}
        </p>
      )}

      {/* Like / Save — stop card navigation; route to /login when signed out */}
      <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
        <ListActions
          listId={collection.id}
          initialLiked={collection.isLiked ?? false}
          initialSaved={collection.isSaved ?? false}
          isAuthed={isAuthed}
        />
      </div>
    </div>
  );
}
