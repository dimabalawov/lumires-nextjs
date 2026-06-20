"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center text-center py-24">
      <h1 className="uppercase font-oswald font-normal text-brand-gold tracking-[0.06em] text-3xl md:text-4xl">
        Couldn&apos;t load your settings
      </h1>
      <p className="mt-4 font-manrope text-brand-muted max-w-md">
        The service had trouble loading your account settings. This is usually
        temporary — please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="uppercase font-oswald text-brand-light tracking-[0.06em] border-b border-brand-light/50 pb-1 hover:opacity-70 transition-opacity"
        >
          Try again →
        </button>
        <Link
          href="/"
          className="uppercase font-oswald text-brand-muted tracking-[0.06em] border-b border-brand-muted/50 pb-1 hover:opacity-70 transition-opacity"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
