import ActivityCard from "@/components/ui/ActivityCard";
import Pagination from "@/components/ui/Pagination";
import { recentActivity } from "@/data/recentActivity";
import { AccentTitle } from "../ui/AccentTitle";
import ReviewFilters from "./ReviewFilters";
import { getReviews } from "@/lib/api/reviews";
import { optionalData } from "@/lib/api/client";
import { toActivityReview } from "../utils/mappers";

interface Props {
  searchParams?: Record<string, string | undefined>;
}

export default async function BrowseAllReviewsSection({ searchParams = {} }: Props) {
  const page = Number(searchParams.page ?? 1);

  const data = await optionalData(
    getReviews(undefined, {
      category: searchParams.category ? Number(searchParams.category) : undefined,
      filter: searchParams.filter ? Number(searchParams.filter) : undefined,
      sortBy: searchParams.sortBy ? Number(searchParams.sortBy) : undefined,
      page,
      pageSize: 6,
    }),
  );

  const reviews = data ? data.results.map(toActivityReview) : recentActivity;
  const totalPages = data?.totalPages ?? 0;

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle text="Browse" accent="All Reviews" />

        <div className="mt-6">
          <ReviewFilters />
        </div>

        {reviews.length === 0 ? (
          <p className="py-10 text-center font-manrope text-sm text-brand-muted">
            No reviews match these filters yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {reviews.map((review, i) => (
              <ActivityCard key={review.id} review={review} divider={i > 0} />
            ))}
          </div>
        )}

        <Pagination className="max-w-3xl mx-auto" page={data ? page : undefined} totalPages={data ? totalPages : undefined} />
      </div>
    </section>
  );
}
