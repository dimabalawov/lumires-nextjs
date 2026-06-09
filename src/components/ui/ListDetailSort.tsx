"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const LIST_DETAIL_SORTS = [
  { value: "order", label: "List Order" },
  { value: "recent", label: "Most Recent" },
  { value: "title", label: "Title A–Z" },
  { value: "rating", label: "Highest Rated" },
] as const;

export type ListDetailSortValue = (typeof LIST_DETAIL_SORTS)[number]["value"];

const DEFAULT_SORT: ListDetailSortValue = "order";

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

/** URL-driven SORT dropdown for the list-detail grid (resets pagination on change). */
export default function ListDetailSort({ value }: { value: ListDetailSortValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = LIST_DETAIL_SORTS.find((o) => o.value === value) ?? LIST_DETAIL_SORTS[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const apply = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_SORT) params.delete("sort");
      else params.set("sort", next);
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <label className="flex items-center gap-3">
      <span className="uppercase text-brand-muted text-[12px] tracking-[0.18em] font-manrope font-normal">
        Sort
      </span>
      <div ref={rootRef} className="relative inline-block">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="min-w-[176px] flex items-center justify-between gap-4 rounded-[4px] border border-brand-gold/30 bg-[#171411] px-3 py-1.5 text-left font-manrope text-[13px] font-normal uppercase tracking-[0.2em] text-brand-light transition-colors hover:border-brand-gold/60 hover:bg-[#1d1915]"
        >
          <span className="truncate">{selected.label}</span>
          <Chevron open={open} />
        </button>

        {open && (
          <div
            id={menuId}
            role="listbox"
            className="min-w-[176px] absolute right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[4px] border border-brand-gold/35 bg-[#171411] py-1 shadow-[0_18px_36px_rgba(0,0,0,0.42)]"
          >
            {LIST_DETAIL_SORTS.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    apply(option.value);
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
    </label>
  );
}
