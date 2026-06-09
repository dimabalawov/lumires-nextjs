"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ListCategoryFilter, ListSortOrder } from "@/types/api";

// ContentFilterEnum4 — sent as a string. "all" is the default (omitted from URL).
const filterTabs: { value: ListCategoryFilter; label: string }[] = [
  { value: "all", label: "All Lists" },
  { value: "trending", label: "Trending" },
  { value: "recentlyUpdated", label: "Recently Updated" },
  { value: "editorPicks", label: "Editor Picks" },
  { value: "newLists", label: "New Lists" },
  { value: "friendsLists", label: "From Friends" },
];

// ListContentOrderEnum — "mostRecent" is the default (omitted from URL).
const sortOptions: { value: ListSortOrder; label: string }[] = [
  { value: "mostRecent", label: "Most Recent" },
  { value: "mostPopular", label: "Most Popular" },
  { value: "mostFilms", label: "Most Films" },
];

const DEFAULT_CATEGORY: ListCategoryFilter = "all";
const DEFAULT_SORT: ListSortOrder = "mostRecent";

const labelClass =
  "uppercase text-brand-muted text-[12px] tracking-[0.18em] font-manrope font-normal";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className={`pointer-events-none h-2 w-3 text-brand-muted transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

interface FilterSelectOption {
  value: string;
  label: string;
}

function FilterSelect({
  value,
  options,
  minWidth = "min-w-[176px]",
  onChange,
}: {
  value: string;
  options: FilterSelectOption[];
  minWidth?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((next) => !next)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className={`${minWidth} flex items-center justify-between gap-4 rounded-[4px] border border-brand-gold/30 bg-[#171411] px-3 py-1.5 text-left font-manrope text-[13px] font-normal uppercase tracking-[0.2em] text-brand-light shadow-[0_0_0_1px_rgba(18,16,14,0.7)] transition-colors hover:border-brand-gold/60 hover:bg-[#1d1915] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand-gold/70`}
      >
        <span className="truncate">{selected?.label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          id={menuId}
          role="listbox"
          className={`${minWidth} absolute left-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[4px] border border-brand-gold/35 bg-[#171411] py-1 shadow-[0_18px_36px_rgba(0,0,0,0.42)]`}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left font-manrope text-[12px] font-normal uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "bg-brand-gold text-brand-dark"
                    : "text-brand-light/82 hover:bg-brand-gold/12 hover:text-brand-gold"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface ListFiltersValue {
  category: ListCategoryFilter;
  sortBy: ListSortOrder;
}

export default function ListFilters({ value }: { value: ListFiltersValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update one key, drop the value when it's the default to keep URLs tidy, and
  // reset pagination whenever a filter changes.
  const apply = useCallback(
    (key: string, next: string, defaultValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === defaultValue) params.delete(key);
      else params.set(key, next);
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
          const active = tab.value === value.category;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => apply("category", tab.value, DEFAULT_CATEGORY)}
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
          <span className={labelClass}>Sort</span>
          <FilterSelect
            value={value.sortBy}
            options={sortOptions}
            onChange={(next) => apply("sortBy", next, DEFAULT_SORT)}
          />
        </label>
      </div>
    </>
  );
}
