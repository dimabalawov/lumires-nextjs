"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Content tabs map 1:1 to FilmContentFilter (0 = All … 5 = HiddenGems).
const filterTabs = [
  { value: 0, label: "All Films" },
  { value: 1, label: "Popular" },
  { value: 2, label: "Top Rated" },
  { value: 3, label: "New Releases" },
  { value: 4, label: "First Watches" },
  { value: 5, label: "Hidden Gems" },
];

// RatingEnum (0 = All … 4 = UnderThree).
const ratingOptions = [
  { value: 0, label: "All" },
  { value: 1, label: "4.5★+" },
  { value: 2, label: "4★" },
  { value: 3, label: "3★" },
  { value: 4, label: "Under 3★" },
];

// FilmContentOrder (0 = MostRecent … 4 = LeastRated).
const sortOptions = [
  { value: 0, label: "Most Recent" },
  { value: 1, label: "Most Liked" },
  { value: 2, label: "Most Replies" },
  { value: 3, label: "Highest Rated" },
  { value: 4, label: "Least Rated" },
];

const selectClass =
  "appearance-none bg-transparent border border-brand-gold/30 rounded-[4px] pl-3 pr-8 py-1.5 text-brand-light font-manrope font-normal text-[13px] tracking-[0.2em] uppercase cursor-pointer hover:border-brand-gold/60 transition-colors";

const labelClass =
  "uppercase text-brand-muted text-[12px] tracking-[0.18em] font-manrope font-normal";

const chevron = (
  <svg
    aria-hidden
    viewBox="0 0 12 8"
    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-2 w-3 text-brand-muted"
  >
    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export interface FilmFiltersValue {
  content: number;
  rating: number;
  sortBy: number;
  genre: string; // "" = all
}

interface FilmFiltersProps {
  value: FilmFiltersValue;
  genres: string[];
}

export default function FilmFilters({ value, genres }: FilmFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build the next URL: update one key, drop defaults to keep URLs tidy, and
  // reset pagination whenever a filter changes.
  const apply = useCallback(
    (key: string, next: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      const str = String(next);
      if (str === "" || str === "0") params.delete(key);
      else params.set(key, str);
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2 lg:gap-3">
        {filterTabs.map((tab) => {
          const active = tab.value === value.content;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => apply("content", tab.value)}
              className={
                active
                  ? "border border-brand-gold/45 text-brand-gold uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px]"
                  : "border border-transparent text-brand-light hover:opacity-70 uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px] transition-opacity"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-10 lg:mb-12 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-3">
          <span className={labelClass}>Rating</span>
          <span className="relative inline-block">
            <select
              className={selectClass}
              value={value.rating}
              onChange={(e) => apply("rating", Number(e.target.value))}
            >
              {ratingOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {chevron}
          </span>
        </label>

        <label className="flex items-center gap-3">
          <span className={labelClass}>Genres</span>
          <span className="relative inline-block">
            <select
              className={selectClass}
              value={value.genre}
              onChange={(e) => apply("genres", e.target.value)}
            >
              <option value="">All</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {chevron}
          </span>
        </label>

        <label className="flex items-center gap-3">
          <span className={labelClass}>Sort</span>
          <span className="relative inline-block">
            <select
              className={selectClass}
              value={value.sortBy}
              onChange={(e) => apply("sortBy", Number(e.target.value))}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {chevron}
          </span>
        </label>
      </div>
    </>
  );
}
