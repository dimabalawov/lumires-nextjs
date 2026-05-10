import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function FilmNotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-brand-dark">
      <Header />
      <section className="section-container flex flex-col items-center justify-center text-center flex-1 py-32">
        <h1 className="uppercase font-oswald font-normal text-brand-gold tracking-[0.06em] text-4xl md:text-5xl">
          Film not found
        </h1>
        <p className="mt-4 font-manrope text-brand-muted max-w-md">
          We couldn&apos;t find that film. It may have been removed, or the link
          is incorrect.
        </p>
        <Link
          href="/"
          className="mt-8 uppercase font-oswald text-brand-light tracking-[0.06em] border-b border-brand-light/50 pb-1 hover:opacity-70 transition-opacity"
        >
          Back to home →
        </Link>
      </section>
    </main>
  );
}
