"use client";

import { useState, useTransition } from "react";
import { updateDirectorMentions, syncDirectorMentions } from "@/lib/actions/admin";

interface Props {
  id: string;
  name: string;
  initialMentions: number;
  canSync: boolean;
}

const inputClass =
  "w-28 bg-transparent border border-brand-muted rounded-[4px] px-2.5 py-2 font-manrope text-[16px] tracking-[0.06em] text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors";

export default function DirectorMentionsForm({ id, name, initialMentions, canSync }: Props) {
  const [value, setValue] = useState(String(initialMentions));
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isSyncing, startSync] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setError(null);

    const mentions = Number(value);
    if (!Number.isInteger(mentions) || mentions < 0) {
      setError("Whole number ≥ 0");
      return;
    }

    startSave(async () => {
      const res = await updateDirectorMentions(id, mentions);
      if (res.error) setError(res.error);
      else setStatus("Saved");
    });
  }

  function handleSync() {
    setStatus(null);
    setError(null);
    startSync(async () => {
      const res = await syncDirectorMentions(id);
      if (res.error) {
        setError(res.error);
      } else {
        setValue(String(res.mentions));
        setStatus(`TMDB ${res.popularity?.toFixed(1)}`);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 shrink-0">
      <div className="flex flex-col items-end">
        <label className="sr-only" htmlFor={`mentions-${id}`}>
          {name} mentions
        </label>
        <input
          id={`mentions-${id}`}
          type="number"
          min={0}
          step={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus(null);
            setError(null);
          }}
          className={inputClass}
        />
        <span className="mt-1 h-4 text-right font-manrope text-[12px]">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : status ? (
            <span className="text-brand-gold">{status}</span>
          ) : (
            <span className="text-brand-muted">mentions</span>
          )}
        </span>
      </div>

      {/* Sync this director's count from live TMDB popularity */}
      <button
        type="button"
        onClick={handleSync}
        disabled={!canSync || isSyncing}
        title={canSync ? "Sync from TMDB popularity" : "No TMDB id"}
        className="border border-brand-muted/60 text-brand-light rounded-[4px] px-3 py-2 hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-40"
        aria-label={`Sync ${name} from TMDB`}
      >
        {isSyncing ? "…" : "↻"}
      </button>

      <button
        type="submit"
        disabled={isSaving}
        className="bg-brand-gold text-brand-dark font-oswald uppercase text-[15px] tracking-[0.06em] rounded-[4px] px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSaving ? "…" : "Save"}
      </button>
    </form>
  );
}
