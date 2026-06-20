import { NotificationResponse } from "@/types/notification";
import { apiRequest } from "./auth.client";
import toAvatarUrl from "../images/storage";

export async function getNotifications(username: string): Promise<NotificationResponse> {
    const res = await apiRequest<NotificationResponse>(`/users/${username}/notifications`, {
        auth: true,
        authExcep: true,
        cache: "no-store"
    })
    res.notifications = await Promise.all(
        res.notifications.map(async (notification) => ({
            ...notification,
            senderAvatar: (await toAvatarUrl(notification.senderAvatar)) ?? ""
        }))
    )

    return res;
}

export async function markRead(username: string, notifications: string[]): Promise<void> {
    return await apiRequest<void>(
        `/users/${username}/notifications/read`,
        {
            method: "POST",
            auth: true,
            authExcep: true,
            body: {
                ids: notifications,
            },
            cache: "no-store",
        }
    );
}