"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CollectionData } from "@/types/film";

const CENTER_IDX = 5;
const CENTER_FLEX = 8;
const SIDE_FLEX = 1;

function cardShadow(i: number): string {
  if (i < CENTER_IDX) return "inset -50px 0 35px rgba(18, 16, 14, 0.85)";
  if (i > CENTER_IDX) return "inset 50px 0 35px rgba(18, 16, 14, 0.85)";
  return "none";
}

interface CollectionCardProps {
  collection: CollectionData;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();

  return (
    <div
      className="flex flex-col w-full cursor-pointer group"
      onClick={() => router.push(`/collections/${collection.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/collections/${collection.id}`)}
    >
      {/* Filmstrip */}
      <div className="relative w-full overflow-hidden h-[180px] lg:h-[300px] rounded-[4px]">
        <div className="flex h-full w-full">
          {collection.films.map((src, i) => {
            const isCenter = i === CENTER_IDX;

            return (
              <div
                key={i}
                className={`relative h-full overflow-hidden ${i < 2 || i > 8 ? "hidden sm:block" : ""}`}
                style={{
                  flexGrow: isCenter ? CENTER_FLEX : SIDE_FLEX,
                  flexShrink: 0,
                  flexBasis: 0,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes={isCenter ? "44vw" : "300px"}
                />

                {!isCenter && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ boxShadow: cardShadow(i) }}
                  />
                )}

                {i === CENTER_IDX - 1 && (
                  <div className="absolute right-0 inset-y-0 flex items-center z-10">
                    <span className="text-white/55 select-none translate-x-1/2 text-[40px] lg:text-[72px] leading-none font-thin font-sans">
                      )
                    </span>
                  </div>
                )}

                {i === CENTER_IDX + 1 && (
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
      <p className="font-oswald font-normal text-brand-gold text-center uppercase mt-4 text-[20px] leading-[28px] lg:text-[36px] lg:leading-[48px] tracking-[2.16px] group-hover:opacity-80 transition-opacity">
        {collection.title}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-brand-gold/30 mt-3" />
    </div>
  );
}
