"use client";

import { useState } from "react";
import WeeklyFilmCard from "./WeeklyFilmCard";
import { WeeklyFilmData } from "@/types/film";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface FilmColumnProps {
  title: string;
  films: WeeklyFilmData[];
  align?: "left" | "right";
}

export default function FilmColumn({ title, films, align = "left" }: FilmColumnProps) {
  const [activeId, setActiveId] = useState<string>(films[0]?.id ?? "");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const activeH = isDesktop ? 170 : 131;
  const inactiveH = isDesktop ? 90 : 70;

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <p
        className={`font-oswald text-brand-light font-extralight text-[24px] leading-[36px] lg:text-[32px] lg:leading-[48px] tracking-[0.06em] ${
          align === "right" ? "text-right" : "text-left"
        }`}
      >
        {title}
      </p>
      <div className="w-full h-px bg-brand-gold/40 mt-1 mb-5" />
      <div className="flex flex-col gap-4">
        {films.map((film) => (
          <WeeklyFilmCard
            key={film.id}
            film={film}
            isActive={film.id === activeId}
            onClick={() => setActiveId(film.id)}
            activeH={activeH}
            inactiveH={inactiveH}
          />
        ))}
      </div>
    </div>
  );
}
