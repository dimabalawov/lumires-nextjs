import type { NotificationType } from "@/types/notification";

const map: Record<NotificationType, string> = {
  LikedReview: "liked your review",
  Followed: "started following you",
  FollowedBack: "followed you back",
  ReviewReplied: "replied to your review",
  LikedReviewComment: "liked your comment",
  ThreadReplied: "replied to your thread",
  LikedThread: "liked your thread",
  LikedThreadComment: "liked your thread comment",
  LikedFilmsList: "liked your film list",
};

export function getNotificationText(type: NotificationType): string {
  return map[type] ?? "interacted with your content";
}