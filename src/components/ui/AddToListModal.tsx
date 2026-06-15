"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { tmdbImage } from "@/lib/images/tmdb";
import { apiRequest } from "@/lib/api/auth.client";
import { createClient } from "@/lib/supabase/client";
import type { MyFilmListItem } from "@/types/api";
import toast from "react-hot-toast";

interface FilmMeta {
  title?: string;
  year?: string;
  primaryGenre?: string;
  posterUrl?: string | null;
}

interface AddToListModalProps {
  open: boolean;
  onClose: () => void;
  filmId: string;
  isAuthed: boolean;
  film?: FilmMeta;
  /** Fired with the number of the user's lists containing this film, on load and
   * after each toggle — lets the parent reflect the "Add to list" highlight. */
  onMembershipChange?: (countInLists: number) => void;
}

/** Mirror of the backend ListItemResponse (GET /lists). */
interface ListItemResponse {
  id: string;
  title: string;
  userId: string;
  username: string;
  filmsCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  isPrivate: boolean;
  isMyList: boolean;
  // containsFilm?: boolean;  // ⚠ NOT in the contract yet — see note under the file
  films: { backdropPath: string | null }[];
}

const BORDER = "rgba(155,143,132,0.13)";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

/** Stacked mini-posters for a list (up to two, offset like the Figma). */
function ListThumbs({ films }: { films: { posterPath: string | null }[] }) {
  const posters = films.map((f) => tmdbImage(f.posterPath, "w342")).filter(Boolean).slice(0, 2);
  return (
    <div className="relative h-[58px] w-[44px] shrink-0">
      {posters.length === 0 && (
        <div className="absolute left-[6px] top-0 h-[57px] w-[38px] rounded-[6px] border border-[rgba(155,143,132,0.22)] bg-white/[0.03]" />
      )}
      {posters[1] && (
        <div className="absolute left-[2.5px] top-[1.8px] h-[55px] w-[37px] overflow-hidden rounded-[6px] border border-[rgba(155,143,132,0.22)] opacity-55">
          <Image src={posters[1]!} alt="" fill unoptimized sizes="37px" className="object-cover" />
        </div>
      )}
      {posters[0] && (
        <div className="absolute left-[6px] top-0 h-[57px] w-[38px] overflow-hidden rounded-[6px] border border-[rgba(155,143,132,0.22)]">
          <Image src={posters[0]!} alt="" fill unoptimized sizes="38px" className="object-cover" />
        </div>
      )}
    </div>
  );
}

/**
 * "Add to list" modal (controlled via open/onClose). Lists the current user's
 * own lists with a checkbox per list (pre-checked when the film is already in
 * it) and toggles membership inline. Includes an inline "Create a new list" row.
 */
