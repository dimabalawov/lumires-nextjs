"use client";

import Image from "next/image";
import Link from "next/link";
import { RelationshipStatus, RelationshipType, UserProfileSummary, type Pronouns, type UserProfile } from "@/types/profile";
import ProfileActionButton from "../ui/ProfileActionButton";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";
const DIVIDER_BG =
  "linear-gradient(90deg, rgba(155,143,132,0) 0%, rgba(155,143,132,0.55) 50%, rgba(155,143,132,0) 100%)";

const TABS = [
  { key: "profile", label: "profile" },
  { key: "reviews", label: "reviews" },
  { key: "threads", label: "threads" },
  { key: "lists", label: "lists" },
  { key: "likes", label: "likes" },
  { key: "watchlist", label: "watchlist" },
];


function formatCompact(n?: number) {
  if (n == null) return "0";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString("en-US");
}

function formatFull(n?: number) {
  if (n == null) return "0";
  return n.toLocaleString("en-US");
}

function formatJoined(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function GlanceStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5 px-5">
      <span className="font-oswald font-light text-brand-gold text-[22px] leading-none">{value}</span>
      <span className="font-mono font-normal uppercase text-brand-muted text-[10px] tracking-[1px] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function MobileCountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-oswald font-light text-brand-light text-[22px] leading-none">
        {formatCompact(value)}
      </span>
      <span className="font-manrope font-normal uppercase text-brand-muted text-[10px] tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}

export default function ProfileHeroSection({
  profile,
  summary,
}: {
  profile: UserProfile;
  summary: UserProfileSummary;
}) {
  const profileSlug = profile.username || "";

  const prevRel = useRef({
    following:
      profile.outgoingRelationship?.type === RelationshipType.Follow &&
      profile.outgoingRelationship?.status === RelationshipStatus.Accepted,
    blocked: profile.outgoingRelationship?.type === RelationshipType.Block,
  });

  const [followers, setFollowers] = useState(profile.followers);
  const [blocked, setBlocked] = useState(prevRel.current.blocked);

  function handleRelationshipChange(next: { following: boolean; blocked: boolean }) {
    if (next.following !== prevRel.current.following) {
      setFollowers((c) => c + (next.following ? 1 : -1));
    }
    if (next.blocked !== prevRel.current.blocked) {
      setBlocked(next.blocked);
    }
    prevRel.current = next;
  }


  const tabCounts: Record<string, number | undefined> = {
    reviews: profile.reviewsWritten,
    threads: profile.threadsWritten,
    lists: profile.listsCreated,
    likes: summary.likesCount,
    watchlist: summary.watchlistFilms,
  };

  const pathname = usePathname();

  const activeTab = (() => {
    if (!pathname) return "profile";
    const parts = pathname.split("/");
    const last = parts[parts.length - 1];
    return TABS.some((t) => t.key === last) ? last : "profile";
  })();

  return (
    <section className="section-container pt-4 lg:pt-12 pb-8 lg:pb-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-col lg:flex-row lg:items-start lg:gap-10">
          <div className="flex justify-center lg:block">
            <div className="relative aspect-square w-25 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-gold/60">
              <Link href={`/users/${profileSlug}`}>
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.username ?? "User avatar"}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-gold text-5xl font-medium text-black">
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex min-w-0 flex-col gap-4 lg:mt-0">
            <div className="flex flex-row items-center gap-4">
              <h1 className="font-oswald font-normal text-brand-light text-[24px] leading-8 lg:text-[44px] lg:leading-13 tracking-[0.02em]">
                {profile.displayName ?? profile.username}
              </h1>
              <div className="shrink-0">
                <ProfileActionButton profile={profile} onRelationshipChange={handleRelationshipChange} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              <span className="font-manrope text-[15px] text-brand-gold">@{profile.username}</span>
            </div>

            <div className="hidden items-center gap-5 font-mono font-bold text-[16px] uppercase tracking-[0.14em] text-brand-muted lg:flex">
              <span>
                <span className="mr-1.5 font-medium text-brand-gold">{formatCompact(followers)}</span>
                Followers
              </span>
              <span className="text-brand-muted/60">·</span>
              <span>
                <span className="mr-1.5 font-medium text-brand-gold">{formatCompact(profile.followings)}</span>
                Following
              </span>
            </div>

            <div className="mt-2 lg:hidden">
              <div className="h-px w-full" style={{ background: DIVIDER_BG }} />
              <div className="grid grid-cols-3 gap-2 py-5">
                <MobileCountBlock value={followers} label="Followers" />
                <MobileCountBlock value={profile.followings} label="Following" />
                <MobileCountBlock value={profile.friends} label="Friends" />
              </div>
              <div className="h-px w-full" style={{ background: DIVIDER_BG }} />
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-3 self-start lg:flex">
          <div
            className="flex items-stretch divide-x divide-brand-gold/15 rounded-2xl px-3 py-4 ring-1 ring-brand-gold/20"
            style={{ background: CARD_BG }}
          >
            <GlanceStat value={formatFull(summary.totalFilmsRated)} label="Films Rated" />
            <GlanceStat value={profile.listsCreated} label="Lists" />
            <GlanceStat value={profile.reviewsWritten} label="Reviews" />
            <GlanceStat value={formatJoined(summary.joinedAt)} label="Joined" />
          </div>
          <span className="font-mono font-light uppercase text-brand-muted text-[16px] tracking-[2px]">
            At a glance
          </span>
        </div>
      </div>

      {profile.tagline && (
        <p className="mt-6 max-w-xl font-manrope font-normal leading-[22.4px] tracking-[0.32px] text-brand-light/70">
          {profile.tagline}
        </p>
      )}

      <nav className={`${blocked ? "hidden" : ""} mt-12`}>
        <div className="scrollbar-hide mx-[-3%] overflow-x-auto sm:mx-0">
          <ul className="flex min-w-max items-start justify-start gap-5 py-4">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              const count = tabCounts[tab.key];
              const href =
                tab.key === "profile"
                  ? `/users/${profileSlug}`
                  : `/users/${profileSlug}/${tab.key}`;
              return (
                <li key={tab.key}>
                  <Link
                    href={href}
                    className={[
                      "inline-flex items-center gap-1.5 uppercase whitespace-nowrap rounded-full px-5 py-2 font-manrope text-[11px] tracking-[0.04em] transition-colors border-b-2",
                      isActive
                        ? "font-medium text-brand-gold border-brand-gold"
                        : "text-brand-muted hover:text-brand-gold border-transparent hover:border-brand-gold",
                    ].join(" ")}
                  >
                    {tab.label}
                    {count != null && (
                      <div
                        className={[
                          "border-[0.5px] border-brand-muted rounded-full px-3 h-fit",
                          isActive ? "text-brand-gold" : "text-brand-muted hover:text-brand-gold",
                        ].join(" ")}
                      >
                        {count}
                      </div>
                    )}
                  </Link>
                </li>

              );
            })}
          </ul>
        </div>
      </nav>
    </section>
  );
}