"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addFeaturedCollection,
  removeFeaturedCollection,
} from "@/lib/actions/admin";
import type { FeaturedCollectionRow } from "@/lib/collections/featured";

const inputClass =
  "flex-1 min-w-0 bg-transparent border border-brand-muted rounded-[4px] px-3 py-2 font-manrope text-[15px] tracking-[0.04em] text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-gold transition-colors";

export default function FeaturedCollectionsManager({
  initialRows,
}: {
  initialRows: FeaturedCollectionRow[];
}) {
  const router = useRouter();
  const [listId, setListId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, startAdd] = useTransition();
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    const id = listId.trim();
    if (!id) {
      setError("Paste a list id");
      return;
    }
    startAdd(async () => {
      const res = await addFeaturedCollection(id);
      if (res.error) {
        setError(res.error);
      } else {
        setStatus(`Added “${res.title}”`);
        setListId("");
        router.refresh();
      }
    });
  }

  function handleRemove(id: string) {
    setStatus(null);
    setError(null);
    setPendingRemove(id);
    startAdd(async () => {
      const res = await removeFeaturedCollection(id);
      if (res.error) setError(res.error);
      else router.refresh();
      setPendingRemove(null);
    });
  }

  return (
    <div>
      {/* Add by list id */}
      <form onSubmit={handleAdd} className="flex flex-col gap-2 max-w-[640px]">
        <div className="flex items-center gap-3">
          <input
            value={listId}
            onChange={(e) => {
              setListId(e.target.value);
              setStatus(null);
              setError(null);
            }}
            placeholder="Paste a list id (GUID) to feature…"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={isAdding}
            className="shrink-0 bg-brand-gold text-brand-dark font-oswald uppercase text-[15px] tracking-[0.06em] rounded-[4px] px-5 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isAdding && !pendingRemove ? "…" : "Add"}
          </button>
        </div>
        <span className="h-4 font-manrope text-[12px]">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : status ? (
            <span className="text-brand-gold">{status}</span>
          ) : (
            <span className="text-brand-muted">
              Tip: open a list and copy the id from its URL (/lists/&lt;id&gt;).
            </span>
          )}
        </span>
      </form>

      {/* Current featured list */}
      <ul className="mt-8 flex flex-col divide-y divide-brand-muted/15">
        {initialRows.length === 0 ? (
          <li className="py-6 font-manrope text-[14px] text-brand-muted">
            No featured collections yet. Add one above.
          </li>
        ) : (
          initialRows.map((row) => (
            <li key={row.listId} className="flex items-center gap-5 py-4">
              <span className="font-oswald text-brand-muted text-[16px] w-6 shrink-0 tabular-nums">
                {row.position + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-oswald text-brand-gold text-[20px] leading-tight truncate">
                  {row.title}
                </h2>
                <p className="font-manrope text-[13px] text-brand-muted truncate">
                  {row.filmCount} films · by @{row.author} · {row.listId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(row.listId)}
                disabled={isAdding}
                className="shrink-0 border border-brand-muted/60 text-brand-light rounded-[4px] px-3 py-2 font-manrope text-[13px] uppercase tracking-[0.06em] hover:border-red-400 hover:text-red-400 transition-colors disabled:opacity-40"
              >
                {pendingRemove === row.listId ? "…" : "Remove"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
