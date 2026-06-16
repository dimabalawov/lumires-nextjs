import Link from "next/link";
import type { CommunityThread } from "@/types/film";
import CommunityThreadCard from "@/components/ui/CommunityThreadCard";

function ReviewColumn({ reviews, isAuthed }: { reviews: CommunityThread[]; isAuthed: boolean }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8">
      {reviews.map((review) => (
        <CommunityThreadCard key={review.id} thread={review} isAuthed={isAuthed} />
      ))}
    </div>
  );
}

/** Numbered page links. Each link sets ?reviewsPage=N and jumps back to the
 *  reviews anchor so the server re-renders this section for the chosen page. */
function ReviewsPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const linkBase =
    "inline-flex h-9 min-w-9 items-center justify-center px-3 font-manrope text-sm tracking-[0.06em] rounded transition-colors";

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Reviews pagination"
    >
      {currentPage > 1 && (
        <Link
          href={`?reviewsPage=${currentPage - 1}#reviews`}
          className={`${linkBase} text-brand-muted hover:text-brand-light`}
        >
          ← Prev
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`?reviewsPage=${p}#reviews`}
          aria-current={p === currentPage ? "page" : undefined}
          className={`${linkBase} ${
            p === currentPage
              ? "bg-brand-gold/15 text-brand-gold"
              : "text-brand-muted hover:text-brand-light"
          }`}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`?reviewsPage=${currentPage + 1}#reviews`}
          className={`${linkBase} text-brand-muted hover:text-brand-light`}
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

interface FilmReviewsSectionProps {
  reviews: CommunityThread[];
  isAuthed?: boolean;
  /** Current reviews page (1-based) — used to drive the pagination control. */
  currentPage?: number;
  /** Total number of review pages reported by the API. */
  totalPages?: number;
}

export default function FilmReviewsSection({
  reviews,
  isAuthed = false,
  currentPage = 1,
  totalPages = 1,
}: FilmReviewsSectionProps) {
  if (reviews.length === 0) return null;

  const mid = Math.ceil(reviews.length / 2);
  const left = reviews.slice(0, mid);
  const right = reviews.slice(mid);

  return (
    <section id="reviews" className="section-container pb-24 scroll-mt-28">
      <div className="mb-8 lg:mb-12">
        <h2 className="font-manrope font-light text-[28px] lg:text-[48px] leading-[1.2em] tracking-[0.02em] text-[#DCD8D3] opacity-90">
          Reviews
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <ReviewColumn reviews={left} isAuthed={isAuthed} />
        <ReviewColumn reviews={right} isAuthed={isAuthed} />
      </div>
      <ReviewsPagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
