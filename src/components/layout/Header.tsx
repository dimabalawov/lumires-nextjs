"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NavLink } from "@/types/nav";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import Image from "next/image";
import { getMeWithAvatarClient } from "@/lib/auth/client";
import SearchOverlay from "../sections/SearchOverlay";
import { NotificationMessage } from "@/types/notification";
import NotificationBell from "../ui/NotificationBell";
import { getNotifications, markRead } from "@/lib/api/notifications.client";
import { subscribe } from "@/lib/signalr/notifications/service";
import HeaderNav from "../ui/HeaderNav";

const navLinks: NavLink[] = [
  { label: "FILMS", href: "/films" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "LISTS", href: "/lists" },
  { label: "THREADS", href: "/threads" },
  { label: "COMMUNITY", href: "/community" },
];

const supabase = createClient();

export default function Header() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[] | null>(null)

  const [searchOpen, setSearchOpen] = useState(false);

  async function loadProfile(accessToken: string) {
    setLoading(true);
    try {
      let notifyResponse = null;
      const profile = await getMeWithAvatarClient(accessToken);
      if (profile) {
        notifyResponse = await getNotifications(profile.username);
        setNotifications(notifyResponse.notifications);
      }
      setUsername(profile?.username ?? null);
      setAvatarUrl(profile?.avatarUrl ?? null);
    } catch {
      setUsername(null);
      setAvatarUrl(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();

    setUsername(null);
    setAvatarUrl(null);

    router.refresh();
  }

  async function handleMarkAllRead() {
    setNotifications((prev) =>
      prev ? prev.map((n) => ({ ...n, readAt: new Date().toISOString() })) : prev
    );

    if (notifications && notifications.length > 0) {
      const notificationIds = notifications.map((n) => n.id);
      await markRead(username ?? "", notificationIds);
    }
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (!session?.access_token) {
          setLoading(false);
          return;
        }
        await loadProfile(session.access_token);
        return;
      }

      if (event === "SIGNED_OUT") {
        setUsername(null);
        setAvatarUrl(null);
        setLoading(false);
        return;
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe((notification) => {
      setNotifications((prev) => [notification, ...(prev ?? [])]);
    });

    return unsubscribe;
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/70 to-transparent pointer-events-none h-[200%]" />

      <nav className="relative section-container flex items-center justify-between py-5">
        <Link
          href="/"
          aria-label="Lumieres home"
          className="inline-flex items-center hover:opacity-70 transition-opacity"
        >
          <Logo />
        </Link>

        <HeaderNav/>

        {/* Desktop auth + search */}
        <div className="hidden lg:flex items-center gap-6">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          ) : username ? (
            <>
              <Link href={`/users/${username}`}>
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username ?? "User avatar"}
                    width={40}
                    height={40}
                    className="rounded-full aspect-square object-cover object-center border border-brand-gold"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-gold text-black flex items-center justify-center text-sm font-medium">
                    {username?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white cursor-pointer uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white cursor-pointer uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                LOG IN
              </Link>
              <Link
                href="/signup"
                className="text-brand-gold cursor-pointer uppercase font-light text-base tracking-[0.12em] border border-brand-gold px-4 py-1.5 hover:bg-brand-gold hover:text-black transition-colors"
              >
                SIGN UP
              </Link>
            </>
          )}

          {username && (
            <NotificationBell
              count={notifications?.length ?? 0}
              notifications={notifications ?? []}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          <button
            onClick={() => setSearchOpen(true)}
            className="text-brand-gold cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Search"
          >
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
          <button className="text-white cursor-pointer hover:opacity-70 transition-opacity p-1" aria-label="Search">
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
            className="text-white cursor-pointer hover:opacity-70 transition-opacity p-1"
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
        <div className="fixed inset-0 z-60 bg-brand-dark/97 flex flex-col items-center justify-center gap-8 lg:hidden">
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
              className="text-brand-light cursor-pointer uppercase font-oswald font-light text-[28px] tracking-[0.12em] hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-px w-16 bg-brand-gold/40" />

          {/* Auth links */}
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          ) : username ? (
            <>
              <Link
                href={`/users/${username}`}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username ?? "User avatar"}
                    width={72}
                    height={72}
                    className="rounded-full aspect-square object-cover object-center border border-brand-gold"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-full bg-brand-gold text-black flex items-center justify-center text-2xl font-medium">
                    {username?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="text-brand-light cursor-pointer uppercase font-oswald font-light text-[20px] tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-brand-light cursor-pointer uppercase font-oswald font-light text-[20px] tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                LOG IN
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-brand-light cursor-pointer uppercase font-oswald font-light text-[20px] tracking-[0.12em] hover:opacity-70 transition-opacity"
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

    </header>
  );
}
