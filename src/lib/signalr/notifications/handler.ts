import type { NotificationMessage } from "@/types/notification";
import { getSenderUrl, getTargetUrl } from "./routes";
import { toast } from "./toast";
import { getNotificationText } from "./getNotificationText";

export function handleNotification(n: NotificationMessage) {
  const senderName = n.senderName ?? "Someone";
  const senderAvatar = n.senderAvatar ?? undefined;
  const senderUrl = getSenderUrl(n);
  const targetUrl = getTargetUrl(n);
  const text = getNotificationText(n.type);

  toast({
    title: senderName,
    message: text,
    type: n.type,
    senderUrl,
    senderAvatar,
    targetUrl,
    targetPayload: n.targetPayload ?? null,
  });
}