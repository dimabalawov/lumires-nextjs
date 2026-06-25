"use client";

import { useState } from "react";

import InviteFriendsModal from "@/components/ui/InviteFriendsModal";
import ManageCollaboratorsModal from "@/components/ui/ManageCollaboratorsModal";

export interface CollaboratorAvatar {
  /** Two-letter initials shown when there's no image. */
  initials?: string;
  /** Background colour for the initials avatar (ignored when `src` is set). */
  color?: string;
  /** Optional avatar image. */
  src?: string;
}

export interface ListCollaboratorsData {
  avatars: CollaboratorAvatar[];
  /** Lead curator handle, shown without the leading `@`. */
  leadHandle: string;
  /** How many other collaborators beyond the lead. */
  othersCount: number;
  likes: number;
  saves: number;
  updatedAgo: string;
}

const numberFormat = new Intl.NumberFormat("en-US");

/**
 * Collaborators / "shared by" header row for a shared list — overlapping
 * avatar stack, curator credit, engagement stats and the Manage / Invite
 * actions. Replaces the single-author byline used on a regular list page.
 * Mirrors Figma node 2535:4329.
 */
export default function ListCollaborators({ data }: { data: ListCollaboratorsData }) {
  const [manageOpen, setManageOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-[22px]">
      <div className="flex items-center gap-[18px]">
        {/* Overlapping avatar stack */}
        <div className="flex items-center">
          {data.avatars.map((avatar, i) => (
            <div
              key={i}
              className="flex size-[38px] items-center justify-center rounded-full ring-2 ring-brand-dark"
              style={{
                marginLeft: i === 0 ? 0 : -12,
                zIndex: i,
                backgroundColor: avatar.src ? undefined : avatar.color ?? "transparent",
                boxShadow: "inset 0 0 0 1.5px rgba(210,166,106,0.5)",
                backgroundImage: avatar.src ? `url(${avatar.src})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!avatar.src && avatar.initials && (
                <span className="font-oswald text-[14px] tracking-[1px] text-brand-light">
                  {avatar.initials}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Credit + stats */}
        <div className="flex flex-col gap-[5px]">
          <p className="font-manrope text-[15px] text-[#dcd8d3]">
            Curated by <span className="text-brand-gold">@{data.leadHandle}</span>
            {data.othersCount > 0 && (
              <>
                {" & "}
                <span className="text-brand-gold">{data.othersCount} others</span>
              </>
            )}
          </p>
          <p className="font-mono text-[12px] tracking-[0.4px] text-brand-muted">
            {numberFormat.format(data.likes)} likes · {numberFormat.format(data.saves)} saves ·
            Updated {data.updatedAgo}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          onClick={() => setManageOpen(true)}
          className="flex h-[40px] items-center justify-center rounded-[4px] border border-brand-muted/[0.46] px-[18px] font-manrope text-[13px] font-medium tracking-[1.4px] text-[#dcd8d3] transition-colors hover:border-brand-muted/70"
        >
          MANAGE
        </button>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="flex h-[40px] items-center gap-[9px] rounded-[4px] bg-brand-gold px-[20px] font-manrope text-[13px] font-semibold tracking-[1.4px] text-brand-dark transition-opacity hover:opacity-90"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          INVITE FRIENDS
        </button>
      </div>

      <ManageCollaboratorsModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        onInviteMore={() => {
          setManageOpen(false);
          setInviteOpen(true);
        }}
      />
      <InviteFriendsModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
