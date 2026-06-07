"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  className?: string;
  /** Current 1-based page. Omit for the static demo (review/list feeds). */
  page?: number;
  /** Total page count. When provided, pagination becomes URL-driven. */
  totalPages?: number;
}

// Build a windowed list of pages: 1 … around-current … last, with `null` gaps.
function pageWindow(current: number, total: number): (number | null)[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push(null);
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({ className = "", page, totalPages }: PaginationProps) {
  // Static presentational fallback (review/list feeds that don't pass props).
  // Renders no hooks, so it stays prerenderable without a Suspense boundary.
  if (page === undefined || totalPages === undefined) {
    return (
      <nav
        aria-label="Pagination"
        className={`mt-12 lg:mt-16 flex items-center justify-between gap-4 ${className}`}
      >
        <button
          type="button"
          disabled
          className="uppercase text-brand-muted font-oswald font-light text-[13px] tracking-[0.12em] flex items-center gap-2 border border-brand-gold/20 rounded-sm px-4 py-2 opacity-50 cursor-not-allowed"
        >
          <span>←</span>
          <span>Previous</span>
        </button>
        <ol className="flex items-center gap-2 sm:gap-3">
          <li>
            <button
              type="button"
              aria-current="page"
              className="h-8 w-8 flex items-center justify-center rounded-sm bg-brand-gold text-brand-dark font-oswald font-medium text-[14px]"
            >
              1
            </button>
          </li>
          <li>
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-center rounded-sm text-brand-muted hover:text-brand-light font-oswald font-light text-[14px] transition-colors"
            >
              2
            </button>
          </li>
          <li>
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-center rounded-sm text-brand-muted hover:text-brand-light font-oswald font-light text-[14px] transition-colors"
            >
              3
            </button>
          </li>
          <li aria-hidden className="px-1 text-brand-muted font-oswald font-light text-[14px]">
            …
          </li>
          <li>
            <button
              type="button"
              className="h-8 px-2 flex items-center justify-center rounded-sm text-brand-muted hover:text-brand-light font-oswald font-light text-[14px] transition-colors"
            >
              128
            </button>
          </li>
        </ol>
        <button
          type="button"
          className="uppercase text-brand-light hover:opacity-70 font-oswald font-light text-[13px] tracking-[0.12em] flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold/60 rounded-sm px-4 py-2 transition-all"
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </nav>
    );
  }

  if (totalPages <= 1) return null;

  // useSearchParams() forces a client-side bailout, so the URL-driven nav
  // must sit behind a Suspense boundary to stay prerenderable.
  return (
    <Suspense>
      <PaginationNav className={className} page={page} totalPages={totalPages} />
    </Suspense>
  );
}

function PaginationNav({
  className = "",
  page,
  totalPages,
}: {
  className?: string;
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const window = pageWindow(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={`mt-12 lg:mt-16 flex items-center justify-between gap-4 ${className}`}
    >
      {hasPrev ? (
        <Link
          href={hrefFor(page - 1)}
          scroll={false}
          className="uppercase text-brand-light hover:opacity-70 font-oswald font-light text-[13px] tracking-[0.12em] flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold/60 rounded-sm px-4 py-2 transition-all"
        >
          <span>←</span>
          <span>Previous</span>
        </Link>
      ) : (
        <span className="uppercase text-brand-muted font-oswald font-light text-[13px] tracking-[0.12em] flex items-center gap-2 border border-brand-gold/20 rounded-sm px-4 py-2 opacity-50 cursor-not-allowed">
          <span>←</span>
          <span>Previous</span>
        </span>
      )}

      <ol className="flex items-center gap-2 sm:gap-3">
        {window.map((p, i) =>
          p === null ? (
            <li
              key={`gap-${i}`}
              aria-hidden
              className="px-1 text-brand-muted font-oswald font-light text-[14px]"
            >
              …
            </li>
          ) : p === page ? (
            <li key={p}>
              <span
                aria-current="page"
                className="h-8 min-w-8 px-2 flex items-center justify-center rounded-sm bg-brand-gold text-brand-dark font-oswald font-medium text-[14px]"
              >
                {p}
              </span>
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                scroll={false}
                className="h-8 min-w-8 px-2 flex items-center justify-center rounded-sm text-brand-muted hover:text-brand-light font-oswald font-light text-[14px] transition-colors"
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ol>

      {hasNext ? (
        <Link
          href={hrefFor(page + 1)}
          scroll={false}
          className="uppercase text-brand-light hover:opacity-70 font-oswald font-light text-[13px] tracking-[0.12em] flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold/60 rounded-sm px-4 py-2 transition-all"
        >
          <span>Next</span>
          <span>→</span>
        </Link>
      ) : (
        <span className="uppercase text-brand-muted font-oswald font-light text-[13px] tracking-[0.12em] flex items-center gap-2 border border-brand-gold/20 rounded-sm px-4 py-2 opacity-50 cursor-not-allowed">
          <span>Next</span>
          <span>→</span>
        </span>
      )}
    </nav>
  );
}
