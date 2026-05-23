// Presentational pagination (static demo) shared by the films archive and review feeds.
export default function Pagination({ className = "" }: { className?: string }) {
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
