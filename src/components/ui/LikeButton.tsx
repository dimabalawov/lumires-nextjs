"use client";

import { useRef, useState, type MouseEvent } from "react";

function HeartIcon({ filled = false, className }: { filled?: boolean; className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M7.00019 12.25C7.00019 12.25 2.91686 9.62499 1.45852 6.99999C0.994395 6.26512 0.841201 5.37597 1.03264 4.52815C1.22409 3.68033 1.74449 2.94328 2.47936 2.47915C3.21423 2.01502 4.10337 1.86183 4.9512 2.05327C5.79902 2.24472 6.53606 2.76512 7.00019 3.49999C7.46432 2.76512 8.20136 2.24472 9.04918 2.05327C9.89701 1.86183 10.7862 2.01502 11.521 2.47915C12.2559 2.94328 12.7763 3.68033 12.9677 4.52815C13.1592 5.37597 13.006 6.26512 12.5419 6.99999C11.0835 9.62499 7.00019 12.25 7.00019 12.25Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="0.816667"
      />
    </svg>
  );
}

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
