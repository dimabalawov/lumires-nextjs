import ActivityCard from "@/components/ui/ActivityCard";
import Pagination from "@/components/ui/Pagination";
import { AccentTitle } from "../ui/AccentTitle";
import ReviewFilters from "./ReviewFilters";
import type { Review } from "@/types/review";
import { toActivityReview } from "../utils/mappers";

interface Props {
  username: string;
  reviews: Review[];
  page: number;
  totalPages: number;
}

export default function UserReviewsSection({ username, reviews, page, totalPages }: Props) {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle className={"mb-10"} text="Reviews by" accent={username} />

        <ReviewFilters userSection={true} />

        {reviews.length === 0 ? (
          <p className="py-10 text-center font-manrope text-sm text-brand-muted">
            No reviews match these filters yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {reviews.map((review, i) => (
              <ActivityCard key={review.id} review={toActivityReview(review)} divider={i > 0} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="max-w-3xl mx-auto" page={page} totalPages={totalPages} />
        )}
      </div>
    </section>
  );
}