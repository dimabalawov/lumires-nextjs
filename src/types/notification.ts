export type NotificationType =
  | "likedReview"
  | "followed"
  | "reviewReplied"
  | "likedReviewComment"
  | "threadReplied"
  | "likedThread"
  | "likedThreadComment"
  | "likedFilmsList"
  | "followedBack";

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  senderId: string;
  senderName?: string | null;
  senderAvatar?: string | null;
  targetId?: string | null;
  targetPayload?: string | null;
  createdAt: string;
  readAt?: string;
}

export interface NotificationResponse {
  notifications: NotificationMessage[]
}