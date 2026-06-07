"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

interface WriteReviewModalProps {
  filmId: string;
  slug?: string;
  isAuthed: boolean;
  /** "link" — inline text link (reviews header); "primary" — gold filled button (hero). */
  variant?: "link" | "primary";
}

const TRIGGER_CLASS =
  "uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2 cursor-pointer";

/**
 * "Write a review" trigger + modal form. Logged-in users open a popup to publish a
 * review (POST /api/films/{id}/reviews); on success the modal closes, a success
 * toast appears, and the page refreshes so the new review shows. Closing with unsaved
 * changes asks for confirmation. Logged-out users are sent to /login instead.
 */
export default function WriteReviewModal({
  filmId,
  slug = "-",
  isAuthed,
  variant = "link",
}: WriteReviewModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0); // 0–5 in 0.5 steps
  const [hover, setHover] = useState(0); // preview rating while pointing
  const [isSpoilerFree, setIsSpoilerFree] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unsaved work that a close would throw away.
  const isDirty = title.trim() !== "" || text.trim() !== "" || rating > 0;

  function resetForm() {
    setTitle("");
    setText("");
    setRating(0);
    setHover(0);
    setIsSpoilerFree(true);
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

  // Escape closes the confirm prompt first, then (with a guard) the modal.
  useEffect(() => {
    if (!open) return;
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

  // Auto-dismiss the success toast.
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
          isSpoilerFree,
          slug,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to publish review (${res.status}).`);
        return;
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

  return (
    <>
      {variant === "primary" ? (
        <Button variant="goldFilled" onClick={handleTriggerClick}>
          Write a review
        </Button>
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
            className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[6px] border border-brand-gold/30 bg-brand-dark p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-light transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="font-oswald font-light uppercase text-[28px] leading-[1.2em] tracking-[0.06em] text-brand-light">
              Write a review
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              {/* Rating — half-star (0.5) increments */}
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                  Rating
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center"
                    onMouseLeave={() => setHover(0)}
                  >
                    {Array.from({ length: 5 }).map((_, i) => {
                      const fill =
                        shownRating >= i + 1 ? "100%" : shownRating >= i + 0.5 ? "50%" : "0%";
                      return (
                        <span
                          key={i}
                          className="relative inline-block text-[28px] leading-none select-none"
                        >
                          {/* Empty base + clipped gold overlay = half-star support */}
                          <span className="text-brand-muted/40">★</span>
                          <span
                            className="absolute inset-0 overflow-hidden text-brand-gold"
                            style={{ width: fill }}
                          >
                            ★
                          </span>
                          {/* Two click/hover targets per star: left = .5, right = whole */}
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
                  <span className="font-manrope text-[13px] text-brand-muted tabular-nums">
                    {shownRating > 0 ? `${shownRating.toFixed(1)} / 5` : "Not rated"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label htmlFor="review-title" className="font-manrope text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                  Title <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My thoughts on…"
                  className="rounded-[4px] border border-brand-gold/25 bg-brand-dark px-4 py-3 font-manrope text-[15px] text-brand-light placeholder:text-brand-muted/60 focus:border-brand-gold/60 focus:outline-none"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <label htmlFor="review-text" className="font-manrope text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                  Review
                </label>
                <textarea
                  id="review-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder="Share your thoughts…"
                  className="resize-y rounded-[4px] border border-brand-gold/25 bg-brand-dark px-4 py-3 font-manrope text-[15px] leading-[1.6em] text-brand-light placeholder:text-brand-muted/60 focus:border-brand-gold/60 focus:outline-none"
                />
              </div>

              {/* Spoiler-free */}
              <label className="flex items-center gap-3 font-manrope text-[14px] text-brand-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpoilerFree}
                  onChange={(e) => setIsSpoilerFree(e.target.checked)}
                  className="size-4 accent-brand-gold"
                />
                This review is spoiler-free
              </label>

              {error && <p className="font-manrope text-[13px] text-red-400">{error}</p>}

              <div className="mt-2 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={requestClose}
                  className="font-manrope text-[14px] uppercase tracking-[0.06em] text-brand-muted hover:text-brand-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-[4px] bg-brand-gold px-6 py-3 font-manrope text-[14px] uppercase tracking-[0.06em] text-brand-dark hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Publishing…" : "Publish review"}
                </button>
              </div>
            </form>

            {/* Discard confirmation */}
            {confirmClose && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center rounded-[6px] bg-brand-dark/95 p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex max-w-[360px] flex-col items-center text-center">
                  <h3 className="font-oswald font-light uppercase text-[22px] tracking-[0.06em] text-brand-light">
                    Discard this review?
                  </h3>
                  <p className="mt-3 font-manrope text-[14px] leading-[1.6em] text-brand-muted">
                    Your review hasn&apos;t been published. If you leave now, your changes
                    will be lost.
                  </p>
                  <div className="mt-7 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setConfirmClose(false)}
                      className="rounded-[4px] border border-brand-gold/40 px-5 py-2.5 font-manrope text-[13px] uppercase tracking-[0.06em] text-brand-light hover:bg-brand-gold/10 transition-colors"
                    >
                      Keep editing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        closeModal();
                      }}
                      className="rounded-[4px] bg-red-500/90 px-5 py-2.5 font-manrope text-[13px] uppercase tracking-[0.06em] text-white hover:bg-red-500 transition-colors"
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

      {/* Success toast — lives outside the modal so it persists after close */}
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
