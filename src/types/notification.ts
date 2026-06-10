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
  targetId?: string | null;
  createdAt: string;
}