import Link from "next/link";
import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import type { EditorialFilm } from "@/data/editorialCollections";

interface SimilarFilmsSectionProps {
  films: EditorialFilm[];
  showAllHref?: string;
}

export default function SimilarFilmsSection({ films, showAllHref }: SimilarFilmsSectionProps) {
  if (films.length === 0) return null;

  // Two rows of five posters — same card as the /films grid, without filters.
  const grid = films.slice(0, 10);

  return (
    <section className="w-full bg-brand-dark pb-24">
      <div className="section-container">
        <div className="mb-8 lg:mb-[68px] flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
          <h2 className="font-manrope font-light text-[28px] lg:text-[48px] leading-[1.2em] tracking-[0.02em] text-brand-light opacity-90">
            Similar <span className="text-brand-gold">Films</span>
          </h2>
          {showAllHref ? (
            <Link
              href={showAllHref}
              className="uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2"
            >
              show all →
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {grid.map((film) => (
            <Link
              key={film.id}
              href={`/films/${film.id}`}
              className="block transition-opacity hover:opacity-90"
            >
              <EditorialPosterCard film={film} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
