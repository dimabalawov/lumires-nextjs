"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { tmdbImage } from "@/lib/images/tmdb";

interface PickerFilm {
  id: number;
  title: string;
  posterPath: string | null;
}

interface CreateListModalProps {
  isAuthed: boolean;
}

const inputClass =
  "rounded-[4px] border border-brand-gold/25 bg-brand-dark px-4 py-3 font-manrope text-[15px] text-brand-light placeholder:text-brand-muted/60 focus:border-brand-gold/60 focus:outline-none";

/**
 * "Create a list" trigger + modal. Logged-in users fill a title, optional
 * description, privacy flag, and pick ≥1 film (searched via /api/search/films),
 * then POST /api/lists; on success the modal closes, a toast appears, and the
 * page refreshes. Logged-out users are routed to /login. Mirrors WriteReviewModal.
 */
export default function CreateListModal({ isAuthed }: CreateListModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selected, setSelected] = useState<PickerFilm[]>([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PickerFilm[]>([]);
  const [searching, setSearching] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    title.trim() !== "" || description.trim() !== "" || selected.length > 0;

  function resetForm() {
    setTitle("");
    setDescription("");
    setIsPrivate(false);
    setSelected([]);
    setQuery("");
    setResults([]);
    setError(null);
  }

  function closeModal() {
    setConfirmClose(false);
    setOpen(false);
  }

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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Debounced film search against the picker proxy.
  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search/films?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json().catch(() => ({ films: [] }));
        setResults(Array.isArray(data.films) ? data.films : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query, open]);

  function handleTriggerClick() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  function toggleFilm(film: PickerFilm) {
    setSelected((prev) =>
      prev.some((f) => f.id === film.id)
        ? prev.filter((f) => f.id !== film.id)
        : [...prev, film],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    if (selected.length < 1) {
      setError("Add at least one film to your list.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          isPrivate,
          filmIds: selected.map((f) => f.id),
        }),
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to create list (${res.status}).`);
        return;
      }
      resetForm();
      closeModal();
      setToast("List created!");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button variant="goldOutlined" onClick={handleTriggerClick}>
        Create a list
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
          onClick={requestClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create a list"
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
              Create a list
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label htmlFor="list-title" className="font-manrope text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                  Title
                </label>
                <input
                  id="list-title"
                  type="text"
                  value={title}
                  maxLength={255}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My favourite movies"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label htmlFor="list-description" className="font-manrope text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                  Description <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id="list-description"
                  value={description}
                  maxLength={2000}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What ties these films together?"
                  className={`${inputClass} resize-y leading-[1.6em]`}
                />
              </div>

              {/* Film picker */}
              <div className="flex flex-col gap-2">
                <label htmlFor="list-film-search" className="font-manrope text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                  Films <span className="normal-case tracking-normal">({selected.length} added)</span>
                </label>

                {selected.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.map((film) => (
                      <span
                        key={film.id}
                        className="flex items-center gap-2 rounded-[3px] border border-brand-gold/35 bg-brand-gold/10 px-2 py-1 font-manrope text-[12px] text-brand-light"
                      >
                        {film.title}
                        <button
                          type="button"
                          onClick={() => toggleFilm(film)}
                          aria-label={`Remove ${film.title}`}
                          className="text-brand-muted hover:text-brand-light"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <input
                  id="list-film-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search films to add…"
                  className={inputClass}
                />

                <div className="mt-1 max-h-[180px] overflow-y-auto rounded-[4px] border border-brand-gold/15">
                  {searching && (
                    <p className="px-3 py-3 font-manrope text-[13px] text-brand-muted">Searching…</p>
                  )}
                  {!searching && results.length === 0 && (
                    <p className="px-3 py-3 font-manrope text-[13px] text-brand-muted">No films found.</p>
                  )}
                  {!searching &&
                    results.map((film) => {
                      const active = selected.some((f) => f.id === film.id);
                      const poster = tmdbImage(film.posterPath, "w342");
                      return (
                        <button
                          key={film.id}
                          type="button"
                          onClick={() => toggleFilm(film)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                            active ? "bg-brand-gold/15" : "hover:bg-brand-gold/8"
                          }`}
                        >
                          <span className="relative h-12 w-8 shrink-0 overflow-hidden rounded-[2px] bg-white/5">
                            {poster && (
                              <Image src={poster} alt="" fill unoptimized sizes="32px" className="object-cover" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-manrope text-[14px] text-brand-light">
                            {film.title}
                          </span>
                          <span className={`font-manrope text-[12px] uppercase tracking-[0.1em] ${active ? "text-brand-gold" : "text-brand-muted"}`}>
                            {active ? "Added" : "Add"}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Privacy */}
              <label className="flex items-center gap-3 font-manrope text-[14px] text-brand-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="size-4 accent-brand-gold"
                />
                Make this list private
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
                  {submitting ? "Creating…" : "Create list"}
                </button>
              </div>
            </form>

            {confirmClose && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center rounded-[6px] bg-brand-dark/95 p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex max-w-[360px] flex-col items-center text-center">
                  <h3 className="font-oswald font-light uppercase text-[22px] tracking-[0.06em] text-brand-light">
                    Discard this list?
                  </h3>
                  <p className="mt-3 font-manrope text-[14px] leading-[1.6em] text-brand-muted">
                    This list hasn&apos;t been created. If you leave now, your changes will be lost.
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
