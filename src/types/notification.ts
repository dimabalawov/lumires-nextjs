export type NotificationType =
  | "LikedReview"
  | "Followed"
  | "ReviewReplied"
  | "LikedReviewComment"
  | "ThreadReplied"
  | "LikedThread"
  | "LikedThreadComment"
  | "LikedFilmsList"
  | "FollowedBack";

export interface NotificationMessage {
  type: NotificationType;
  senderId: string;
  senderName?: string | null;
  senderAvatar?: string | null;
  targetId?: string | null;
  targetPayload?: string | null;
  createdAt: string;
}