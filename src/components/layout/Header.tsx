"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { NavLink } from "@/types/nav";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";
import type { User } from "@supabase/supabase-js";

const navLinks: NavLink[] = [
  { label: "FILMS", href: "/films" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "LISTS", href: "/lists" },
  { label: "THREADS", href: "/threads" },
  { label: "COMMUNITY", href: "/community" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const username =
    user?.user_metadata?.username ??
    user?.email?.split("@")[0] ??
    null;

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none h-[150%]" />

      <nav className="relative section-container flex items-center justify-between py-5">
        <Link
          href="/"
          className="text-white uppercase font-light text-[18px] tracking-[0.2em] hover:opacity-70 transition-opacity"
        >
          LOGO
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth + search */}
        <div className="hidden lg:flex items-center gap-5">
          {username ? (
            <>
              <span className="text-brand-gold uppercase font-light text-base tracking-[0.12em]">
                {username}
              </span>
              <button
                onClick={() => signOut()}
                className="text-white uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                LOG IN
              </Link>
              <Link
                href="/signup"
                className="text-white uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN UP
              </Link>
            </>
          )}

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

        {/* Mobile: search + hamburger */}
        <div className="lg:hidden flex items-center gap-3">
          <button className="text-white hover:opacity-70 transition-opacity p-1" aria-label="Search">
            <svg
              width="20"
              height="20"
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
          <button
            className="text-white hover:opacity-70 transition-opacity p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-brand-dark/97 flex flex-col items-center justify-center gap-8 lg:hidden">
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-white hover:opacity-70 transition-opacity p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-brand-light uppercase font-oswald font-light text-[28px] tracking-[0.12em] hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-px w-16 bg-brand-gold/40" />

          {/* Auth links */}
          {username ? (
            <>
              <span className="text-brand-gold uppercase font-oswald font-light text-[20px] tracking-[0.12em]">
                {username}
              </span>
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="text-brand-light uppercase font-oswald font-light text-[20px] tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-brand-light uppercase font-oswald font-light text-[20px] tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                LOG IN
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-brand-light uppercase font-oswald font-light text-[20px] tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
