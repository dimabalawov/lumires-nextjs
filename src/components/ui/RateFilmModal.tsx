"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import WriteReviewModal from "@/components/ui/WriteReviewModal";

interface FilmMeta {
  title?: string;
  year?: string;
  posterUrl?: string | null;
  primaryGenre?: string;
  runtime?: string;
  director?: string;
}

interface RateFilmModalProps {
  filmId: string;
  slug?: string;
  isAuthed: boolean;
  film?: FilmMeta;
  initialWatched?: boolean;
  initialLiked?: boolean;
}

const BORDER = "rgba(220,216,211,0.14)";
const GOLD_RING = "rgba(210,166,106,0.18)";

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.56 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5Z" />
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

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/**
 * Quick-rate popup opened by the gold "Rate film" button. Tappable half-star
 * rating saved via POST /api/films/{id}/rate, plus Watched / Like toggles wired
 * to /watch and /like, and a "Write a review →" shortcut into the full review
 * modal. Logged-out users are sent to /login.
 */
export default function RateFilmModal({
  filmId,
  slug = "-",
  isAuthed,
  film,
  initialWatched,
  initialLiked,
}: RateFilmModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [rating, setRating] = useState(0); // 0–5 in 0.5 steps
  const [hover, setHover] = useState(0);
  const [watched, setWatched] = useState(initialWatched ?? false);
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [saving, setSaving] = useState(false);
  const watchPending = useRef(false);
  const likePending = useRef(false);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function handleTriggerClick() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  async function toggle(
    kind: "watch" | "like",
    pending: typeof watchPending,
    value: boolean,
    setValue: (v: boolean) => void,
  ) {
    if (pending.current) return;
    pending.current = true;
    const next = !value;
    setValue(next); // optimistic
    try {
      const res = await fetch(`/api/films/${filmId}/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.status === 401 || res.status === 403) {
        setValue(!next);
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setValue(!next); // revert
        return;
      }
      const data = await res.json().catch(() => null);
      const server =
        kind === "watch"
          ? (data?.isWatched ?? data?.watched ?? data?.isWatchedByMe)
          : (data?.isLiked ?? data?.liked ?? data?.isLikedByMe);
      if (typeof server === "boolean") setValue(server);
    } catch {
      setValue(!next);
    } finally {
      pending.current = false;
    }
  }

  async function handleSave() {
    if (rating <= 0 || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/films/${filmId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error(`Rate request failed: ${res.status} ${detail}`);
        setToast("Couldn't save rating");
        return;
      }
      setOpen(false);
      setToast("Rating saved");
      router.refresh();
    } catch {
      setToast("Couldn't save rating");
    } finally {
      setSaving(false);
    }
  }

  const shownRating = hover || rating;
  const metaLine = [film?.primaryGenre, film?.runtime, film?.director ? `directed by ${film.director}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Button variant="goldFilled" onClick={handleTriggerClick} leftIcon={<StarIcon />}>
        Rate film
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Rate this film"
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[12px] bg-[#17140f]"
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
                  Rate this film
                </span>
                <div className="flex flex-wrap items-end gap-2">
                  <h2 className="font-oswald text-[26px] leading-[1.05] tracking-[0.8px] text-brand-light">
                    {film?.title ?? "This film"}
                  </h2>
                  {film?.year && (
                    <span className="font-oswald text-[18px] text-brand-muted">{film.year}</span>
                  )}
                </div>
                {metaLine && (
                  <p className="font-manrope text-[13px] tracking-[0.4px] text-brand-muted">{metaLine}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1 shrink-0 p-1.5 text-brand-muted transition-colors hover:text-brand-light"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center px-6 pt-[34px] pb-6">
              <span className="font-oswald text-[13px] uppercase tracking-[2.4px] text-brand-muted">
                Tap the stars
              </span>

              <div className="flex items-center gap-3 pt-[18px]" onMouseLeave={() => setHover(0)}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const fill = shownRating >= i + 1 ? "100%" : shownRating >= i + 0.5 ? "50%" : "0%";
                  return (
                    <span key={i} className="relative inline-block text-[42px] leading-none select-none">
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

              <p className="pt-[18px] font-manrope text-[14px] text-brand-muted">
                {shownRating > 0
                  ? `${shownRating.toFixed(1)} / 5`
                  : "Hover or tap to choose — half-stars allowed"}
              </p>

              {/* Watched / Like quick toggles */}
              <div className="flex w-full items-stretch justify-center gap-[10px] pt-6">
                <button
                  type="button"
                  onClick={() => toggle("watch", watchPending, watched, setWatched)}
                  aria-pressed={watched}
                  className={`flex flex-1 items-center justify-center gap-[9px] rounded-[5px] px-[10px] py-3 font-oswald text-[13px] uppercase tracking-[1.6px] transition-colors ${
                    watched ? "bg-brand-gold/10 text-brand-gold" : "text-[#dcd8d3] hover:bg-white/5"
                  }`}
                  style={{ boxShadow: `inset 0 0 0 1px ${watched ? "#d2a66a" : "rgba(220,216,211,0.16)"}` }}
                >
                  <EyeIcon />
                  Watched
                </button>
                <button
                  type="button"
                  onClick={() => toggle("like", likePending, liked, setLiked)}
                  aria-pressed={liked}
                  className={`flex flex-1 items-center justify-center gap-[9px] rounded-[5px] px-[10px] py-3 font-oswald text-[13px] uppercase tracking-[1.6px] transition-colors ${
                    liked ? "bg-brand-gold/10 text-brand-gold" : "text-[#dcd8d3] hover:bg-white/5"
                  }`}
                  style={{ boxShadow: `inset 0 0 0 1px ${liked ? "#d2a66a" : "rgba(220,216,211,0.16)"}` }}
                >
                  <HeartIcon filled={liked} />
                  Like
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-[14px] px-6 pb-[22px]">
              <button
                type="button"
                onClick={handleSave}
                disabled={rating <= 0 || saving}
                className="flex h-[54px] w-full items-center justify-center rounded-[5px] bg-brand-gold font-oswald text-[16px] uppercase tracking-[2.4px] text-brand-dark transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save rating"}
              </button>
              <div className="flex items-center justify-center gap-2">
                <span className="font-manrope text-[14px] tracking-[0.4px] text-[#dcd8d3]">
                  Want to say more?
                </span>
                <WriteReviewModal
                  filmId={filmId}
                  slug={slug}
                  isAuthed={isAuthed}
                  film={film}
                  variant="ratelink"
                  onOpen={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
