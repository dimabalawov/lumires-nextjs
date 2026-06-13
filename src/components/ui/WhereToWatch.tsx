"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import type { WatchProvider, WatchSources } from "@/lib/watch/sources";

type TabKey = "free" | "subRent";

const TAB_LABEL: Record<TabKey, string> = {
  free: "Free",
  subRent: "Subscribe & Rent",
};

function ProviderBadge({ provider }: { provider: WatchProvider }) {
  if (provider.logo) {
    return (
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[6px]">
        <Image src={provider.logo} alt="" fill sizes="36px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-[6px] font-oswald text-[18px] leading-none ${provider.badgeClass}`}
    >
      {provider.initial}
    </span>
  );
}

function ProviderRow({ provider }: { provider: WatchProvider }) {
  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 py-2.5 transition-opacity hover:opacity-90"
    >
      <ProviderBadge provider={provider} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-manrope text-[15px] leading-tight text-brand-light">
          {provider.name}
        </span>
        <span className="mt-0.5 font-manrope text-[11px] uppercase tracking-[0.08em] text-brand-muted">
          {provider.quality} · {provider.detail}
        </span>
      </span>
      <span className="ml-auto shrink-0 font-manrope text-[12px] uppercase tracking-[0.08em] text-brand-gold">
        {provider.category === "free" ? (
          <span className="rounded-[3px] border border-brand-gold/60 px-2 py-1 font-medium">
            Free
          </span>
        ) : provider.category === "sub" ? (
          "Subscribe"
        ) : provider.price != null ? (
          `$${provider.price.toFixed(2)}`
        ) : (
          "Rent"
        )}
      </span>
    </a>
  );
}

/**
 * "Where to watch" trigger + dropdown panel. Shows JustWatch-sourced providers
 * for a film, split into Free and Subscribe & Rent tabs (see {@link WatchSources}).
 * The panel defaults to whichever tab has providers, closes on Escape or an
 * outside click, and each row deep-links to the provider in a new tab.
 */
export default function WhereToWatch({ sources }: { sources: WatchSources }) {
  const hasFree = sources.free.length > 0;
  const hasSubRent = sources.subRent.length > 0;
  const hasAny = hasFree || hasSubRent;

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>(hasFree ? "free" : "subRent");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on Escape or any click outside the trigger + panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const rows = tab === "free" ? sources.free : sources.subRent;

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        variant="goldOutlined"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        rightIcon={
          <svg
            width="15"
            height="20"
            viewBox="0 0 15 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M1 7L7.5 13L14 7" />
          </svg>
        }
      >
        Where to watch
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Where to watch"
          className="absolute left-0 top-[calc(100%+12px)] z-50 w-[min(404px,calc(100vw-2rem))] rounded-[6px] border border-brand-gold/30 bg-brand-dark/98 p-5 shadow-2xl backdrop-blur-sm"
        >
          {/* Caret pointing up to the trigger */}
          <span className="absolute -top-2 left-8 size-4 rotate-45 border-l border-t border-brand-gold/30 bg-brand-dark" />

          <div className="relative flex items-center justify-between">
            <h3 className="font-oswald font-light uppercase tracking-[0.18em] text-[16px] text-brand-gold">
              Where to watch
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1 text-brand-muted transition-colors hover:text-brand-light"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {hasAny ? (
            <>
              {/* Tabs */}
              <div className="mt-4 grid grid-cols-2 gap-0 rounded-[4px] border border-brand-gold/20 p-1">
                {(["free", "subRent"] as TabKey[]).map((key) => {
                  const enabled = key === "free" ? hasFree : hasSubRent;
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!enabled}
                      onClick={() => setTab(key)}
                      className={`rounded-[3px] px-3 py-2.5 font-manrope text-[12px] uppercase tracking-[0.1em] transition-colors ${
                        active
                          ? "bg-brand-gold text-brand-dark"
                          : enabled
                            ? "text-brand-light hover:text-brand-gold"
                            : "cursor-not-allowed text-brand-muted/40"
                      }`}
                    >
                      {TAB_LABEL[key]}
                    </button>
                  );
                })}
              </div>

              {/* Provider list */}
              <div className="mt-2 flex max-h-[280px] flex-col divide-y divide-brand-muted/10 overflow-y-auto overscroll-contain pr-1">
                {rows.length > 0 ? (
                  rows.map((p) => <ProviderRow key={`${p.name}-${p.category}`} provider={p} />)
                ) : (
                  <p className="py-6 text-center font-manrope text-[13px] text-brand-muted">
                    Nothing here for your region.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="mt-4 py-6 text-center font-manrope text-[13px] text-brand-muted">
              No streaming sources found for your region yet.
            </p>
          )}

          <div className="mt-4 border-t border-brand-muted/15 pt-3">
            <p className="font-manrope text-[11px] text-brand-muted">
              Sourced via JustWatch · availability changes by region.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
