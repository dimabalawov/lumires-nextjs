"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4 shrink-0",
  };
  switch (name) {
    case "profile":
      return <svg {...common}><circle cx="10" cy="7" r="3.2" /><path d="M4 16c1.2-2.6 3.4-4 6-4s4.8 1.4 6 4" /></svg>;
    case "favourite-films":
      return <svg {...common}><path d="M10 16.5C6 13.5 3.5 11 3.5 8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 3-2.5 5.5-6.5 8.5Z" /></svg>;
    case "account":
      return <svg {...common}><rect x="3.5" y="5" width="13" height="10" rx="2" /><path d="M6.5 9h3M6.5 11.5h5" /></svg>;
    case "privacy":
      return <svg {...common}><rect x="5" y="9" width="10" height="7" rx="1.6" /><path d="M7 9V7a3 3 0 0 1 6 0v2" /></svg>;
    case "notifications":
      return <svg {...common}><path d="M6 8a4 4 0 0 1 8 0c0 3.5 1.2 5 1.2 5H4.8S6 11.5 6 8Z" /><path d="M8.4 16a1.7 1.7 0 0 0 3.2 0" /></svg>;
    case "appearance":
      return <svg {...common}><path d="M4 13h12M4 13a3 3 0 0 0 6 0M10 7h6M10 7a3 3 0 0 1 6 0" /></svg>;
    case "danger":
      return <svg {...common}><circle cx="10" cy="10" r="6.5" /><path d="M7.5 7.5l5 5M12.5 7.5l-5 5" /></svg>;
    default:
      return null;
  }
}

const ITEMS: { key: string; label: string; href: string }[] = [
  { key: "profile", label: "Profile", href: "/settings" },
  { key: "favourite-films", label: "Favourite films", href: "/settings/favourite-films" },
  { key: "account", label: "Account", href: "/settings/account" },
  { key: "privacy", label: "Privacy", href: "/settings/privacy" },
  { key: "notifications", label: "Notifications", href: "/settings/notifications" },
  { key: "danger", label: "Danger zone", href: "/settings/danger" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        const content: ReactNode = (
          <>
            <Icon name={item.key} />
            <span className="font-manrope text-[14px] tracking-[0.01em]">{item.label}</span>
          </>
        );
        return (
          <Link
            key={item.key}
            href={item.href}
            className={[
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-colors",
              active
                ? "bg-brand-gold/10 text-brand-gold ring-1 ring-brand-gold/15"
                : "text-brand-muted hover:text-brand-gold",
              item.key === "danger" && !active ? "hover:text-red-400" : "",
            ].join(" ")}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}