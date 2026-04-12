import Link from "next/link";
import { NavLink } from "@/types/nav";

const navLinks: NavLink[] = [
  { label: "FILMS", href: "/films" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "LISTS", href: "/lists" },
  { label: "THREADS", href: "/threads" },
  { label: "COMMUNITY", href: "/community" },
];

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none h-[150%]" />

      <nav className="relative flex items-center justify-between w-[90%] max-w-[1800px] mx-auto py-5">
        <Link
          href="/"
          className="text-white uppercase tracking-widest hover:opacity-70 transition-opacity"
          style={{ fontWeight: 300, fontSize: "18px", letterSpacing: "0.2em" }}
        >
          LOGO
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white uppercase hover:opacity-70 transition-opacity"
              style={{ fontWeight: 300, fontSize: "16px", letterSpacing: "0.12em" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/signup"
            className="text-white uppercase hover:opacity-70 transition-opacity"
            style={{ fontWeight: 300, fontSize: "16px", letterSpacing: "0.12em" }}
          >
            SIGN UP
          </Link>

          <button className="text-white hover:opacity-70 transition-opacity" aria-label="Search">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
