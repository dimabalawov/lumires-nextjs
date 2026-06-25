import { UserStatistics } from "@/types/profile";
import type { ReactNode } from "react";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

function toStars(rating: number): string {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return "★".repeat(full) + (hasHalf ? "½" : "");
}

function StatColumn({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="flex flex-col">
      <h3
        className="mb-4 text-[18px] font-manrope font-normal uppercase leading-9 tracking-[3%]
        text-profile-accent"
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-brand-light font-manrope font-normal text-[18px] leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UserStatisticsSection({ stats }: { stats: UserStatistics }) {
  const ratingsByFrequency = Object.entries(stats.averageRatings)
    .sort(([, a], [, b]) => b - a)
    .map(([rating]) => Number(rating));

  return (
    <section className="w-full">
      <div
        className="flex flex-col lg:grid lg:grid-cols-4 gap-9 rounded-xl p-10"
        style={{ background: CARD_BG, border: "1px solid rgba(210,166,106,0.12)" }}
      >
        <StatColumn title="Most-Watched Directors" items={stats.mostWatchedDirectors} />
        <StatColumn title="Most-Watched Decades" items={stats.mostWatchedDecades} />
        <StatColumn title="Most-Watched Genres" items={stats.mostWatchedGenres} />
        <StatColumn
          title="Average Ratings"
          items={ratingsByFrequency.map((r) => (
            <span className="tracking-wide">{toStars(r)}</span>
          ))}
        />
      </div>
    </section>
  );
}