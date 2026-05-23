import ActivityCard from "@/components/ui/ActivityCard";
import Pagination from "@/components/ui/Pagination";
import { recentActivity } from "@/data/recentActivity";

export default function RecentActivitySection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <h2 className="mb-6 lg:mb-10 font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Recent <span className="text-brand-gold">Activity</span>
        </h2>

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
