import { NotificationMessage, NotificationType } from "@/types/notification";
import { getConnection } from "../connection";
import { handleNotification } from "./handler";

const validTypes: Record<string, true> = {
    LikedReview: true,
    Followed: true,
    ReviewReplied: true,
    LikedReviewComment: true,
    ThreadReplied: true,
    LikedThread: true,
    LikedThreadComment: true,
    LikedFilmsList: true,
    FollowedBack: true,
};

export function isNotificationType(value: string): value is NotificationType {
    return validTypes[value] === true;
}

type Handler = (n: NotificationMessage) => void;

let handlers: Handler[] = [];
let started = false;

export async function startNotifications() {
    const conn = getConnection();

    if (started) return;
    started = true;
    conn.on("ReceiveNotification", (data: unknown) => {
        const candidate = data as Partial<NotificationMessage> | null;
        if (!candidate?.type || !isNotificationType(candidate.type)) return;

        const notification = candidate as NotificationMessage;

        handleNotification(notification);

        handlers.forEach((h) => h(notification));
    });

    await conn.start();
}

export function subscribe(handler: Handler) {
    handlers.push(handler);

    return () => {
        handlers = handlers.filter((h) => h !== handler);
    };
}