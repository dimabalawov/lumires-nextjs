"use client";

import { useState } from "react";
import Link from "next/link";
import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import type { EditorialFilm } from "@/data/editorialCollections";
import { AccentTitle } from "../ui/AccentTitle";

const ROW_SIZE = 4;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

interface DirectorFilmographySectionProps {
  films: EditorialFilm[];
  /** Ids shown while collapsed; the remaining films reveal when "Show all" is clicked. */
  previewIds?: (string | number)[];
}

export default function DirectorFilmographySection({
  films,
  previewIds,
}: DirectorFilmographySectionProps) {
  const [expanded, setExpanded] = useState(false);
  if (films.length === 0) return null;

  const preview = previewIds
    ? films.filter((f) => previewIds.includes(String(f.id)))
    : films;
  const hasMore = preview.length < films.length;
  const visible = expanded || !hasMore ? films : preview;
  const rows = chunk(visible, ROW_SIZE);

  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">
      <AccentTitle text="Filmography" className="mb-6 lg:mb-8" />

      <div className="flex flex-col gap-10 lg:gap-12">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="border-t border-brand-light/15 pt-5 lg:pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {row.map((film) => {
                const isLinkable = /^\d+$/.test(String(film.id));
                const card = (
                  <>
                    <span className="text-center font-oswald font-light text-brand-light text-[14px] tracking-[0.12em]">
                      {film.year}
                    </span>
                    <EditorialPosterCard film={film} />
                  </>
                );
                return isLinkable ? (
                  <Link
                    key={film.id}
                    href={`/films/${film.id}`}
                    className="flex flex-col gap-4 transition-opacity hover:opacity-90"
                  >
                    {card}
                  </Link>
                ) : (
                  <div key={film.id} className="flex flex-col gap-4">
                    {card}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 lg:mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-brand-gold/60 px-8 py-3 font-oswald font-light uppercase tracking-[0.12em] text-[14px] text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark"
          >
            {expanded ? "Show less" : "Show all"}
          </button>
        </div>
      )}
    </section>
  );
}
