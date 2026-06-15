import { redirect } from "next/navigation";
import { getSettings } from "@/lib/api/users";
import NotificationsForm from "@/components/sections/NotificationForm";

export default async function SettingsNotificationsPage() {
  const me = await getSettings();
  if (!me) redirect("/login");

  return (
    <div className="flex flex-col">
      <p className="font-oswald font-light text-[11px] uppercase tracking-[3.3px] leading-2.75 text-brand-gold">Notifications</p>
      <span className="mt-2 h-fit font-manrope text-[34px] text-brand-light">How we reach you</span>
      <p className="mt-3 max-w-lg font-manrope text-[14px] leading-relaxed text-brand-muted">
        Choose what you&apos;re notified about, and where.
      </p>

      <NotificationsForm initial={me} />
    </div>
  );
}