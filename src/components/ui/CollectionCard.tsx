"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ListActions from "@/components/ui/ListActions";
import { CollectionData } from "@/types/film";

const CENTER_FLEX = 5;
const SIDE_FLEX = 1;

interface CollectionCardProps {
  collection: CollectionData;
  isAuthed?: boolean;
}

export default function CollectionCard({ collection, isAuthed = false }: CollectionCardProps) {
  const router = useRouter();
  const films = collection.films || [];
  if (films.length === 0) return null;

  const centerIdx = Math.floor((films.length - 1) / 2);
  const href = `/lists/${collection.id}`;

  const isCompact = films.length <= 4;

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
        <div className={`flex h-full ${isCompact ? "justify-center mx-auto" : ""}`}>
          {films.map((src, i) => {
            const isCenter = i === centerIdx;
            const farFromCenter = Math.abs(i - centerIdx) > 2;

            const useBackdrop = isCenter && !!collection.backdrops?.[0];
            const imgSrc = useBackdrop ? collection.backdrops?.[0] ?? src : src;
            const compactWidth = isCenter ? "280px" : "98px";


            return (
              <div
                key={i}
                className={`relative h-full overflow-hidden transition-all ${isCenter && !useBackdrop ? "bg-brand-dark" : ""} ${farFromCenter ? "hidden sm:block" : ""}`}
                style={{
                  flexGrow: isCompact ? 0 : isCenter ? CENTER_FLEX : SIDE_FLEX,
                  flexShrink: isCompact ? 0 : 1,
                  flexBasis: isCompact ? compactWidth : "0",
                  width: isCompact ? compactWidth : undefined,
                  maxWidth: isCompact ? compactWidth : undefined,
                }}
              >
                <Image
                  src={imgSrc}
                  alt=""
                  fill
                  unoptimized
                  className={
                    useBackdrop
                      ? "object-cover object-center"
                      : isCenter
                        ? "object-contain"
                        : "object-cover object-top"
                  }
                  sizes={isCenter ? "44vw" : isCompact ? "110px" : "120px"}
                />

                {!isCenter && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ boxShadow: shadow(i) }}
                  />
                )}

                {/* Скобки для соседних с центром */}
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

      {/* Title */}
      <p className="font-oswald font-normal text-brand-gold text-center lg:uppercase mt-4 text-[20px] leading-7 lg:text-[36px] lg:leading-12 tracking-[2.16px] group-hover:opacity-80 transition-opacity">
        {collection.title}
      </p>

      <div className="mt-3 h-px w-full bg-linear-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Info */}
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

      {/* Actions */}
      <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
        <ListActions
          listId={collection.id}
          initialLiked={collection.isLiked ?? false}
          isAuthed={isAuthed}
        />
      </div>
    </div>
  );
}