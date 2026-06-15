import { redirect } from "next/navigation";
import { getSettings } from "@/lib/api/users";
import AccountForm from "@/components/sections/AccountForm";

export default async function SettingsAccountPage() {
  const me = await getSettings();
  if (!me) redirect("/login");

  return (
    <div className="flex flex-col">
      <p className="font-oswald font-light text-[11px] uppercase tracking-[3.3px] leading-2.75 text-brand-gold">Account</p>
      <span className="mt-2 h-fit font-manrope text-[34px] text-brand-light">Account &amp; security</span>

      <AccountForm initial={me} />
    </div>
  );
}