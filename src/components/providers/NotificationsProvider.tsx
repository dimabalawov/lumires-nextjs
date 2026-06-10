"use client";

import { startNotifications } from "@/lib/signalr/notifications/service";
import { useEffect } from "react";

export default function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    startNotifications();
  }, []);

  return <>{children}</>;
}