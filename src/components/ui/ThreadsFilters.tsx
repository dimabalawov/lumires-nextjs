"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterTabs } from "../ui/FilterTabs";

// Values match the THREADS backend ContentFilterEnum:
//   All = 0, LongForm = 1, FromFriends = 2, SpoilerFree = 3
// NOTE: this is NOT the same order as the shared @/types/api ContentFilterEnum
// used by reviews (there LongForm/FromFriends are swapped), so don't import that
// one here — the integers would be wrong.
const categoryTabs = [
  { value: 0, label: "All Threads" },
  { value: 1, label: "Long-form" },
  { value: 2, label: "From Friends" },
  { value: 3, label: "Spoiler-free" },
];

// ContentOrderEnum: MostRecent = 0, MostLiked = 1, MostReplies = 2.
// The threads backend only sorts by these three.
const sortOptions = [
  { value: 0, label: "Most Recent" },
  { value: 1, label: "Most Liked" },
  { value: 2, label: "Most Replies" },
];

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
  minWidth = "min-w-[130px]",
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
        className={`${minWidth} flex items-center justify-between gap-4 rounded-sm border border-brand-gold/30 bg-[#171411] px-3 py-1.5 text-left font-manrope text-[13px] font-normal uppercase tracking-[0.2em] text-brand-light shadow-[0_0_0_1px_rgba(18,16,14,0.7)] transition-colors hover:border-brand-gold/60 hover:bg-[#1d1915] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand-gold/70`}
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

export interface ThreadFiltersValue {
  category: number;
  sortBy: number;
}

export default function ThreadFilters({ value }: { value: ThreadFiltersValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        <FilterTabs
          tabs={categoryTabs}
          active={value.category}
          onChange={(v) => apply("category", v)}
        />
      </div>

      <div className="mb-10 lg:mb-12 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-3">
          <span className={labelClass}>Sort</span>
          <FilterSelect
            value={String(value.sortBy)}
            options={sortOptions.map((o) => ({ value: String(o.value), label: o.label }))}
            minWidth="min-w-[176px]"
            onChange={(next) => apply("sortBy", Number(next))}
          />
        </label>
      </div>
    </>
  );
}