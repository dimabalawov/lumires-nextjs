"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "FILMS", href: "/films" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "LISTS", href: "/lists" },
  { label: "THREADS", href: "/threads" },
  { label: "COMMUNITY", href: "/community" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`uppercase font-light text-base tracking-[0.12em] transition-opacity ${
              isActive
                ? "text-brand-gold border-b border-brand-gold"
                : "text-white hover:opacity-70"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
