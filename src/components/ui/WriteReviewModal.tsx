"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Button from "@/components/ui/Button";

interface FilmMeta {
  title?: string;
  year?: string;
  posterUrl?: string | null;
  primaryGenre?: string;
  runtime?: string;
  director?: string;
}

interface WriteReviewModalProps {
  filmId: string;
  slug?: string;
  isAuthed: boolean;
  /**
   * "link" — inline underlined text link (reviews header);
   * "review" — gold-outlined hero button with a pencil icon;
   * "ratelink" — gold "Write a review →" text link (used inside the rate modal).
   * All variants open the same review modal.
   */
  variant?: "link" | "review" | "ratelink";
  /** Film details shown in the modal header (poster, title, meta line). */
  film?: FilmMeta;
  /** Fired when the trigger opens the modal (e.g. to close a parent rate modal). */
  onOpen?: () => void;
}

/** Tag suggestions offered in the modal. Not persisted to the backend yet. */
const TAG_SUGGESTIONS = [
  "slow cinema",
  "sci-fi",
  "rewatch",
  "theatrical",
  "spoiler-free",
  "cinematography",
];

const TRIGGER_CLASS =
  "uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2 cursor-pointer";

const BORDER = "rgba(220,216,211,0.14)";
const GOLD_RING = "rgba(210,166,106,0.18)";

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${
        on ? "bg-brand-gold" : "bg-[rgba(220,216,211,0.16)]"
      }`}
    >
      <span
        className={`absolute top-[3px] size-[18px] rounded-full transition-all ${
          on ? "left-[21px] bg-brand-dark" : "left-[3px] bg-[#dcd8d3]"
        }`}
      />
    </button>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  control,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[15px]">
      <div className="flex items-center gap-[13px]">
        <span className="shrink-0 text-brand-gold">{icon}</span>
        <div className="flex flex-col gap-0.5">
          <span className="font-manrope text-[15px] tracking-[0.2px] text-brand-light">{title}</span>
          <span className="font-manrope text-[12.5px] text-brand-muted">{subtitle}</span>
        </div>
      </div>
      {control}
    </div>
  );
}

/**
 * "Write a review" trigger + modal. Logged-in users open a popup to rate and publish a
 * review (POST /api/films/{id}/reviews); on success the modal closes, a success toast
 * appears, the saved draft is cleared, and the page refreshes so the new review shows.
 * "Save draft" persists the in-progress review to localStorage (per film) and restores it
 * on reopen. Tags, "Like this film", and "Watched on" are UI-only — the review API doesn't
 * accept them yet, so they aren't sent. The spoiler toggle maps to the API's isSpoilerFree.
 * Logged-out users are sent to /login instead.
 */
export default function WriteReviewModal({
  filmId,
  slug = "-",
  isAuthed,
  variant = "link",
  film,
  onOpen,
}: WriteReviewModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0); // 0–5 in 0.5 steps
  const [hover, setHover] = useState(0); // preview rating while pointing
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draftKey = `review-draft-${filmId}`;

  // Unsaved work that a close would throw away.
  const isDirty =
    title.trim() !== "" || text.trim() !== "" || rating > 0 || tags.length > 0;

  function resetForm() {
    setTitle("");
    setText("");
    setRating(0);
    setHover(0);
    setContainsSpoilers(false);
    setTags([]);
    setError(null);
  }

  function closeModal() {
    setConfirmClose(false);
    setOpen(false);
  }

  // Close immediately when there's nothing to lose; otherwise ask first.
  function requestClose() {
    if (isDirty) {
      setConfirmClose(true);
      return;
    }
    closeModal();
  }

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function saveDraft() {
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ title, text, rating, containsSpoilers, tags }),
      );
      setToast("Draft saved");
    } catch {
      setToast("Couldn't save draft");
    }
  }

  // Escape closes the confirm prompt first, then (with a guard) the modal.
  // Opening loads any saved draft and locks body scroll.
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const d = JSON.parse(raw);
        setTitle(d.title ?? "");
        setText(d.text ?? "");
        setRating(d.rating ?? 0);
        setContainsSpoilers(Boolean(d.containsSpoilers));
        setTags(Array.isArray(d.tags) ? d.tags : []);
      }
    } catch {
      /* ignore malformed draft */
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmClose) setConfirmClose(false);
      else requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, confirmClose, isDirty]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Logged-out users are sent to /login; logged-in users open the modal.
  function handleTriggerClick() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    setOpen(true);
    onOpen?.();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.trim() === "") {
      setError("Please write your review before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/films/${filmId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          text: text.trim(),
          rating: rating > 0 ? rating : null,
          isSpoilerFree: !containsSpoilers,
          slug,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to publish review (${res.status}).`);
        return;
      }
      try {
        localStorage.removeItem(draftKey);
      } catch {
        /* ignore */
      }
      resetForm();
      closeModal();
      setToast("Review published!");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Rating shown reflects the hover preview when pointing, else the chosen value.
  const shownRating = hover || rating;

  const metaLine = [film?.primaryGenre, film?.runtime, film?.director ? `directed by ${film.director}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {variant === "review" ? (
        <Button variant="goldOutlined" onClick={handleTriggerClick} leftIcon={<PencilIcon />}>
          Write a review
        </Button>
      ) : variant === "ratelink" ? (
        <button
          type="button"
          onClick={handleTriggerClick}
          className="font-manrope text-[14px] tracking-[0.4px] text-brand-gold transition-opacity hover:opacity-70"
        >
          Write a review →
        </button>
      ) : (
        <button type="button" onClick={handleTriggerClick} className={TRIGGER_CLASS}>
          write a review →
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
          onClick={requestClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[12px] bg-[#17140f] shadow-[0px_50px_110px_0px_rgba(0,0,0,0.66)]"
            style={{ boxShadow: `0 50px 110px rgba(0,0,0,0.66), inset 0 0 0 1px ${GOLD_RING}` }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-start gap-4 border-b px-6 pt-[22px] pb-[22px]"
              style={{ borderColor: BORDER }}
            >
              <div
                className="relative h-[80px] w-[54px] shrink-0 overflow-hidden rounded-[4px]"
                style={{ boxShadow: `inset 0 0 0 1px ${GOLD_RING}` }}
              >
                {film?.posterUrl && (
                  <Image src={film.posterUrl} alt="" fill sizes="54px" className="object-cover" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
                <span className="font-oswald text-[11px] uppercase tracking-[3px] text-brand-gold">
                  Write a review
                </span>
                <div className="flex flex-wrap items-end gap-2">
                  <h2 className="font-oswald text-[26px] leading-[1.05] tracking-[0.8px] text-brand-light">
                    {film?.title ?? "Your review"}
                  </h2>
                  {film?.year && (
                    <span className="font-oswald text-[18px] text-brand-muted">{film.year}</span>
                  )}
                </div>
                {metaLine && (
                  <p className="font-manrope text-[13px] tracking-[0.4px] text-brand-muted">
                    {metaLine}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={requestClose}
                aria-label="Close"
                className="-mr-1 shrink-0 p-1.5 text-brand-muted transition-colors hover:text-brand-light"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              {/* Scrollable body */}
              <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                {/* Rating — half-star (0.5) increments */}
                <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
                  <span className="font-oswald text-[13px] uppercase tracking-[2.4px] text-brand-muted">
                    Your rating
                  </span>
                  <div className="flex items-center gap-[9px]" onMouseLeave={() => setHover(0)}>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const fill =
                        shownRating >= i + 1 ? "100%" : shownRating >= i + 0.5 ? "50%" : "0%";
                      return (
                        <span key={i} className="relative inline-block text-[30px] leading-none select-none">
                          <span className="text-brand-gold/30">☆</span>
                          <span
                            className="absolute inset-0 overflow-hidden text-brand-gold"
                            style={{ width: fill }}
                          >
                            ★
                          </span>
                          <button
                            type="button"
                            aria-label={`${i + 0.5} stars`}
                            onMouseEnter={() => setHover(i + 0.5)}
                            onClick={() => setRating(rating === i + 0.5 ? 0 : i + 0.5)}
                            className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer"
                          />
                          <button
                            type="button"
                            aria-label={`${i + 1} stars`}
                            onMouseEnter={() => setHover(i + 1)}
                            onClick={() => setRating(rating === i + 1 ? 0 : i + 1)}
                            className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer"
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Headline */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your review a headline…"
                  aria-label="Review headline"
                  className="w-full border-b bg-transparent pb-3 font-oswald text-[24px] tracking-[0.5px] text-brand-light placeholder:text-brand-muted focus:outline-none"
                  style={{ borderColor: BORDER }}
                />

                {/* Review body */}
                <div className="flex flex-col gap-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    placeholder="What did you think? Write freely — what worked, what stayed with you, what you're still turning over…"
                    aria-label="Review"
                    className="min-h-[150px] w-full resize-y bg-transparent font-manrope text-[16px] leading-[26px] tracking-[0.3px] text-brand-light placeholder:text-brand-muted focus:outline-none"
                  />
                  <span className="text-right font-manrope text-[12px] text-brand-muted">
                    {text.length} characters
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-[10px]">
                  <span className="font-oswald text-[12px] uppercase tracking-[2.4px] text-brand-muted">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-[6px]">
                    {TAG_SUGGESTIONS.map((tag) => {
                      const active = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          aria-pressed={active}
                          className={`flex items-center gap-[6px] rounded-full px-[13px] py-[7px] font-manrope text-[13px] tracking-[0.4px] transition-colors ${
                            active
                              ? "bg-brand-gold/15 text-brand-gold"
                              : "text-[#dcd8d3] hover:text-brand-gold"
                          }`}
                          style={{ boxShadow: `inset 0 0 0 1px ${active ? "rgba(210,166,106,0.6)" : GOLD_RING}` }}
                        >
                          <TagIcon />
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settings card */}
                <div className="rounded-[8px]" style={{ boxShadow: `inset 0 0 0 1px ${BORDER}` }}>
                  <SettingRow
                    icon={<AlertIcon />}
                    title="Contains spoilers"
                    subtitle="We'll blur this review until readers opt in"
                    control={
                      <Toggle
                        on={containsSpoilers}
                        onClick={() => setContainsSpoilers((v) => !v)}
                        label="Contains spoilers"
                      />
                    }
                  />
                </div>

                {error && <p className="font-manrope text-[13px] text-red-400">{error}</p>}
              </div>

              {/* Footer */}
              <div
                className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t px-6 py-4"
                style={{ borderColor: BORDER }}
              >
                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-1.5 font-oswald text-[13px] uppercase tracking-[1.4px] text-brand-muted transition-colors hover:text-brand-light"
                >
                  Save draft
                </button>
                <div className="flex items-center gap-[10px]">
                  <button
                    type="button"
                    onClick={requestClose}
                    className="rounded-[5px] px-5 py-3 font-oswald text-[14px] uppercase tracking-[1.6px] text-[#dcd8d3] transition-colors hover:bg-white/5"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(220,216,211,0.18)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-[10px] rounded-[5px] bg-brand-gold px-[26px] py-3 font-oswald text-[14px] uppercase tracking-[1.8px] text-brand-dark transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Publishing…" : "Publish review"}
                    {!submitting && <ArrowRightIcon />}
                  </button>
                </div>
              </div>
            </form>

            {/* Discard confirmation */}
            {confirmClose && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center rounded-[12px] bg-brand-dark/95 p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex max-w-[360px] flex-col items-center text-center">
                  <h3 className="font-oswald font-light uppercase text-[22px] tracking-[0.06em] text-brand-light">
                    Discard this review?
                  </h3>
                  <p className="mt-3 font-manrope text-[14px] leading-[1.6em] text-brand-muted">
                    Your review hasn&apos;t been published. Save it as a draft, or discard your
                    changes.
                  </p>
                  <div className="mt-7 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setConfirmClose(false)}
                      className="rounded-[4px] border border-brand-gold/40 px-5 py-2.5 font-manrope text-[13px] uppercase tracking-[0.06em] text-brand-light transition-colors hover:bg-brand-gold/10"
                    >
                      Keep editing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        closeModal();
                      }}
                      className="rounded-[4px] bg-red-500/90 px-5 py-2.5 font-manrope text-[13px] uppercase tracking-[0.06em] text-white transition-colors hover:bg-red-500"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast — lives outside the modal so it persists after close */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 rounded-[6px] border border-brand-gold/40 bg-brand-dark px-5 py-4 shadow-2xl"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-brand-gold text-brand-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="font-manrope text-[14px] text-brand-light">{toast}</span>
        </div>
      )}
    </>
  );
}
