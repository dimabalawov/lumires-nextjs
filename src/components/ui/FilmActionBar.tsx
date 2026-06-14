"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import AddToListModal from "@/components/ui/AddToListModal";

function EyeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" fill={active ? "var(--color-brand-dark)" : "none"} />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3.5" y1="6" x2="3.51" y2="6" />
      <line x1="3.5" y1="12" x2="3.51" y2="12" />
      <line x1="3.5" y1="18" x2="3.51" y2="18" />
    </svg>
  );
}

function getLikedFromResponse(data: unknown): boolean | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const value = record.isLiked ?? record.liked ?? record.isLikedByMe;
  return typeof value === "boolean" ? value : null;
}

function getWatchedFromResponse(data: unknown): boolean | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const value = record.isWatched ?? record.watched ?? record.isWatchedByMe;
  return typeof value === "boolean" ? value : null;
}

function SegItem({
  icon,
  label,
  active = false,
  withBorder = false,
  onClick,
  title,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  withBorder?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`flex flex-col items-center justify-center gap-1.5 px-5 py-2.5 transition-colors hover:bg-brand-gold/5 ${
        withBorder ? "border-l border-[rgba(155,143,132,0.46)]" : ""
      } ${active ? "text-brand-gold" : "text-brand-muted"}`}
    >
      {icon}
      <span className="whitespace-nowrap font-manrope text-[11px] uppercase tracking-[0.1em] leading-none">{label}</span>
    </button>
  );
}

/**
 * Segmented "Watched · Like · List" control shown in the film hero. LIKE and WATCHED
 * are wired to the real toggle endpoints (POST /api/films/{id}/like and /watch) and
 * seeded from the server's per-user state on load. LIST is a local-only toggle — there
 * is no add-to-list endpoint yet.
 */
export default function FilmActionBar({
  filmId,
  isAuthed,
  initialLiked,
  initialWatched,
  initialInLists,
  film,
}: {
  filmId: string;
  isAuthed: boolean;
  /** Current user's saved state from GET /films/{id} (authed): isLikedByMe /
   * isWatchedByMe. Undefined for anonymous viewers (who can't toggle anyway). */
  initialLiked?: boolean;
  initialWatched?: boolean;
  /** How many of the user's lists already contain this film (for the highlight). */
  initialInLists?: number;
  /** Film meta for the Add-to-list modal header. */
  film?: { title?: string; year?: string; primaryGenre?: string; posterUrl?: string | null };
}) {
  const router = useRouter();
  // Seed from the server's per-user truth (GET /films/{id} authed). Since the prop
  // comes from the server-rendered page, this is hydration-safe.
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [watched, setWatched] = useState(initialWatched ?? false);
  const [inListCount, setInListCount] = useState(initialInLists ?? 0);
  const [listOpen, setListOpen] = useState(false);

  // Each desired like state maps to one toggle request; rapid clicks stay responsive.
  // serverLiked starts from the known server state so the first click sends one toggle.
  const desired = useRef(initialLiked ?? false);
  const serverLiked = useRef(initialLiked ?? false);
  const syncing = useRef(false);

  async function syncLike() {
    if (syncing.current) return;
    syncing.current = true;
    try {
      while (desired.current !== serverLiked.current) {
        const res = await fetch(`/api/films/${filmId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (res.status === 401 || res.status === 403) {
          desired.current = serverLiked.current;
          setLiked(serverLiked.current);
          router.push("/login");
          return;
        }
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error(`Film like request failed: ${res.status} ${detail}`);
          desired.current = serverLiked.current;
          setLiked(serverLiked.current);
          return;
        }
        const data = await res.json().catch(() => null);
        serverLiked.current = getLikedFromResponse(data) ?? desired.current;
        setLiked(serverLiked.current);
      }
    } catch {
      desired.current = serverLiked.current;
      setLiked(serverLiked.current);
    } finally {
      syncing.current = false;
    }
  }

  function handleLike() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    desired.current = !desired.current;
    setLiked(desired.current);
    void syncLike();
  }

  const watchPending = useRef(false);

  async function handleWatched() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    if (watchPending.current) return;
    watchPending.current = true;
    const next = !watched;
    setWatched(next); // optimistic
    try {
      const res = await fetch(`/api/films/${filmId}/watch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.status === 401 || res.status === 403) {
        setWatched(!next);
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error(`Watch request failed: ${res.status} ${detail}`);
        setWatched(!next); // revert
        return;
      }
      // Trust the server's reported state when it returns one, so the button
      // reflects the truth a refresh would show (and stays correct once /watch
      // becomes a real toggle).
      const data = await res.json().catch(() => null);
      const serverWatched = getWatchedFromResponse(data);
      if (serverWatched !== null) setWatched(serverWatched);
    } catch {
      setWatched(!next); // revert
    } finally {
      watchPending.current = false;
    }
  }

  function handleList() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    setListOpen(true);
  }

  return (
    <>
      <div className="inline-flex overflow-hidden rounded-[4px] border border-[rgba(155,143,132,0.46)]">
        <SegItem
          icon={<EyeIcon active={watched} />}
          label="Watched"
          active={watched}
          onClick={handleWatched}
          title={isAuthed ? (watched ? "Mark as not watched" : "Mark as watched") : "Log in to track"}
        />
        <SegItem
          icon={<HeartIcon active={liked} />}
          label="Like"
          active={liked}
          withBorder
          onClick={handleLike}
          title={isAuthed ? (liked ? "Unlike film" : "Like film") : "Log in to like"}
        />
        <SegItem
          icon={<ListIcon />}
          label="Add to list"
          active={inListCount > 0}
          withBorder
          onClick={handleList}
          title={isAuthed ? "Add to a list" : "Log in to add to a list"}
        />
      </div>

      <AddToListModal
        open={listOpen}
        onClose={() => setListOpen(false)}
        filmId={filmId}
        isAuthed={isAuthed}
        film={film}
        onMembershipChange={setInListCount}
      />
    </>
  );
}
