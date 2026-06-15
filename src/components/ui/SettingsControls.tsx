"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-2 border-t border-brand-gold/8 py-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <div>
        <p className="font-manrope text-sm text-brand-light">{label}</p>
        {hint && (
          <p className="mt-1 font-manrope text-[12px] leading-relaxed text-brand-muted">{hint}</p>
        )}
      </div>
      <div className="max-w-xl">{children}</div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-brand-gold" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-[2px]" : "-translate-x-5.5"
        }`}
      />
    </button>
  );
}

/** A toggle laid out as a full row (label left, switch right) — for the
 *  notifications / privacy on-off lists. */
export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-brand-gold/8 py-5">
      <div>
        <p className="font-manrope text-[14px] text-brand-light">{label}</p>
        {hint && <p className="mt-0.5 font-manrope text-[12px] text-brand-muted">{hint}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

export function RadioCard({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-brand-gold bg-brand-gold/10"
          : "border-brand-gold/20 bg-[#171411] hover:border-brand-gold/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-brand-gold" : "border-brand-muted"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-brand-gold" />}
      </span>
      <span>
        <span className="block font-manrope text-[14px] text-brand-light">{title}</span>
        {description && (
          <span className="mt-0.5 block font-manrope text-[12px] text-brand-muted">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

export const settingsInputClass =
  "w-full rounded-md border border-brand-gold/20 bg-[#171411] px-4 py-2.5 font-manrope text-[15px] text-brand-light placeholder:text-brand-muted/50 focus:border-brand-gold/50 focus:outline-none transition-colors";

export function SaveButton({
  saving,
  onClick,
  children = "Save changes",
}: {
  saving: boolean;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="mt-8 flex items-center gap-4 border-t border-brand-gold/8 pt-6">
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className="cursor-pointer rounded-xl bg-brand-gold px-6 py-2.5 font-manrope text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-dark transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : children}
      </button>
    </div>
  );
}