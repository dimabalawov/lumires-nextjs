"use client";

import Image from "next/image";
import Link from "next/link";
import { WeeklyFilmData } from "@/types/film";

interface WeeklyFilmCardProps {
  film: WeeklyFilmData;
  isActive: boolean;
  onClick: () => void;
  activeH?: number;
  inactiveH?: number;
}

export default function WeeklyFilmCard({
  film,
  isActive,
  onClick,
  activeH = 170,
  inactiveH = 90,
}: WeeklyFilmCardProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md cursor-pointer"
      style={{
        height: isActive ? activeH : inactiveH,
        transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onClick}
    >
      <Image
        src={film.image}
        alt={film.title}
        fill
        className="object-cover object-center"
        sizes="(min-width: 1024px) 544px, 100vw"
        style={{ transition: "transform 0.4s ease" }}
      />

      <div className="absolute inset-0 bg-gradient-to-l from-brand-dark/90 via-brand-dark/50 to-transparent" />

      <div
        className="absolute inset-0 flex flex-col items-end justify-between pr-6"
        style={{
          paddingTop: isActive ? 16 : 12,
          paddingBottom: isActive ? 16 : 12,
          transition: "padding 0.4s ease",
        }}
      >
        <div className="flex flex-col items-end gap-1">
          <h3
            className="uppercase font-oswald font-normal text-brand-gold tracking-[0.06em] leading-tight"
            style={{
              fontSize: isActive ? 28 : 20,
              transition: "font-size 0.4s ease",
            }}
          >
            {film.title}
          </h3>
          <p
            className="text-brand-muted font-manrope leading-[18px] tracking-[0.06em]"
            style={{
              fontSize: isActive ? 13 : 11,
              transition: "font-size 0.4s ease",
            }}
          >
            {film.reviewCount}
          </p>
        </div>

        <Link
          href={`/films/${film.id}`}
          className="uppercase font-oswald font-light text-brand-light hover:opacity-70 tracking-[0.06em] text-sm underline"
          style={{
            opacity: isActive ? 1 : 0,
            pointerEvents: isActive ? "auto" : "none",
            transition: "opacity 0.3s ease 0.1s",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          SEE ALL REVIEWS →
        </Link>
      </div>
    </div>
  );
}
