import { NotificationResponse } from "@/types/notification";
import { apiRequest } from "./auth.client";
import { tmdbImage } from "../images/tmdb";

export async function getNotifications(username: string): Promise<NotificationResponse> {
    var res = await apiRequest<NotificationResponse>(`/users/${username}/notifications`, {
        auth: true,
        authExcep: true,
        cache: "no-store"
    })
    res.notifications = res.notifications.map((notification)=> ({
        ...notification,
        senderAvatar: tmdbImage(notification.senderAvatar, "w342") ?? ""
    }))

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