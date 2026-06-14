import type { Review, ActivityReview } from "@/types/review";
import { formatTimeAgo } from "./date";

export function toActivityReview(r: Review): ActivityReview {
  return {
    id: String(r.id),
    href: `/review/${r.id}`, 
    avatarUrl: r.avatarUrl ?? "",
    username: r.username,
    rating: r.rating,
    timeAgo: formatTimeAgo(r.createdAt), 
    replies: r.repliesCount ?? 0,
    filmTitle: r.filmTitle,
    filmHref: `/films/${r.filmId}`,
    title: r.title ?? "",
    body: r.text ? r.text.split("\n") : [],
    likes: r.likesCount ?? 0,
    isLikedByMe: r.isLikedByMe ?? false,
    isSavedByMe: r.isSavedByMe ?? false,
    posterUrl: r.filmPosterPath ?? "",
  };
}