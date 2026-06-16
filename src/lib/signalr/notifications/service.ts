import { NotificationMessage, NotificationType } from "@/types/notification";
import { getConnection } from "../connection";
import { handleNotification } from "./handler";
import { notificationConfig } from "./config";

type Handler = (n: NotificationMessage) => void;

let handlers: Handler[] = [];
let started = false;

function normalizeType(type: string): NotificationType | null {
    const found = Object.keys(notificationConfig).find(
        (k) => k.toLowerCase() === type.toLowerCase()
    );
    return (found as NotificationType) ?? null;
}

export async function startNotifications() {
    const conn = getConnection();

    if (started) return;
    started = true;
    conn.on("ReceiveNotification", (data: unknown) => {
        const candidate = data as Partial<NotificationMessage> | null;
        if (!candidate?.type) return;

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