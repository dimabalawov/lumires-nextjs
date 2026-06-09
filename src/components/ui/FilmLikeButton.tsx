"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type MouseEvent } from "react";
import Button from "@/components/ui/Button";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function getLikedFromResponse(data: unknown): boolean | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const value = record.isLiked ?? record.liked ?? record.isLikedByMe;
  return typeof value === "boolean" ? value : null;
}

export default function FilmLikeButton({
  filmId,
  isAuthed,
}: {
  filmId: string;
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  // Same convergence pattern as review likes: each desired state change maps to
  // one toggle request, while rapid clicks stay responsive.
  const desired = useRef(false);
  const serverLiked = useRef(false);
  const syncing = useRef(false);

  const endpoint = `/api/films/${filmId}/like`;

  async function sync() {
    if (syncing.current) return;
    syncing.current = true;
    try {
      while (desired.current !== serverLiked.current) {
        const res = await fetch(endpoint, {
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

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthed) {
      router.push("/login");
      return;
    }

    desired.current = !desired.current;
    setLiked(desired.current);
    void sync();
  }

  return (
    <Button
      variant="neutralOutlined"
      iconOnly
      onClick={handleClick}
      aria-label={liked ? "Unlike film" : "Like film"}
      aria-pressed={liked}
      title={isAuthed ? (liked ? "Unlike film" : "Like film") : "Log in to like"}
      className={liked ? "text-brand-gold border-brand-gold/70" : ""}
    >
      <HeartIcon filled={liked} />
    </Button>
  );
}
