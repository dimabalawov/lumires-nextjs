import ActivityCard from "@/components/ui/ActivityCard";
import Pagination from "@/components/ui/Pagination";
import { recentActivity } from "@/data/recentActivity";
import { AccentTitle } from "../ui/AccentTitle";

export default function RecentActivitySection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <AccentTitle text="Recent" accent="Activity" />

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
