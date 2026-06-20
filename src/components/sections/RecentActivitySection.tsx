import ActivityCard from "@/components/ui/ActivityCard";
import { recentActivity } from "@/data/recentActivity";
import { AccentTitle } from "../ui/AccentTitle";
import { getRecentReviews } from "@/lib/api/reviews";
import { optionalData } from "@/lib/api/client";
import { toActivityReview } from "../utils/mappers";

export default async function RecentActivitySection() {
  const data = await optionalData(getRecentReviews({ page: 1, pageSize: 6 }));
  const reviews =
    data && data.results.length > 0
      ? data.results.map(toActivityReview)
      : recentActivity;

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle text="Recent" accent="Activity" />

        <div className="flex flex-col">
          {reviews.map((review, i) => (
            <ActivityCard key={review.id} review={review} divider={i > 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
