"use client";

import { useEffect, useState } from "react";

interface Collaborator {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color?: string;
  role: "owner" | "editor";
}

interface PendingInvite {
  id: string;
  handle: string;
  initials: string;
  color: string;
}

const INITIAL_COLLABORATORS: Collaborator[] = [
  { id: "ls", name: "Light & Shadow", handle: "lightandshadow", initials: "", role: "owner" },
  { id: "nk", name: "Nora Kessler", handle: "nora.k", initials: "NK", color: "#6e4a52", role: "editor" },
  { id: "tb", name: "Theo Box", handle: "theobox", initials: "TB", color: "#41606b", role: "editor" },
];

const INITIAL_PENDING: PendingInvite[] = [
  { id: "jp", handle: "junopike", initials: "JP", color: "#6b5340" },
];

interface ManageCollaboratorsModalProps {
  open: boolean;
  onClose: () => void;
  /** Opens the Invite modal (wired to the "+ Invite more" action). */
  onInviteMore?: () => void;
}

/**
 * "Collaborators" management popup for a shared list — lists who can edit,
 * pending invites, and footer actions. Mock/static data; mirrors Figma node
 * 2543:4853.
 */
export default function ManageCollaboratorsModal({
  open,
  onClose,
  onInviteMore,
}: ManageCollaboratorsModalProps) {
  const [collaborators, setCollaborators] = useState(INITIAL_COLLABORATORS);
  const [pending, setPending] = useState(INITIAL_PENDING);

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

  const editorCount = collaborators.filter((c) => c.role === "editor").length;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Collaborators"
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[480px] max-h-[90vh] flex-col gap-4 overflow-y-auto rounded-[14px] border border-[rgba(210,166,106,0.22)] bg-[#171410] p-7 shadow-[0px_30px_80px_0px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[7px]">
            <h2 className="font-oswald font-light text-[30px] tracking-[0.9px] text-brand-light">
              Collaborators
            </h2>
            <p className="font-manrope text-[13.5px] text-brand-muted">
              {editorCount} {editorCount === 1 ? "person" : "people"} can edit this list.
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

        {/* Collaborator rows */}
        <div className="flex flex-col gap-[2px] pt-1.5">
          {collaborators.map((c) => (
            <div key={c.id} className="flex items-center gap-[13px] rounded-[9px] px-2 py-[11px]">
              <span
                className="flex size-[42px] shrink-0 items-center justify-center rounded-full font-oswald text-[15px] text-brand-light"
                style={{
                  backgroundColor: c.color ?? "transparent",
                  boxShadow: "inset 0 0 0 1px rgba(210,166,106,0.4)",
                }}
              >
                {c.initials}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-manrope text-[14.5px] font-medium text-[#ece6df]">
                  {c.name}
                </span>
                <span className="truncate font-manrope text-[12px] text-brand-muted">
                  @{c.handle}
                </span>
              </div>
              {c.role === "owner" ? (
                <span className="shrink-0 rounded-full bg-[rgba(77,101,111,0.22)] px-[11px] py-[5px] font-mono text-[11px] tracking-[0.8px] text-[#bcd2da]">
                  Owner
                </span>
              ) : (
                <>
                  <span className="shrink-0 rounded-full bg-brand-gold/[0.14] px-[11px] py-[5px] font-mono text-[11px] tracking-[0.8px] text-brand-gold">
                    Can edit
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    onClick={() => setCollaborators((prev) => prev.filter((x) => x.id !== c.id))}
                    className="flex size-[30px] shrink-0 items-center justify-center rounded-[6px] text-[17px] text-brand-muted hover:bg-white/5 hover:text-brand-light transition-colors"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Pending invites */}
        {pending.length > 0 && (
          <div className="flex flex-col gap-2.5 py-1">
            <p className="font-mono text-[11px] tracking-[1.6px] text-brand-muted">
              PENDING INVITES
            </p>
            {pending.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-[13px] rounded-[9px] px-2 py-2.5 opacity-80"
              >
                <span
                  className="flex size-[38px] shrink-0 items-center justify-center rounded-full font-oswald text-[13px] text-brand-light"
                  style={{ backgroundColor: p.color }}
                >
                  {p.initials}
                </span>
                <span className="min-w-0 flex-1 truncate font-manrope text-[14px] text-[#cbb9a6]">
                  @{p.handle}
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.8px] text-brand-muted">
                  INVITE SENT
                </span>
                <button
                  type="button"
                  onClick={() => setPending((prev) => prev.filter((x) => x.id !== p.id))}
                  className="shrink-0 px-1 font-manrope text-[12px] text-brand-muted hover:text-brand-light transition-colors"
                >
                  cancel
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="h-px w-full bg-[rgba(155,143,132,0.14)]" />

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onInviteMore}
            className="flex h-[40px] items-center justify-center rounded-[4px] border border-brand-gold/[0.44] px-4 font-manrope text-[12px] font-semibold tracking-[1.2px] text-brand-gold hover:bg-brand-gold/10 transition-colors"
          >
            + INVITE MORE
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-manrope text-[13px] text-brand-muted hover:text-brand-light transition-colors"
          >
            Leave this list
          </button>
        </div>
      </div>
    </div>
  );
}
