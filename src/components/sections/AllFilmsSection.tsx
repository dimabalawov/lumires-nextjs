import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import { allFilms } from "@/data/allFilms";

const filterTabs = [
  { id: "all", label: "All Films", active: true },
  { id: "popular", label: "Popular", active: false },
  { id: "top-rated", label: "Top Rated", active: false },
  { id: "new", label: "New Releases", active: false },
  { id: "first-watches", label: "First Watches", active: false },
  { id: "hidden-gems", label: "Hidden Gems", active: false },
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

export default function AllFilmsSection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <div className="mb-6 flex flex-wrap items-center gap-2 lg:gap-3">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                tab.active
                  ? "border border-brand-gold/45 text-brand-gold uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px]"
                  : "border border-transparent text-brand-light hover:opacity-70 uppercase font-manrope font-normal text-[13px] tracking-[0.2em] px-[18px] py-[10px] rounded-[4px] transition-opacity"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-10 lg:mb-12 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3">
            <span className={labelClass}>Rating</span>
            <span className="relative inline-block">
              <select className={selectClass} defaultValue="all">
                <option value="all">All</option>
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★+</option>
              </select>
              {chevron}
            </span>
          </label>

          <label className="flex items-center gap-3">
            <span className={labelClass}>Genres</span>
            <span className="relative inline-block">
              <select className={selectClass} defaultValue="all">
                <option value="all">All</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="drama">Drama</option>
                <option value="thriller">Thriller</option>
                <option value="comedy">Comedy</option>
              </select>
              {chevron}
            </span>
          </label>

          <label className="flex items-center gap-3">
            <span className={labelClass}>Sort</span>
            <span className="relative inline-block">
              <select className={selectClass} defaultValue="recent">
                <option value="recent">Most Recent</option>
                <option value="top">Top Rated</option>
                <option value="oldest">Oldest</option>
              </select>
              {chevron}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {allFilms.map((film) => (
            <EditorialPosterCard key={film.id} film={film} />
          ))}
        </div>

        <nav
          aria-label="Pagination"
          className="mt-12 lg:mt-16 flex items-center justify-between gap-4"
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
      </div>
    </section>
  );
}
