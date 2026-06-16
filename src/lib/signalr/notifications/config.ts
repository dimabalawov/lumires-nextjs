// lib/notifications/config.ts
import type { NotificationMessage, NotificationType } from "@/types/notification";

const LikeIcon = "/imgs/notifications/like.svg";
const ReplyIcon = "/imgs/notifications/reply.svg";
const UserIcon = "/imgs/notifications/user.svg";

export const notificationConfig: Record<
    NotificationType,
    {
        icon: string;
        color: string;
        text: string;
        group: "likes" | "follows" | "mentions";

        senderUrl: (n: NotificationMessage) => string | null;
        targetUrl: (n: NotificationMessage) => string | null;

        payloadClickable?: boolean;
    }
> = {
    followed: {
        icon: UserIcon,
        color: "#D2A66A",
        text: "started following you",
        group: "follows",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,
    },

    followedBack: {
        icon: UserIcon,
        color: "#D2A66A",
        text: "followed you back",
        group: "follows",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,
    },

    likedReview: {
        icon: LikeIcon,
        color: "#D2A66A",
        text: "liked your review on",
        group: "likes",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: (n) =>
            n.targetId ? `/reviews/${encodeURIComponent(n.targetId)}` : null,

        payloadClickable: true,
    },

    likedReviewComment: {
        icon: LikeIcon,
        color: "#D2A66A",
        text: "liked your review comment",
        group: "likes",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: (n) => n.targetId ? `/reviews/${encodeURIComponent(n.targetId)}` : null
    },

    reviewReplied: {
        icon: ReplyIcon,
        color: "#D2A66A",
        text: "replied to your review on",
        group: "mentions",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: (n) =>
            n.targetId ? `/review/${encodeURIComponent(n.targetId)}` : null,

        payloadClickable: true,
    },

    threadReplied: {
        icon: ReplyIcon,
        color: "#D2A66A",
        text: "replied to your thread",
        group: "mentions",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: () => "/threads",
    },

    likedThread: {
        icon: LikeIcon,
        color: "#D2A66A",
        text: "liked your thread",
        group: "likes",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: () => "/threads",
    },

    likedThreadComment: {
        icon: LikeIcon,
        color: "#D2A66A",
        text: "liked your thread comment",
        group: "likes",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: () => "/threads",
    },

    likedFilmsList: {
        icon: LikeIcon,
        color: "#D2A66A",
        text: "liked your film list",
        group: "likes",

        senderUrl: (n) =>
            n.senderName ? `/users/${encodeURIComponent(n.senderName)}` : null,

        targetUrl: (n) =>
            n.targetId ? `/lists/${encodeURIComponent(n.targetId)}` : null,
    },
};