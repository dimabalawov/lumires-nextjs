"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function FilmError({
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
    <main className="flex min-h-screen flex-col bg-brand-dark">
      <Header />
      <section className="section-container flex flex-col items-center justify-center text-center flex-1 py-32">
        <h1 className="uppercase font-oswald font-normal text-brand-gold tracking-[0.06em] text-4xl md:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 font-manrope text-brand-muted max-w-md">
          We couldn&apos;t load this film right now. The service may be
          temporarily unavailable — please try again in a moment.
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
            href="/films"
            className="uppercase font-oswald text-brand-muted tracking-[0.06em] border-b border-brand-muted/50 pb-1 hover:opacity-70 transition-opacity"
          >
            Back to films
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
