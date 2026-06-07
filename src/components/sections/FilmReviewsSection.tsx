import Link from "next/link";
import type { CommunityThread } from "@/types/film";
import ThreadCard from "@/components/ui/ThreadCard";
import WriteReviewModal from "@/components/ui/WriteReviewModal";

function ReviewColumn({ reviews, isAuthed }: { reviews: CommunityThread[]; isAuthed: boolean }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8">
      {reviews.map((review) => (
        <ThreadCard key={review.id} thread={review} isAuthed={isAuthed} />
      ))}
    </div>
  );
}

interface FilmReviewsSectionProps {
  reviews: CommunityThread[];
  showAllHref?: string;
  isAuthed?: boolean;
  /** When set, render the "write a review" modal trigger in the header. */
  filmId?: string;
  slug?: string;
}

export default function FilmReviewsSection({
  reviews,
  showAllHref = "#",
  isAuthed = false,
  filmId,
  slug = "-",
}: FilmReviewsSectionProps) {
  if (reviews.length === 0) return null;

  const mid = Math.ceil(reviews.length / 2);
  const left = reviews.slice(0, mid);
  const right = reviews.slice(mid);

  return (
    <section className="section-container pb-24">
      <div className="mb-8 lg:mb-12 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
        <h2 className="font-manrope font-light text-[28px] lg:text-[48px] leading-[1.2em] tracking-[0.02em] text-[#DCD8D3] opacity-90">
          Reviews
        </h2>
        <div className="flex items-center gap-6 sm:mb-2">
          {filmId && <WriteReviewModal filmId={filmId} slug={slug} isAuthed={isAuthed} />}
          <Link
            href={showAllHref}
            className="uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity"
          >
            show all →
          </Link>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <ReviewColumn reviews={left} isAuthed={isAuthed} />
        <ReviewColumn reviews={right} isAuthed={isAuthed} />
      </div>
    </section>
  );
}
