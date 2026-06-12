import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { RelationshipStatus, RelationshipType, type Pronouns, type UserProfile } from "@/types/profile";
import ProfileSummaryLoader from "@/components/sections/ProfileSummaryLoader";
import { followUser } from "@/lib/api/users";
import ProfileActionButton from "../ui/ProfileActionButton";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";
const DIVIDER_BG =
  "linear-gradient(90deg, rgba(155,143,132,0) 0%, rgba(155,143,132,0.55) 50%, rgba(155,143,132,0) 100%)";

const pronounsLabel: Record<Pronouns, string> = {
  NotDefined: "",
  HeHim: "He/Him",
  SheHer: "She/Her",
  TheyThem: "They/Them",
  HeThey: "He/They",
  SheThey: "She/They",
  TheyHe: "They/He",
  TheyShe: "They/She",
  Other: "Other",
};

const TABS = [
  { key: "profile", label: "profile" },
  { key: "lists", label: "lists" },
  { key: "activity", label: "activity" },
  { key: "reviews", label: "reviews" },
  { key: "likes", label: "likes" },
  { key: "watchlist", label: "watchlist" },
];

function notDisplayIfBlock(profile: UserProfile) {
  return profile.outgoingRelationship?.type === RelationshipType.Block ? "hidden" : "";
}


function MobileCountBlock({ value, label }: { value: number; label: string }) {
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
  const profileSlug = profile.username || "";

  return (
    <section className="section-container pt-4 lg:pt-12 pb-8 lg:pb-12">
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
          <div className="flex justify-center lg:block">
            <div className="relative aspect-square w-35 sm:w-40 lg:w-50 overflow-hidden rounded-full ring-1 ring-brand-gold/60">
              <Link href={`/users/${profileSlug}`}>
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.username ?? "User avatar"}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-gold text-black flex items-center justify-center text-8xl font-medium">
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 flex-1 w-full min-w-0 flex gap-4">
            <div className="flex flex-col gap-4">
              <h1 className="font-oswald font-normal text-brand-light text-[24px] leading-8 lg:text-[44px] lg:leading-13 tracking-[0.02em]">
                {profile.displayName ?? profile.username}
              </h1>
              <div className="flex flex-row font-manrope gap-7.75 h-3.25">
                <span className="text-brand-gold">@{profile.username}</span>
                {profile.pronouns !== "NotDefined" && (
                  <span className="text-brand-muted lowercase">
                    {pronounsLabel[profile.pronouns]}
                  </span>
                )}
                <span className="text-brand-muted">{profile.location}</span>
              </div>
              {profile.tagline && (
                <p className="mt-3 font-manrope font-normal leading-[22.4px] tracking-[0.32px]">
                  {profile.tagline}
                </p>
              )}
              {profile.biography && (
                <p className="line-clamp-11 font-manrope font-light text-[14px] text-[#DACBBD] tracking-[6%] leading-6">
                  "{profile.biography}"
                </p>
              )}
            </div>

            <div className="lg:hidden mt-6">
              <div className="h-px w-full" style={{ background: DIVIDER_BG }} />
              <div className="grid grid-cols-3 gap-2 py-5">
                <MobileCountBlock value={profile.followers} label="Followers" />
                <MobileCountBlock value={profile.followings} label="Following" />
                <MobileCountBlock value={profile.friends} label="Friends" />
              </div>
              <div className="h-px w-full" style={{ background: DIVIDER_BG }} />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 self-start">
          <div>
            <ProfileActionButton profile={profile} />

            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-oswald font-light uppercase text-brand-gold text-[13px] tracking-[0.18em]">
                <span className="text-brand-light font-normal text-[15px] mr-1.5">
                  {profile.followers}
                </span>
                Followers
              </span>
              <span className="font-oswald font-light uppercase text-brand-gold text-[13px] tracking-[0.18em]">
                <span className="text-brand-light font-normal text-[15px] mr-1.5">
                  {profile.followings}
                </span>
                Followings
              </span>
              <span className="font-oswald font-light uppercase text-brand-gold text-[13px] tracking-[0.18em]">
                <span className="text-brand-light font-normal text-[15px] mr-1.5">
                  {profile.friends}
                </span>
                Friends
              </span>
            </div>
          </div>

          <div className={notDisplayIfBlock(profile)}>
            <Suspense fallback={<div>Loading stats...</div>}>
              <ProfileSummaryLoader username={profile.username} />
            </Suspense>
          </div>

        </div>
      </div>
      <nav className={`${notDisplayIfBlock(profile)} mt-8 lg:mt-14`}>
        <div className="hidden lg:block h-px w-full" style={{ background: DIVIDER_BG }} />
        <div className="overflow-x-auto scrollbar-hide mx-[-3%] sm:mx-0">
          <ul className="flex items-center justify-start lg:justify-center gap-2 sm:gap-4 lg:gap-8 py-4 lg:py-5 px-[3%] sm:px-0 min-w-max lg:min-w-0">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              const href = tab.key === "profile" ? `/users/${profileSlug}` : `/users/${profileSlug}/${tab.key}`;
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
