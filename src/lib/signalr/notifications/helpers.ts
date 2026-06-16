import type { NotificationType } from "@/types/notification";
import { notificationConfig } from "./config";

export function getNotificationText(type: NotificationType): string {
  return notificationConfig[type]?.text ?? "interacted with your content";
}

export function getNotificationIcon(type: NotificationType) {
  return notificationConfig[type]?.icon;
}

export function getNotificationColor(type: NotificationType) {
  return notificationConfig[type]?.color ?? "#D2A66A";
}