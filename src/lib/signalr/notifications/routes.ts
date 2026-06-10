import { NotificationMessage } from "@/types/notification";

export function getSenderUrl(senderId: string) {
  return `/users/${senderId}`;
}

export function getTargetUrl(n: NotificationMessage): string | null {
  if (!n.targetId) return null;

  switch (n.type) {
    case "LikedReview":
    case "ReviewReplied":
    case "LikedReviewComment":
      return `/reviews/${n.targetId}`;

    case "ThreadReplied":
    case "LikedThread":
    case "LikedThreadComment":
      return `/threads/${n.targetId}`;

    case "LikedFilmsList":
      return `/lists/${n.targetId}`;

    case "Followed":
    case "FollowedBack":
      return `/users/${n.senderId}`;

    default:
      return null;
  }
}