import type { NotificationMessage } from "@/types/notification";
import { getSenderUrl, getTargetUrl } from "./routes";
import { toast } from "./toast";
import { getNotificationText } from "./getNotificationText";

export function handleNotification(n: NotificationMessage) {
  const senderName = n.senderName ?? "Someone";

  const senderUrl = getSenderUrl(n.senderId);
  const targetUrl = getTargetUrl(n);

  const text = getNotificationText(n.type);
  

  toast({
    title: senderName,
    message: text,
    senderUrl,
    targetUrl,
  });
}