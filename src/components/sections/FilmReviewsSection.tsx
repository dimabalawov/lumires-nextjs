import Link from "next/link";
import type { CommunityThread } from "@/types/film";
import ThreadCard from "@/components/ui/ThreadCard";

function ReviewColumn({ reviews }: { reviews: CommunityThread[] }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8">
      {reviews.map((review) => (
        <ThreadCard key={review.id} thread={review} />
      ))}
    </div>
  );
}

interface FilmReviewsSectionProps {
  reviews: CommunityThread[];
  showAllHref?: string;
}

export default function FilmReviewsSection({ reviews, showAllHref = "#" }: FilmReviewsSectionProps) {
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
        <Link
          href={showAllHref}
          className="uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2"
        >
          show all →
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <ReviewColumn reviews={left} />
        <ReviewColumn reviews={right} />
      </div>
    </section>
  );
}
