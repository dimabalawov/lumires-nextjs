import { NotificationMessage } from "@/types/notification";

/**
 * App-relative links for notification toasts. These navigate within the app —
 * they must NOT point at the API host. /profile/[slug] resolves by username,
 * so we need senderName (the id has no profile route).
 */
export function getSenderUrl(n: NotificationMessage): string | undefined {
  return n.senderName ? `/profile/${encodeURIComponent(n.senderName)}` : undefined;
}

export function getTargetUrl(n: NotificationMessage): string | null {
  switch (n.type) {
    case "Followed":
    case "FollowedBack":
      return getSenderUrl(n) ?? null;

    case "LikedReview":
    case "ReviewReplied":
    case "LikedReviewComment":
      return n.targetId ? `/review/${encodeURIComponent(n.targetId)}` : null;

    // No per-thread page yet — land on the threads index.
    case "ThreadReplied":
    case "LikedThread":
    case "LikedThreadComment":
      return "/threads";

    case "LikedFilmsList":
      return n.targetId ? `/lists/${encodeURIComponent(n.targetId)}` : null;

    default:
      return null;
  }
}
