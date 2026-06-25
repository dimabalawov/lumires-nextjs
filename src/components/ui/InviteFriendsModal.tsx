"use client";

import { useEffect, useState } from "react";

interface SuggestedFriend {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  meta: string;
  /** Pre-invited (renders the "INVITED ✓" state). */
  invited?: boolean;
}

const SUGGESTED: SuggestedFriend[] = [
  { id: "mv", name: "Mara Vex", handle: "maravex", initials: "MV", color: "#574a63", meta: "6 mutual" },
  { id: "jp", name: "Juno Pike", handle: "junopike", initials: "JP", color: "#6b5340", meta: "has joined", invited: true },
  { id: "ch", name: "Cass Holloway", handle: "cassh", initials: "CH", color: "#4f5e46", meta: "4 mutual" },
  { id: "ds", name: "Dmitri Sorel", handle: "dsorel", initials: "DS", color: "#41606b", meta: "12 mutual" },
  { id: "il", name: "Iris Lang", handle: "irislang", initials: "IL", color: "#5e3f44", meta: "2 mutual" },
];

const INVITE_LINK = "lumieres.app/l/sunday-picks/join";

interface InviteFriendsModalProps {
  open: boolean;
  onClose: () => void;
  /** List name shown in the subtitle. */
  listName?: string;
}

/**
 * "Invite collaborators" popup for a shared list — search field, suggested
 * friends with per-row invite toggling, and a shareable invite link. Mock/static
 * data; mirrors Figma node 2543:4921.
 */
export default function InviteFriendsModal({
  open,
  onClose,
  listName = "Sunday Night Picks",
}: InviteFriendsModalProps) {
  const [query, setQuery] = useState("");
  const [invited, setInvited] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SUGGESTED.filter((f) => f.invited).map((f) => [f.id, true])),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const filtered = SUGGESTED.filter((f) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return f.name.toLowerCase().includes(q) || f.handle.toLowerCase().includes(q);
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${INVITE_LINK}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Invite collaborators"
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[480px] max-h-[90vh] flex-col gap-[11px] overflow-y-auto rounded-[14px] border border-[rgba(210,166,106,0.22)] bg-[#171410] p-7 shadow-[0px_30px_80px_0px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-2.5">
          <div className="flex flex-col gap-[7px]">
            <h2 className="font-oswald font-light text-[30px] tracking-[0.9px] text-brand-light">
              Invite collaborators
            </h2>
            <p className="font-manrope text-[13.5px] text-brand-muted">
              To <span className="text-brand-gold">{listName}</span> — anyone you invite can add or
              remove films.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="px-1 text-[24px] leading-6 text-brand-muted hover:text-brand-light transition-colors"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="flex h-[48px] items-center gap-[11px] rounded-[8px] border border-[rgba(155,143,132,0.3)] bg-white/[0.03] px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-muted" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, @username or email"
            className="min-w-0 flex-1 bg-transparent font-manrope text-[14px] text-brand-light placeholder:text-[#757575] focus:outline-none"
          />
        </div>

        {/* Suggested friends */}
        <p className="pt-2.5 font-mono text-[11px] tracking-[1.6px] text-brand-muted">
          SUGGESTED FRIENDS
        </p>
        <div className="flex flex-col gap-1 pb-2">
          {filtered.length === 0 && (
            <p className="px-2 py-2 font-manrope text-[13px] text-brand-muted">No friends found.</p>
          )}
          {filtered.map((f) => {
            const isInvited = !!invited[f.id];
            return (
              <div key={f.id} className="flex items-center gap-[13px] rounded-[9px] px-2 py-[9px]">
                <span
                  className="flex size-[40px] shrink-0 items-center justify-center rounded-full font-oswald text-[14px] text-brand-light"
                  style={{
                    backgroundColor: f.color,
                    boxShadow: "inset 0 0 0 1px rgba(210,166,106,0.35)",
                  }}
                >
                  {f.initials}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-manrope text-[14px] font-medium text-[#ece6df]">
                    {f.name}
                  </span>
                  <span className="truncate font-manrope text-[12px] text-brand-muted">
                    @{f.handle} · {f.meta}
                  </span>
                </div>
                {isInvited ? (
                  <button
                    type="button"
                    onClick={() => setInvited((prev) => ({ ...prev, [f.id]: false }))}
                    className="flex h-[34px] shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-gold/[0.16] px-4 font-manrope text-[12px] font-semibold tracking-[1px] text-brand-gold"
                  >
                    INVITED ✓
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setInvited((prev) => ({ ...prev, [f.id]: true }))}
                    className="flex h-[34px] shrink-0 items-center justify-center rounded-full border border-brand-gold bg-brand-gold px-4 font-manrope text-[12px] font-semibold tracking-[1px] text-brand-dark hover:opacity-90 transition-opacity"
                  >
                    INVITE
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="h-px w-full bg-[rgba(155,143,132,0.14)]" />

        {/* Invite link */}
        <p className="pt-2 font-mono text-[11px] tracking-[1.6px] text-brand-muted">
          OR SHARE AN INVITE LINK
        </p>
        <div className="flex items-stretch gap-2.5">
          <div className="flex h-[46px] flex-1 items-center overflow-hidden rounded-[8px] border border-[rgba(155,143,132,0.28)] bg-white/[0.03] px-3.5">
            <span className="truncate font-mono text-[13px] text-brand-muted">{INVITE_LINK}</span>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="flex h-[46px] min-w-[104px] items-center justify-center rounded-[8px] bg-brand-gold px-4 font-manrope text-[13px] font-semibold tracking-[1px] text-brand-dark hover:opacity-90 transition-opacity"
          >
            {copied ? "COPIED ✓" : "COPY LINK"}
          </button>
        </div>
        <p className="font-manrope text-[12px] text-[#6e655c]">
          Anyone with this link can join and edit the list. You can revoke it anytime from Manage.
        </p>
      </div>
    </div>
  );
}
