import { UserProfileSummary } from "@/types/profile";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <li className="flex items-center justify-between py-3 border-b border-brand-gold/15 last:border-b-0">
      <span className="font-manrope font-normal text-brand-light/85 text-[14px] tracking-[0.04em]">
        {label}
      </span>
      <span className="font-oswald font-light text-brand-gold text-[18px] tracking-[0.04em]">
        {value}
      </span>
    </li>
  );
}

export default function AtAGlanceCard({ stats }: { stats: UserProfileSummary }) {
  return (
    <div className="rounded-md px-6 py-6" style={{ background: CARD_BG }}>
      <h2 className="font-oswald font-light uppercase text-brand-gold text-[15px] tracking-[0.22em]">
        At a Glance
      </h2>
      <ul className="mt-1 flex flex-col">
        <StatRow label="Total films rated" value={stats.totalFilmsRated} />
        <StatRow label="Lists created" value={stats.listsCreated} />
        <StatRow label="Reviews written" value={stats.reviewsWritten} />
        <StatRow label="Joined" value={stats.joinedAt} />
      </ul>
    </div>
  );
}
