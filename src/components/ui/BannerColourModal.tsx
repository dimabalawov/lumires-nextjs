"use client";

import { useEffect, useState } from "react";
import { BANNER_THEMES, type BannerTheme } from "@/data/bannerThemes";

interface BannerColourModalProps {
  open: boolean;
  onClose: () => void;
  /** Currently selected theme id (controlled). Defaults to the first theme. */
  value?: string;
  /** Fired immediately on selection so the profile can re-theme live. */
  onChange?: (theme: BannerTheme) => void;
}

const CARD_BORDER = "rgba(210,166,106,0.22)";
const SWATCH_RING = "rgba(155,143,132,0.16)";

/**
 * "Banner colour" picker (Figma node 2532:4145). A small popup of eight
 * gradient mood swatches in a 2-column grid; picking one fires `onChange` so the
 * background can re-theme live behind the whole profile. Controlled via
 * `open`/`onClose`; selection is controlled via `value`/`onChange` but falls
 * back to internal state when used standalone.
 */
export default function BannerColourModal({
  open,
  onClose,
  value,
  onChange,
}: BannerColourModalProps) {
  const [internal, setInternal] = useState(value ?? BANNER_THEMES[0].id);
  const selectedId = value ?? internal;

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  function select(theme: BannerTheme) {
    setInternal(theme.id);
    onChange?.(theme);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/90 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Banner colour"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] rounded-[16px] border border-solid bg-[rgba(22,20,17,0.97)] p-[22px] backdrop-blur-[5px]"
        style={{
          borderColor: CARD_BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="font-oswald font-medium text-[19px] tracking-[0.5px] text-[#ffe3ed]">
            Banner colour
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="px-1 leading-none font-manrope text-[20px] text-[#b08491] transition-colors hover:text-[#ffe3ed]"
          >
            ×
          </button>
        </div>

        <p className="mt-3 font-manrope text-[12px] leading-[18px] text-[#b08491]">
          Pick a mood — your background re-themes live behind the whole profile.
        </p>

        {/* Swatch grid */}
        <div
          role="radiogroup"
          aria-label="Banner colour theme"
          className="mt-4 grid grid-cols-2 gap-[10px]"
        >
          {BANNER_THEMES.map((theme) => {
            const active = theme.id === selectedId;
            return (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => select(theme)}
                className="flex h-[49.33px] items-center gap-[11px] rounded-[11px] p-[8px] text-left transition-colors"
                style={{
                  backgroundColor: active ? "rgba(210,166,106,0.08)" : "transparent",
                  boxShadow: `inset 0 0 0 1.5px ${active ? theme.accent : SWATCH_RING}`,
                }}
              >
                <span
                  aria-hidden
                  className="h-[32px] w-[38px] shrink-0 rounded-[7px]"
                  style={{ backgroundImage: theme.gradient }}
                />
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="truncate font-manrope font-medium text-[12.5px] text-[#ffe3ed]">
                    {theme.name}
                  </span>
                  <span className="truncate font-manrope text-[10px] text-[#b08491]">
                    {theme.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-[15px] border-t pt-[15px]" style={{ borderColor: "rgba(155,143,132,0.14)" }}>
          <button
            type="button"
            onClick={onClose}
            className="font-manrope text-[12px] tracking-[0.4px] text-[#b08491] transition-colors hover:text-[#ffe3ed]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
