import { redirect } from "next/navigation";
import IdentityForm from "@/components/sections/IdentityForm";
import { getSettings } from "@/lib/api/users";

export default async function SettingsProfilePage() {
  const me = await getSettings();
  if (!me) redirect("/login");

  return (
    <div className="flex flex-col">
      <p className="font-oswald font-light text-[11px] uppercase tracking-[3.3px] leading-2.75 text-brand-gold">Profile</p>
      <span className="mt-2 h-fit font-manrope text-[34px] text-brand-light">
        Your identity
      </span>
      <p className="mt-3 max-w-lg font-manrope text-[14px] leading-relaxed text-brand-muted">
        This is how you appear across Lumières — on your reviews, lists, and in the community.
      </p>

      <IdentityForm initial={me} />
    </div>
  );
}