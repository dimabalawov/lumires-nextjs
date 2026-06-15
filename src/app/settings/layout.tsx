import Link from "next/link";
import type { ReactNode } from "react";
import SettingsSidebar from "@/components/ui/SettingsSidebar";
import { getSettings } from "@/lib/api/users";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const me = await getSettings();
  return (
    <main className="min-h-screen bg-brand-dark pt-28 lg:pt-32 pb-20">
      <div className="section-container">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-gold/30 
            px-4 py-2 font-manrope text-[12px] uppercase tracking-[0.14em] 
            text-brand-light transition-colors hover:border-brand-gold/60"
          >
            Back to home
          </Link>
          <span className="font-oswald text-[22px] text-sm uppercase tracking-[4.4px] leading-5.5 text-brand-light">
            Settings
          </span>
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <aside className="shrink-0 lg:w-57.5">
            <SettingsSidebar />
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}