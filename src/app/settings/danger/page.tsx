import { redirect } from "next/navigation";
import { getSettings } from "@/lib/api/users";
import DangerZone from "@/components/sections/DangerZoneSection";

export default async function SettingsDangerPage() {
  const me = await getSettings();
  if (!me) redirect("/login");

  return (
    <div className="flex flex-col">
      <p className="font-oswald font-light text-[11px] uppercase tracking-[3.3px] leading-2.75 text-brand-gold">Danger zone</p>
      <span className="mt-2 h-fit font-manrope text-[34px] text-brand-light">Delete account</span>
      <p className="mt-3 max-w-lg font-manrope text-[14px] leading-relaxed text-brand-muted">
        These actions affect your whole account. Proceed carefully.
      </p>

      <DangerZone />
    </div>
  );
}