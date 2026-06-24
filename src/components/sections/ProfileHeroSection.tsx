"use client";

import Image from "next/image";
import Link from "next/link";
import { RelationshipStatus, RelationshipType, UserProfileSummary, type Pronouns, type UserProfile } from "@/types/profile";
import ProfileActionButton from "../ui/ProfileActionButton";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import FollowersModal from "./FollowersModal";
import BannerColourModal from "../ui/BannerColourModal";
import { DEFAULT_THEME_ID, type BannerTheme } from "@/data/bannerThemes";
import { updateAccentTheme } from "@/lib/api/users.client";

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
      <span className="font-oswald font-light text-profile-accent text-[22px] leading-none">{value}</span>
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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"followers" | "followings" | "friends">("followers");

  function openModal(tab: "followers" | "followings" | "friends") {
    setModalTab(tab);
    setModalOpen(true);
  }

  const router = useRouter();
  const [bannerOpen, setBannerOpen] = useState(false);
  const [accentTheme, setAccentTheme] = useState(profile.accentTheme ?? DEFAULT_THEME_ID);

  async function handleSelectTheme(theme: BannerTheme) {
    setAccentTheme(theme.id);
    // Live preview: re-theme the profile subtree without a round-trip.
    document.querySelector("main")?.style.setProperty("--profile-accent", theme.accent);
    try {
      await updateAccentTheme(theme.id === DEFAULT_THEME_ID ? null : theme.id);
      router.refresh();
    } catch {
      toast.error("Couldn't save banner colour");
    }
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
            <div className="relative aspect-square w-25 shrink-0 overflow-hidden rounded-full ring-1 ring-profile-accent/60">
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
              {profile.isMe && (
                <button
                  type="button"
                  onClick={() => setBannerOpen(true)}
                  className="flex h-fit shrink-0 items-center gap-2 rounded border border-profile-accent bg-profile-accent/10 px-2 py-2 font-manrope text-[11px] font-semibold uppercase text-profile-accent transition-colors hover:bg-profile-accent/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="13.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="10.5" r="2.5" />
                    <circle cx="8.5" cy="7.5" r="2.5" />
                    <circle cx="6.5" cy="12.5" r="2.5" />
                    <path d="M12 2a10 10 0 0 0 0 20c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1-.24-.27-.39-.62-.39-1 0-.83.67-1.5 1.5-1.5H16a6 6 0 0 0 6-6c0-4.97-4.48-9-10-9Z" />
                  </svg>
                  Banner colour
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              <span className="font-manrope text-[15px] text-profile-accent">@{profile.username}</span>
            </div>

            <div className="items-center gap-5 font-mono font-bold text-[16px] uppercase tracking-[0.14em] text-brand-muted lg:flex">
              <span className="cursor-pointer hover:text-profile-accent" onClick={() => openModal("followers")}>
                <span className="mr-1.5 font-medium text-profile-accent">{formatCompact(followers)}</span>
                Followers
              </span>
              <span className="text-brand-muted/60">·</span>
              <span className="cursor-pointer hover:text-profile-accent" onClick={() => openModal("followings")}>
                <span className="mr-1.5 font-medium text-profile-accent">{formatCompact(profile.followings)}</span>
                Following
              </span>
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
          <ul className="flex w-full min-w-max items-start gap-[6px] border-b border-[rgba(155,143,132,0.13)]">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              const count = tabCounts[tab.key];
              const href =
                tab.key === "profile"
                  ? `/users/${profileSlug}`
                  : `/users/${profileSlug}/${tab.key}`;
              return (
                <li key={tab.key} className="shrink-0">
                  <Link
                    href={href}
                    className={[
                      "-mb-px inline-flex items-center gap-[9px] whitespace-nowrap border-b-2 px-[18px] pt-[12px] pb-[14px] font-manrope text-[13px] uppercase tracking-[1.3px] transition-colors",
                      isActive
                        ? "border-profile-accent text-profile-accent"
                        : "border-transparent text-brand-muted hover:text-profile-accent",
                    ].join(" ")}
                  >
                    {tab.label}
                    {count != null && (
                      <span className="rounded-full border border-[rgba(155,143,132,0.22)] px-[9px] py-[2px] font-mono text-[11px] tracking-[1.3px]">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {modalOpen && (
        <FollowersModal
          username={profileSlug}
          initialTab={modalTab}
          onClose={() => setModalOpen(false)}
        />
      )}

      <BannerColourModal
        open={bannerOpen}
        onClose={() => setBannerOpen(false)}
        value={accentTheme}
        onChange={handleSelectTheme}
      />
    </section>
  );
}