"use client";

import { useRef, useState, type MouseEvent } from "react";
import { HeartIcon } from "@/components/ui/icons";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  isAuthed: boolean;
  /** Review being liked. */
  reviewId: string;
  /** When set, like this reply instead of the review itself. */
  replyId?: string;
  /** Film context forwarded to the API (resolves by reviewId, so "-" is fine). */
  filmId: string;
  slug: string;
  className?: string;
}

interface LikeResponse {
  isLiked: boolean;
  likesCount: number;
}

/**
 * Heart + like count. Logged-in users toggle the like with instant optimistic
 * feedback; the network call goes to a Route Handler (no page refresh) and only
 * reconciles the count. Logged-out users see a disabled heart with a tooltip.
 */
export default function LikeButton({
  liked,
  count,
  isAuthed,
  reviewId,
  replyId,
  filmId,
  slug,
  className,
}: LikeButtonProps) {
  const [state, setState] = useState({ liked, count });

  // Convergence state for the toggle endpoint: `desired` is what the user wants,
  // `serverLiked` is what the API last confirmed. A single in-flight loop walks
  // the difference so rapid clicks map 1:1 to toggles without ever blocking.
  const desired = useRef(liked);
  const serverLiked = useRef(liked);
  const syncing = useRef(false);

  const base = `flex items-center gap-2 ${className ?? ""}`;

  if (!isAuthed) {
    return (
      <span title="Log in to like" className={`${base} cursor-default`}>
        <HeartIcon filled={false} />
        {count} likes
      </span>
    );
  }

  const endpoint = replyId
    ? `/api/reviews/${reviewId}/replies/${replyId}/like`
    : `/api/reviews/${reviewId}/like`;

  async function sync() {
    if (syncing.current) return;
    syncing.current = true;
    try {
      while (desired.current !== serverLiked.current) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filmId, slug }),
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error(`Like request failed: ${res.status} ${detail}`);
          // Give up and snap back to the last server-confirmed truth.
          desired.current = serverLiked.current;
          setState({ liked: serverLiked.current, count });
          return;
        }
        const data: LikeResponse = await res.json();
        serverLiked.current = data.isLiked;
        setState({ liked: data.isLiked, count: data.likesCount });
      }
    } catch {
      desired.current = serverLiked.current;
      setState({ liked: serverLiked.current, count });
    } finally {
      syncing.current = false;
    }
  }

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    // The card may be wrapped in a <Link>; keep a like click from navigating.
    e.preventDefault();
    e.stopPropagation();
    desired.current = !desired.current;
    // Optimistic flip — instant, never disabled.
    setState((s) => ({ liked: desired.current, count: s.count + (desired.current ? 1 : -1) }));
    void sync();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={state.liked}
      className={`${base} cursor-pointer transition-colors hover:text-brand-gold ${
        state.liked ? "text-brand-gold" : ""
      }`}
    >
      <HeartIcon filled={state.liked} />
      {state.count} likes
    </button>
  );
}
