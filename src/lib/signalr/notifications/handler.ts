import type { NotificationMessage } from "@/types/notification";
import { toast } from "./toast";
import toAvatarUrl from "@/lib/images/storage";
import { notificationConfig } from "./config";

export async function handleNotification(n: NotificationMessage) {
  const senderName = n.senderName ?? "Someone";
  const senderAvatar = (await toAvatarUrl(n.senderAvatar)) ?? null;

  const config = notificationConfig[n.type];

  const senderUrl = config?.senderUrl?.(n) ?? undefined;
  const targetUrl = config?.targetUrl?.(n) ?? null;

  const text =
    config?.text ?? "interacted with your content";



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