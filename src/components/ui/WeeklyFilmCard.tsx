"use client";

import Image from "next/image";
import Link from "next/link";
import { WeeklyFilmData } from "@/types/film";

const ACTIVE_H = 170;
const INACTIVE_H = 90;

interface WeeklyFilmCardProps {
  film: WeeklyFilmData;
  isActive: boolean;
  onClick: () => void;
}

export default function WeeklyFilmCard({ film, isActive, onClick }: WeeklyFilmCardProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md cursor-pointer"
      style={{
        height: isActive ? ACTIVE_H : INACTIVE_H,
        transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onClick}
    >
      <Image
        src={film.image}
        alt={film.title}
        fill
        className="object-cover object-center"
        sizes="544px"
        style={{ transition: "transform 0.4s ease" }}
      />

      {/* Dark gradient: transparent left → dark right */}
      <div className="absolute inset-0 bg-gradient-to-l from-brand-dark/90 via-brand-dark/50 to-transparent" />

      {/* Text overlay */}
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
            className="uppercase font-oswald text-brand-gold tracking-[0.06em] leading-tight"
            style={{
              fontWeight: 400,
              fontSize: isActive ? 36 : 26,
              transition: "font-size 0.4s ease",
            }}
          >
            {film.title}
          </h3>
          <p
            className="text-brand-muted font-manrope"
            style={{
              fontSize: isActive ? 14 : 12,
              lineHeight: "18px",
              letterSpacing: "0.06em",
              transition: "font-size 0.4s ease",
            }}
          >
            {film.reviewCount}
          </p>
        </div>

        <Link
          href="#"
          className="uppercase font-oswald text-brand-light hover:opacity-70 tracking-[0.06em]"
          style={{
            fontWeight: 300,
            fontSize: 14,
            textDecoration: "underline",
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
