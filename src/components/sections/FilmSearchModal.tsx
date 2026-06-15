"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { searchFilms } from "@/lib/api/search.client";
import type { ExternalFilmShort } from "@/types/search";
import { genreNames } from "@/types/film";
import { settingsInputClass } from "../ui/SettingsControls";

export default function FilmSearchModal({
  onSelect,
  onClose,
  excludeIds = [],
}: {
  onSelect: (film: ExternalFilmShort) => void;
  onClose: () => void;
  excludeIds?: number[];
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<ExternalFilmShort[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    const q = term.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const films = await searchFilms(q);
        setResults(films.filter((f) => !excludeIds.includes(f.externalId)));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [term, excludeIds]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-brand-gold/20 bg-[#15120F] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-oswald text-[20px] text-brand-light">Add a favorite</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-brand-muted hover:text-brand-light"
          >
            ×
          </button>
        </div>

        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search films…"
          className={`${settingsInputClass} mt-4`}
        />

        <div className="mt-4 max-h-[50vh] overflow-y-auto">
          {loading && (
            <p className="py-6 text-center font-manrope text-sm text-brand-muted">Searching…</p>
          )}
          {!loading && term.trim() && results.length === 0 && (
            <p className="py-6 text-center font-manrope text-sm text-brand-muted">No films found.</p>
          )}
          <ul className="flex flex-col gap-1">
            {results.map((film) => {
              const genres = genreNames(film.genreIds).slice(0, 2).join(", ");
              return (
                <li key={film.externalId}>
                  <button
                    type="button"
                    onClick={() => onSelect(film)}
                    className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-brand-gold/10"
                  >
                    <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-sm bg-white/5">
                      {film.posterPath && (
                        <Image
                          src={film.posterPath}
                          alt=""
                          fill
                          unoptimized
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="min-w-0">
                      <span className="block truncate font-manrope text-sm text-brand-light">
                        {film.title}
                      </span>
                      <span className="font-manrope text-xs text-brand-muted">
                        {[film.releaseYear, genres || null].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}