import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import type { EditorialFilm } from "@/data/editorialCollections";

const ROW_SIZE = 5;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function DirectorFilmographySection({ films }: { films: EditorialFilm[] }) {
  if (films.length === 0) return null;
  const rows = chunk(films, ROW_SIZE);

  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">
      <h2 className="font-manrope font-light text-brand-light/90 text-[48px] leading-[56px] tracking-[0.06em] mb-6 lg:mb-8">
        Filmography
      </h2>

      <div className="flex flex-col gap-10 lg:gap-12">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="border-t border-brand-light/15 pt-5 lg:pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
              {row.map((film) => (
                <div key={film.id} className="flex flex-col gap-4">
                  <span className="text-center font-oswald font-light text-brand-light text-[14px] tracking-[0.12em]">
                    {film.year}
                  </span>
                  <EditorialPosterCard film={film} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
