"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type MouseEvent } from "react";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="12" viewBox="27.5 9 13 12" fill="none" aria-hidden>
      <path
        d="M34.0002 20.1C34.0002 20.1 29.9169 17.475 28.4585 14.85C27.9944 14.1151 27.8412 13.2259 28.0326 12.3781C28.2241 11.5303 28.7445 10.7933 29.4794 10.3291C30.2142 9.865 31.1034 9.71181 31.9512 9.90325C32.799 10.0947 33.5361 10.6151 34.0002 11.35C34.4643 10.6151 35.2014 10.0947 36.0492 9.90325C36.897 9.71181 37.7862 9.865 38.521 10.3291C39.2559 10.7933 39.7763 11.5303 39.9677 12.3781C40.1592 13.2259 40.006 14.1151 39.5419 14.85C38.0835 17.475 34.0002 20.1 34.0002 20.1Z"
        stroke="currentColor"
        strokeWidth="0.816667"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function ActionButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-9 w-[68px] flex-col items-center justify-center gap-1 rounded-[2px] border transition-colors ${
        active
          ? "border-brand-gold/70 bg-brand-gold/10 text-brand-gold"
          : "border-brand-gold/45 text-brand-gold hover:bg-brand-gold/5"
      }`}
    >
      {children}
      <span className="font-manrope text-[10px] uppercase tracking-[0.18em] leading-none">
        {label}
      </span>
    </button>
  );
}

interface ListActionsProps {
  listId: string;
  initialLiked?: boolean;
  isAuthed: boolean;
}

/**
 * Like + Save buttons for a list. Each desired state change maps to one request
 * while rapid clicks stay responsive (same convergence pattern as FilmLikeButton):
 * the UI updates optimistically, a single in-flight loop drives the server to the
 * desired state, and any failure reverts to the last known server state.
 */
export default function ListActions({
  listId,
  initialLiked = false,
  isAuthed,
}: ListActionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);

  const like = useRef({ desired: initialLiked, server: initialLiked, syncing: false });

  async function sync(
    state: { desired: boolean; server: boolean; syncing: boolean },
    setUi: (v: boolean) => void,
    request: (target: boolean) => Promise<Response>,
    readState: (data: unknown) => boolean | null,
  ) {
    if (state.syncing) return;
    state.syncing = true;
    try {
      while (state.desired !== state.server) {
        const target = state.desired;
        const res = await request(target);

        if (res.status === 401 || res.status === 403) {
          state.desired = state.server;
          setUi(state.server);
          router.push("/login");
          return;
        }
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error(`List action failed: ${res.status} ${detail}`);
          state.desired = state.server;
          setUi(state.server);
          return;
        }

        const data = await res.json().catch(() => null);
        state.server = readState(data) ?? target;
        setUi(state.server);
      }
    } catch {
      state.desired = state.server;
      setUi(state.server);
    } finally {
      state.syncing = false;
    }
  }

  function readBool(data: unknown, ...keys: string[]): boolean | null {
    if (!data || typeof data !== "object") return null;
    const rec = data as Record<string, unknown>;
    for (const key of keys) {
      if (typeof rec[key] === "boolean") return rec[key] as boolean;
    }
    return null;
  }

  function handleLike(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    like.current.desired = !like.current.desired;
    setLiked(like.current.desired);
    void sync(
      like.current,
      setLiked,
      () =>
        fetch(`/api/lists/${listId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }),
      (data) => readBool(data, "isLiked", "liked", "isLikedByMe"),
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ActionButton label="Like" active={liked} onClick={handleLike}>
        <HeartIcon filled={liked} />
      </ActionButton>
    </div>
  );
}