export default function AddToListModal({
  open,
  onClose,
  filmId,
  isAuthed,
  film,
  onMembershipChange,
}: AddToListModalProps) {
  const router = useRouter();
  const [lists, setLists] = useState<MyFilmListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [createBusy, setCreateBusy] = useState(false);

  const reportCount = useCallback(
    (next: MyFilmListItem[]) =>
      onMembershipChange?.(next.filter((l) => l.containsFilm).length),
    [onMembershipChange],
  );

  const [initialMembership, setInitialMembership] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const myId = user?.id;

        if (!myId) {
          if (!cancelled) router.push("/login");
          return;
        }

        const res = await apiRequest<{ results: ListItemResponse[] }>(
          `/lists?UserId=${myId}&FilmId=${filmId}&ContainsFilm=true&PageSize=50`,
          { auth: true, cache: "no-store" },
        );
        if (cancelled) return;

        const next: MyFilmListItem[] = (res?.results ?? []).map((l) => ({
          id: l.id,
          title: l.title,
          filmsCount: l.filmsCount,
          isPrivate: l.isPrivate,
          containsFilm: (l as { containsFilm?: boolean }).containsFilm ?? false,
          films: l.films.map((f) => ({ posterPath: f.backdropPath })),
        }));

        setLists(next);
        setInitialMembership(
          Object.fromEntries(
            next.map((x) => [x.id, x.containsFilm]),
          ),
        );
        reportCount(next);
      } catch {
        if (!cancelled) setLoadError("Couldn't load your lists.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, filmId, router, reportCount]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  function toggleMembership(list: MyFilmListItem) {
    setLists((prev) => {
      const next = prev.map((l) =>
        l.id === list.id
          ? {
            ...l,
            containsFilm: !l.containsFilm,
            filmsCount:
              l.filmsCount + (l.containsFilm ? -1 : 1),
          }
          : l,
      );

      reportCount(next);

      return next;
    });
  }

  async function handleDone() {
    try {
      const operations = lists.flatMap((list) => {
        const original = initialMembership[list.id] ?? false;

        if (original === list.containsFilm) {
          return [];
        }

        return [
          apiRequest(`/lists/${list.id}/films/${filmId}`, {
            method: list.containsFilm ? "POST" : "DELETE",
            auth: true,
            authExcep: true,
            headers: {
              "Content-Type": "application/json",
            },
            body: {}
          }),
        ];
      });

      if (operations.length > 0) {
        await Promise.all(operations);
      }

      router.refresh();
      onClose();
      toast.success("Success!");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate() {
    const title = newTitle.trim();
    if (title.length < 5 || createBusy) return;
    setCreateBusy(true);
    try {
      const created = await apiRequest<{ id?: string; filmsListId?: string }>(`/lists`, {
        method: "POST",
        auth: true,
        body: { title, isPrivate: false, filmIds: [Number(filmId)] },
      });
      const id = created?.filmsListId ?? created?.id;
      setLists((prev) => {
        const next: MyFilmListItem[] = [
          {
            id: String(id ?? crypto.randomUUID()),
            title,
            filmsCount: 1,
            isPrivate: false,
            containsFilm: true,
            films: [],
          },
          ...prev,
        ];
        reportCount(next);
        return next;
      });
      setNewTitle("");
      setCreating(false);
      router.refresh();
      toast.success("Created new list");
    } catch {
    } finally {
      setCreateBusy(false);
    }
  }

  if (!open || !isAuthed) return null;

  const filtered = lists.filter((l) =>
    l.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const inCount = lists.filter((l) => l.containsFilm).length;
  const metaLine = [film?.year, film?.primaryGenre, "Choose one or more of your lists"]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add to list"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-[474px] flex-col overflow-hidden rounded-[18px] border border-brand-gold/[0.46] bg-gradient-to-b from-[#1c1916] to-[#161310]"
        style={{ boxShadow: "0 40px 110px rgba(0,0,0,0.66), 0 0 0 1px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start gap-4 border-b px-[22px] pt-[22px] pb-[19px]" style={{ borderColor: BORDER }}>
          <div className="relative h-[69px] w-[46px] shrink-0 overflow-hidden rounded-[7px] border border-[rgba(155,143,132,0.22)]">
            {film?.posterUrl && (
              <Image src={film.posterUrl} alt="" fill sizes="46px" className="object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
            <span className="font-manrope text-[10.5px] uppercase tracking-[0.16em] text-brand-muted">
              Add to list
            </span>
            <h2 className="font-oswald text-[22px] font-medium leading-[1.1] text-brand-light">
              {film?.title ?? "This film"}
            </h2>
            {metaLine && (
              <p className="font-manrope text-[12px] text-brand-muted">{metaLine}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 shrink-0 p-1.5 text-brand-muted transition-colors hover:text-brand-light"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 px-[22px] pt-2">
          <div className="relative flex items-center rounded-[9px] border border-[rgba(155,143,132,0.22)] bg-black/[0.28]">
            <span className="pointer-events-none absolute left-[13px] text-brand-muted">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find one of your lists…"
              className="w-full bg-transparent py-3 pl-[39px] pr-4 font-manrope text-[13.5px] text-brand-light placeholder:text-brand-muted focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="min-h-[120px] max-h-[288px] grow overflow-y-auto px-[10px] py-2">
          {loading && (
            <p className="px-3 py-6 text-center font-manrope text-[13px] text-brand-muted">Loading your lists…</p>
          )}
          {!loading && loadError && (
            <p className="px-3 py-6 text-center font-manrope text-[13px] text-red-400">{loadError}</p>
          )}
          {!loading && !loadError && lists.length === 0 && (
            <p className="px-3 py-6 text-center font-manrope text-[13px] text-brand-muted">
              You don&apos;t have any lists yet. Create one below.
            </p>
          )}
          {!loading && !loadError && lists.length > 0 && filtered.length === 0 && (
            <p className="px-3 py-6 text-center font-manrope text-[13px] text-brand-muted">No lists match “{query}”.</p>
          )}
          {filtered.map((list) => (
            <button
              key={list.id}
              type="button"
              onClick={() => toggleMembership(list)}
              className={`flex w-full items-center gap-[14px] rounded-[11px] px-3 py-[11px] text-left transition-colors disabled:opacity-60 ${list.containsFilm ? "bg-brand-gold/[0.09]" : "hover:bg-brand-gold/[0.05]"
                }`}
            >
              <ListThumbs films={list.films} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-oswald text-[16.5px] font-medium leading-[1.15] text-brand-light">
                  {list.title}
                </p>
                <div className="mt-1.5 flex items-center gap-2 font-manrope text-[10.5px] uppercase tracking-[0.16em] text-brand-muted">
                  <span>{list.filmsCount} {list.filmsCount === 1 ? "film" : "films"}</span>
                  <span className="flex items-center gap-1">
                    {list.isPrivate ? <LockIcon /> : <GlobeIcon />}
                    {list.isPrivate ? "private" : "public"}
                  </span>
                </div>
              </div>
              <span
                aria-hidden
                className={`grid size-6 shrink-0 place-items-center rounded-[7px] border transition-colors ${list.containsFilm
                  ? "border-brand-gold bg-brand-gold text-brand-dark"
                  : "border-[rgba(155,143,132,0.22)] text-transparent"
                  }`}
              >
                <CheckIcon />
              </span>
            </button>
          ))}
        </div>

        {/* Create a new list */}
        <div className="shrink-0 px-[22px] pb-2">
          {creating ? (
            <div className="flex items-center gap-2 rounded-[11px] border border-dashed border-brand-gold/[0.46] bg-brand-gold/[0.08] px-3 py-2.5">
              <input
                autoFocus
                type="text"
                value={newTitle}
                maxLength={255}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") { setCreating(false); setNewTitle(""); }
                }}
                placeholder="New list name (min 5 chars)…"
                className="min-w-0 flex-1 bg-transparent font-manrope text-[13.5px] text-brand-light placeholder:text-brand-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={newTitle.trim().length < 5 || createBusy}
                className="shrink-0 rounded-[7px] bg-brand-gold px-3 py-1.5 font-manrope text-[12px] uppercase tracking-[0.12em] text-brand-dark transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {createBusy ? "…" : "Create"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-3 rounded-[11px] border border-dashed border-brand-gold/[0.46] bg-brand-gold/[0.08] px-[13px] py-[14px] text-brand-gold transition-colors hover:bg-brand-gold/[0.14]"
            >
              <span className="grid size-6 place-items-center rounded-full border border-brand-gold/[0.46] text-[17px] leading-none">+</span>
              <span className="font-manrope text-[13.5px] tracking-[0.03em]">Create a new list</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-4 border-t px-[22px] pt-[21px] pb-[20px]" style={{ borderColor: BORDER }}>
          <p className="font-manrope text-[12.5px] text-brand-muted">
            In <span className="font-bold text-brand-gold">{inCount}</span> {inCount === 1 ? "list" : "lists"}
          </p>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[9px] border border-[rgba(155,143,132,0.22)] px-[23px] py-3 font-manrope text-[12px] uppercase tracking-[0.13em] text-brand-muted transition-colors hover:text-brand-light"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDone}
              className="rounded-[9px] bg-brand-gold px-[22px] py-3 font-manrope text-[12px] font-semibold uppercase tracking-[0.13em] text-[#16100a] transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}