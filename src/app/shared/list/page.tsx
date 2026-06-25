import type { Metadata } from "next";
import Link from "next/link";

import ListCollaborators, { type ListCollaboratorsData } from "@/components/ui/ListCollaborators";
import ListFilmPosterCard, { type ListFilmCardData } from "@/components/ui/ListFilmPosterCard";

export const metadata: Metadata = {
  title: "Shared List · Lists",
  description: "A collaboratively curated list.",
};

// --- Mock data (replace with API later) -------------------------------------

const sharedList = {
  title: "Films That Feel Like Rain",
  description:
    "A slow-burning collection of moody, atmospheric cinema — curated together by a handful of like-minded watchers.",
};

const collaborators: ListCollaboratorsData = {
  avatars: [
    { color: "#3a3530" },
    { color: "#4a4038" },
    { initials: "NK", color: "#6e4a52" },
    { initials: "TB", color: "#41606b" },
  ],
  leadHandle: "lightandshadow",
  othersCount: 3,
  likes: 1284,
  saves: 3907,
  updatedAgo: "2h ago",
};

// Reuse the only local posters available (also used by the lists carousel).
const posters = [
  "/imgs/listCarousel/image 15.png",
  "/imgs/listCarousel/image 16.png",
  "/imgs/listCarousel/image 17.png",
  "/imgs/listCarousel/image 18.png",
];

const films: ListFilmCardData[] = [
  { title: "Lost in Translation", year: "2003", genre: "Drama", rating: 4.5 },
  { title: "In the Mood for Love", year: "2000", genre: "Romance", rating: 5 },
  { title: "Drive", year: "2011", genre: "Thriller", rating: 4 },
  { title: "Blade Runner 2049", year: "2017", genre: "Sci-Fi", rating: 4.5 },
  { title: "Her", year: "2013", genre: "Drama", rating: 4 },
  { title: "Only God Forgives", year: "2013", genre: "Crime", rating: 3.5 },
  { title: "The Lighthouse", year: "2019", genre: "Horror", rating: 4 },
  { title: "Past Lives", year: "2023", genre: "Romance", rating: 0 },
].map((f, i) => ({
  id: i + 1,
  poster: posters[i % posters.length],
  ...f,
}));

// ---------------------------------------------------------------------------

export default function SharedListPage() {
  const filmCount = films.length;

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <section className="section-container pt-28 lg:pt-32 pb-16 lg:pb-24">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-oswald uppercase text-brand-muted text-xs tracking-[0.2em]">
          <Link href="/lists" className="hover:text-brand-light transition-colors">
            Lists
          </Link>
          <span aria-hidden>·</span>
          <span className="text-brand-gold">Shared</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="font-oswald font-light text-brand-gold text-[40px] leading-[1.05] lg:text-[56px]">
            {sharedList.title}
          </h1>
          <span className="shrink-0 font-manrope font-light text-brand-muted text-[16px] lg:pt-3">
            {filmCount} {filmCount === 1 ? "film" : "films"}
          </span>
        </div>

        {/* Collaborators row — replaces the single-author byline */}
        <ListCollaborators data={collaborators} />

        {sharedList.description && (
          <p className="mt-6 max-w-[640px] font-manrope font-light text-brand-muted text-[15px] leading-[1.6]">
            {sharedList.description}
          </p>
        )}

        {/* Film grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {films.map((film) => (
            <Link
              key={film.id}
              href={`/films/${film.id}`}
              className="block transition-opacity hover:opacity-90"
            >
              <ListFilmPosterCard film={film} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
