import ActivityCard from "@/components/ui/ActivityCard";
import Pagination from "@/components/ui/Pagination";
import { recentActivity } from "@/data/recentActivity";

const filterTabs = [
  { id: "all", label: "All Reviews", active: true },
  { id: "friends", label: "From Friends", active: false },
  { id: "popular", label: "Popular", active: false },
  { id: "long-form", label: "Long-form", active: false },
  { id: "first-watches", label: "First Watches", active: false },
  { id: "spoiler-free", label: "Spoiler-free", active: false },
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

export default function BrowseAllReviewsSection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <h2 className="mb-8 lg:mb-10 font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Browse <span className="text-brand-gold">All Reviews</span>
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

        {/* Review feed */}
        <div className="flex flex-col">
          {recentActivity.map((review, i) => (
            <ActivityCard key={review.id} review={review} divider={i > 0} />
          ))}
        </div>

        <Pagination className="max-w-3xl mx-auto" />
      </div>
    </section>
  );
}
