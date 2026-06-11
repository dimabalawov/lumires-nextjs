import { NotificationMessage } from "@/types/notification";


const API = process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "http://localhost:49320"; //DIMA change for api.supabase.win


export function getSenderUrl(senderId: string) {
  return `${API}/users/${senderId}`;
}

export function getTargetUrl(n: NotificationMessage): string | null {
  if (!n.targetId) return null;

  switch (n.type) {
    case "LikedReview":
    case "ReviewReplied":
    case "LikedReviewComment":
      return `${API}/reviews/${n.targetId}`;

    case "ThreadReplied":
    case "LikedThread":
    case "LikedThreadComment":
      return `${API}/threads/${n.targetId}`;

    case "LikedFilmsList":
      return `${API}/lists/${n.targetId}`;

    case "Followed":
    case "FollowedBack":
      return `${API}/users/${n.senderId}`;

    default:
      return null;
  }
}