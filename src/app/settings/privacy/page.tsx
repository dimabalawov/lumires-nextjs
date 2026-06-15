import { redirect } from "next/navigation";
import { getSettings } from "@/lib/api/users";
import PrivacyForm from "@/components/sections/PrivacyForm";

export default async function SettingsPrivacyPage() {
  const me = await getSettings();
  if (!me) redirect("/login");

  return (
    <div className="flex flex-col">
      <p className="font-oswald font-light text-[11px] uppercase tracking-[3.3px] leading-2.75 text-brand-gold">Privacy</p>
      <span className="mt-2 h-fit font-manrope text-[34px] text-brand-light">Who sees what</span>

      <PrivacyForm initial={me} />
    </div>
  );
}