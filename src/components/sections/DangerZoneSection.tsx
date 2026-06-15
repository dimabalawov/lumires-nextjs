"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteAccount } from "@/lib/api/users.client";

export default function DangerZone() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleDelete() {
    if (busy) return;
    setBusy(true);
    try {
      await deleteAccount();
      router.push("/");
    } catch {
      toast.error("Couldn't delete account.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-brand-danger/30">

      <div className="flex items-center justify-between gap-6 border-t border-brand-danger/20 bg-brand-danger/[0.04] p-5">
        <div>
          <p className="font-manrope text-[15px] text-brand-light">Delete account permanently</p>
          <p className="mt-1 font-manrope text-[12px] text-brand-muted">
            Erase your profile, reviews, lists and diary. This cannot be undone.
          </p>
        </div>
        {confirmingDelete ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-md px-3 py-2 font-manrope text-[12px] uppercase tracking-[0.14em] text-brand-muted hover:text-brand-light"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="rounded-md bg-brand-danger px-4 py-2 font-manrope text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Confirm delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="shrink-0 rounded-md bg-brand-danger px-4 py-2 font-manrope text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
          >
            Delete forever
          </button>
        )}
      </div>
    </div>
  );
}