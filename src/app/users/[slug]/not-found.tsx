import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-brand-dark">
      <section className="section-container flex flex-col items-center justify-center text-center flex-1 py-32">
        <h1 className="uppercase font-oswald text-brand-gold text-4xl md:text-5xl">
          Profile not found
        </h1>

        <p className="mt-4 text-brand-muted max-w-md">
          We couldn’t find that profile.
        </p>

        <Link
          href="/"
          className="mt-8 uppercase text-brand-light border-b border-brand-light/50"
        >
          Back to home →
        </Link>
      </section>
    </main>
  );
}