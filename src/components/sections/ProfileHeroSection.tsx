import Image from "next/image";
import Link from "next/link";
import type { UserProfile, UserProfileStats } from "@/types/film";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

const DIVIDER_BG =
  "linear-gradient(90deg, rgba(155,143,132,0) 0%, rgba(155,143,132,0.55) 50%, rgba(155,143,132,0) 100%)";

const TABS = [
  { key: "profile", label: "profile" },
  { key: "lists", label: "lists" },
  { key: "activity", label: "activity" },
  { key: "reviews", label: "reviews" },
  { key: "likes", label: "likes" },
  { key: "whatchlist", label: "whatchlist" },
];

function StatRow({ label, value }: { label: string; value: string }) {
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

function AtAGlanceCard({ stats }: { stats: UserProfileStats }) {
  return (
    <div className="rounded-[6px] px-6 py-6" style={{ background: CARD_BG }}>
      <h2 className="font-oswald font-light uppercase text-brand-gold text-[15px] tracking-[0.22em]">
        At a Glance
      </h2>
      <ul className="mt-1 flex flex-col">
        <StatRow label="Total films rated" value={stats.totalFilmsRated} />
        <StatRow label="Lists created" value={stats.listsCreated} />
        <StatRow label="Reviews written" value={stats.reviewsWritten} />
        <StatRow label="Joined" value={stats.joined} />
      </ul>
    </div>
  );
}

function MobileCountBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-oswald font-light text-brand-light text-[22px] leading-none">
        {value}
      </span>
      <span className="font-manrope font-normal uppercase text-brand-muted text-[10px] tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}

export default function ProfileHeroSection({
  profile,
  activeTab = "profile",
}: {
  profile: UserProfile;
  activeTab?: string;
}) {
  return (
    <section className="section-container pt-4 lg:pt-12 pb-8 lg:pb-12">
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left column: avatar + content stack (mobile) / avatar + content side-by-side (desktop) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
          {/* Avatar */}
          <div className="flex justify-center lg:block">
            <div className="relative aspect-square w-[140px] sm:w-[160px] lg:w-[200px] overflow-hidden rounded-full ring-1 ring-brand-gold/60">
              <Image
                src={profile.avatarUrl}
                alt={profile.username}
                fill
                priority
                sizes="(min-width: 1024px) 200px, 160px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Username / tagline / bio / mobile-only stats + at-a-glance */}
          <div className="mt-6 lg:mt-0 flex-1 w-full min-w-0 flex flex-col">
            {/* Username row — inline Follow on mobile */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-oswald font-normal text-brand-light text-[24px] leading-[32px] lg:text-[44px] lg:leading-[52px] tracking-[0.02em]">
                {profile.username}
              </h1>
              <button
                type="button"
                className="lg:hidden shrink-0 rounded-[6px] bg-brand-gold text-brand-dark font-manrope font-medium uppercase tracking-[0.08em] text-[13px] px-5 py-2 hover:opacity-90 transition-opacity"
              >
                Follow
              </button>
            </div>

            {/* Tagline — sentence-case muted on mobile, uppercase gold on desktop */}
            <p className="mt-3 font-manrope font-normal text-brand-light/80 text-[14px] leading-[20px] tracking-[0.02em] lg:font-oswald lg:font-light lg:uppercase lg:text-brand-gold lg:text-[16px] lg:leading-normal lg:tracking-[0.24em]">
              {profile.tagline}
            </p>

            {/* Bio */}
            <p className="mt-5 font-manrope font-normal text-auth-subtitle text-[14px] leading-[24px] tracking-[0.06em] whitespace-pre-line max-w-[640px]">
              {profile.bio}
            </p>

            {/* Mobile stats row */}
            <div className="lg:hidden mt-6">
              <div className="h-px w-full" style={{ background: DIVIDER_BG }} />
              <div className="grid grid-cols-3 gap-2 py-5">
                <MobileCountBlock value={profile.followers} label="Followers" />
                <MobileCountBlock value={profile.following} label="Following" />
                <MobileCountBlock value={profile.friends} label="Friends" />
              </div>
              <div className="h-px w-full" style={{ background: DIVIDER_BG }} />
            </div>

            {/* Mobile At a Glance */}
            <div className="lg:hidden mt-5">
              <AtAGlanceCard stats={profile.stats} />
            </div>
          </div>
        </div>

        {/* Desktop right rail */}
        <div className="hidden lg:flex flex-col gap-6 self-start">
          <div>
            <button
              type="button"
              className="w-full rounded-[4px] bg-brand-gold text-brand-dark font-oswald font-normal uppercase tracking-[0.13em] text-[24px] py-4 hover:opacity-90 transition-opacity"
            >
              Follow
            </button>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-oswald font-light uppercase text-brand-gold text-[13px] tracking-[0.18em]">
                <span className="text-brand-light font-normal text-[15px] mr-1.5">
                  {profile.followers}
                </span>
                Followers
              </span>
              <span className="font-oswald font-light uppercase text-brand-gold text-[13px] tracking-[0.18em]">
                <span className="text-brand-light font-normal text-[15px] mr-1.5">
                  {profile.following}
                </span>
                Followings
              </span>
            </div>
          </div>
          <AtAGlanceCard stats={profile.stats} />
        </div>
      </div>

      {/* Tabs row */}
      <nav className="mt-8 lg:mt-14">
        <div className="hidden lg:block h-px w-full" style={{ background: DIVIDER_BG }} />
        <div className="overflow-x-auto scrollbar-hide -mx-[3%] sm:mx-0">
          <ul className="flex items-center justify-start lg:justify-center gap-2 sm:gap-4 lg:gap-8 py-4 lg:py-5 px-[3%] sm:px-0 min-w-max lg:min-w-0">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              const href = tab.key === "profile" ? `/profile/${profile.slug}` : `/profile/${profile.slug}/${tab.key}`;
              return (
                <li key={tab.key}>
                  <Link
                    href={href}
                    className={[
                      "inline-flex items-center justify-center font-manrope text-[14px] lg:text-[15px] tracking-[0.04em] px-5 py-2 rounded-full transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-brand-gold text-brand-dark font-medium"
                        : "text-brand-light/80 hover:text-brand-light",
                    ].join(" ")}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden lg:block h-px w-full" style={{ background: DIVIDER_BG }} />
      </nav>
    </section>
  );
}
