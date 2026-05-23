import BrowseListCard from "@/components/ui/BrowseListCard";
import Pagination from "@/components/ui/Pagination";
import { browseLists } from "@/data/browseLists";

const filterTabs = [
  { id: "all", label: "All Films", active: true },
  { id: "popular", label: "Popular", active: false },
  { id: "top-rated", label: "Top Rated", active: false },
  { id: "new", label: "New Releases", active: false },
  { id: "first-watches", label: "First Watches", active: false },
  { id: "hidden-gems", label: "Hidden Gems", active: false },
];

// Filter styling lifted from AllFilmsSection (films page).
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

export default function BrowseAllListsSection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <h2 className="mb-8 lg:mb-10 font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Browse <span className="text-brand-gold">Lists</span>
        </h2>

        {/* Filter tabs */}
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

        {/* Filter selects */}
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

        {/* Lists grid — 2 columns (5 lists per column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-10 lg:gap-y-14">
          {browseLists.map((list, i) => (
            <BrowseListCard key={list.id} list={list} paletteIndex={i} />
          ))}
        </div>

        <Pagination />
      </div>
    </section>
  );
}
