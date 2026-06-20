import Link from "next/link";
import ActiveMemberCard from "@/components/ui/ActiveMemberCard";
import GradientDivider from "@/components/ui/GradientDivider";
import { activeMembers, popularThisMonth } from "@/data/communityMembers";
import type { ActiveMember, PopularMember } from "@/types/film";
import { AccentTitle } from "../ui/AccentTitle";
import { getMostActiveUsers, getTrendingUsers } from "@/lib/api/users";
import { optionalData } from "@/lib/api/client";

// Shared card shell (no stroke) used in this section.
// Visible linear gradient: warm gold glow top-left over a warm-dark → near-black
// surface (lighter than the #12100E page). Padding 24 / radius 6 per Figma.
const CARD_CLASS = "rounded-[6px]";
const CARD_BG =
  "linear-gradient(150deg, rgba(210,166,106,0.10) 0%, rgba(210,166,106,0) 42%), linear-gradient(150deg, #2A2219 0%, #1A1613 45%, #141110 100%)";

// Card label — Oswald Light 16, 0.24em (3.84px), MainYellow
const CARD_LABEL =
  "font-oswald font-light uppercase text-brand-gold text-[16px] tracking-[0.24em]";

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8.5L4 21V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function PopularRow({ member, divided }: { member: PopularMember; divided: boolean }) {
  return (
    <>
      {divided && <GradientDivider />}
      <div className="flex items-start gap-4 py-4">
        <span className="font-oswald font-light text-brand-gold text-[24px] leading-none w-8 shrink-0">
          {member.rank}
        </span>
        <div className="flex-1 min-w-0">
          {member.href ? (
            <Link
              href={member.href}
              className="font-manrope font-normal text-brand-light text-[16px] leading-[1.4] transition-colors hover:text-brand-gold"
            >
              {member.username}
            </Link>
          ) : (
            <span className="font-manrope font-normal text-brand-light text-[16px] leading-[1.4]">
              {member.username}
            </span>
          )}
          <p className="mt-1 font-manrope uppercase text-brand-muted text-[11px] leading-[1.4] tracking-[0.12em]">
            {member.quote}
          </p>
        </div>
        <span className="flex items-center gap-1.5 shrink-0 font-manrope text-brand-muted text-[13px] leading-none">
          {member.replies}
          <span className="text-brand-gold">
            <ChatIcon />
          </span>
        </span>
      </div>
    </>
  );
}

export default async function MostActiveMembersSection() {
  const [active, trending] = await Promise.all([
    optionalData(getMostActiveUsers()),
    optionalData(getTrendingUsers()),
  ]);

  const members: ActiveMember[] =
    active && active.members.length > 0
      ? active.members.slice(0, 8).map((u) => ({
          id: u.id,
          username: `@${u.username}`,
          href: `/users/${u.username}`,
          reviews: u.weeklyReviewsCount ?? 0,
          lists: u.weeklyListsCount ?? 0,
        }))
      : activeMembers;

  const popular: PopularMember[] =
    trending && trending.members.length > 0
      ? trending.members.slice(0, 4).map((u, i) => ({
          id: u.id,
          rank: String(i + 1).padStart(2, "0"),
          username: `@${u.username}`,
          href: `/users/${u.username}`,
          quote: `${u.weeklyReviewsCount ?? 0} reviews · ${u.weeklyListsCount ?? 0} lists this week`,
          replies: String(u.weeklyReviewsCount ?? 0),
        }))
      : popularThisMonth;

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header */}
      <div className="section-container mb-8 lg:mb-12">
        <AccentTitle  text="Most Active" accent="Members" />
      </div>

      <div className="section-container grid gap-6 lg:grid-cols-[5fr_2fr]">
        {/* Left — most active members this week (min-w-0 lets the row scroll
            instead of stretching the grid past the page container) */}
        <div className={`${CARD_CLASS} min-w-0 p-6`} style={{ background: CARD_BG }}>
          <h3 className={CARD_LABEL}>Most Active Members This Week</h3>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {members.map((member) => (
              <ActiveMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Right — popular this month */}
        <div className={`${CARD_CLASS} p-6`} style={{ background: CARD_BG }}>
          <h3 className={CARD_LABEL}>Popular This Month</h3>
          <div className="mt-4 flex flex-col">
            {popular.map((member, i) => (
              <PopularRow key={member.id} member={member} divided={i > 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
