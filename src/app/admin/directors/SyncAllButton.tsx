"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { syncAllDirectorMentions } from "@/lib/actions/admin";

export default function SyncAllButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setStatus(null);
    startTransition(async () => {
      const res = await syncAllDirectorMentions();
      if (res.error) {
        setStatus(res.error);
      } else {
        const failed = res.failed?.length ? `, ${res.failed.length} failed` : "";
        setStatus(`Synced ${res.updated}${failed}`);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {status && <span className="font-manrope text-[13px] text-brand-muted">{status}</span>}
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="border border-brand-gold text-brand-gold font-oswald uppercase text-[14px] tracking-[0.06em] rounded-[4px] px-4 py-2 hover:bg-brand-gold hover:text-brand-dark transition-colors disabled:opacity-50"
      >
        {isPending ? "Syncing…" : "↻ Refresh all from TMDB"}
      </button>
    </div>
  );
}
