"use client";

import { useState } from "react";
import Link from "next/link";
import WeeklyFilmCard from "@/components/ui/WeeklyFilmCard";
import { mostReviewedFilms, topRatedFilms } from "@/data/weeklyFilms";
import { WeeklyFilmData } from "@/types/film";

interface FilmColumnProps {
  title: string;
  films: WeeklyFilmData[];
  align?: "left" | "right";
}

function FilmColumn({ title, films, align = "left" }: FilmColumnProps) {
  const [activeId, setActiveId] = useState<string>(films[0]?.id ?? "");

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <p
        className="font-oswald text-brand-light"
        style={{
          fontWeight: 200,
          fontSize: 32,
          letterSpacing: "0.06em",
          lineHeight: "48px",
          textAlign: align,
        }}
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
          />
        ))}
      </div>
    </div>
  );
}

export default function WeeklySection() {
  return (
    <section className="w-full pt-24 pb-24 flex flex-col items-center bg-brand-dark">
      {/* Section header */}
      <div className="w-[94%] lg:w-[90%] xl:w-[83%] max-w-[1197px] mb-[48px] flex justify-between items-end">
        <h2
          className="uppercase font-oswald text-brand-light opacity-90"
          style={{
            fontWeight: 400,
            fontSize: 56,
            letterSpacing: "0.06em",
            lineHeight: "64px",
          }}
        >
          This Week in Cinema
        </h2>
        <Link
          href="#"
          className="uppercase text-brand-light hover:opacity-70 transition-opacity font-oswald underline mb-2"
          style={{ fontWeight: 300, fontSize: 16, letterSpacing: "0.06em" }}
        >
          show all →
        </Link>
      </div>

      {/* Card with solid gold border + gradient background */}
      <div
        className="w-[94%] lg:w-[90%] xl:w-[83%] max-w-[1197px] rounded-md flex gap-[47px]"
        style={{
          backgroundColor: "#12100E",
          backgroundImage:
            "linear-gradient(27deg, rgba(210, 166, 106, 0.17) 15%, rgba(18, 16, 14, 0) 99%)",
          padding: "30px 49px 44px 49px",
        }}
      >
        <FilmColumn
          title="Most Reviewed"
          films={mostReviewedFilms}
          align="left"
        />

        {/* Vertical divider */}
        <div className="w-px self-stretch bg-brand-gold/30 shrink-0" />

        <FilmColumn title="Top Rated" films={topRatedFilms} align="right" />
      </div>
    </section>
  );
}
