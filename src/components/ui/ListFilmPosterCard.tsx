import PosterImage from "@/components/ui/PosterImage";

export interface ListFilmCardData {
  id: number;
  title: string;
  poster: string;
  year: string;
  genre: string;
  rating: number; // 0–5; 0 means "unrated"
}

/**
 * Poster card for the list-detail grid (matches the provided mockup): poster
 * fills the card with a bottom gradient carrying the title + `year · genre`,
 * and a top-right badge — a gold `N★` rating pill when rated, otherwise a
 * neutral star marker.
 */
export default function ListFilmPosterCard({ film }: { film: ListFilmCardData }) {
  const meta = [film.year, film.genre].filter(Boolean).join(" · ");

  return (
    <article className="relative aspect-[167/250] w-full overflow-hidden rounded-md bg-white/[0.04]">
      <PosterImage
        src={film.poster}
        alt={film.title}
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
      />

      {/* Top-right badge */}
      <div className="absolute right-2 top-2">
        {film.rating > 0 ? (
          <span className="flex items-center gap-1 rounded-[3px] bg-brand-dark/70 px-2 py-1 font-manrope text-[12px] font-medium text-brand-gold backdrop-blur-sm">
            {film.rating}
            <span aria-hidden>★</span>
          </span>
        ) : (
          <span className="flex size-7 items-center justify-center rounded-[3px] border border-brand-gold/40 bg-brand-dark/60 text-brand-gold/80 backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </span>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,12,11,0) 0%, rgba(14,12,11,0.89) 72%, rgba(18,16,14,0.85) 100%)",
        }}
      />
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5">
        <span className="font-oswald font-normal text-brand-gold text-[24px] leading-[28px]">
          {film.title}
        </span>
        {meta && (
          <span className="font-manrope font-light text-brand-light text-[14px] leading-[16px] tracking-[0.06em]">
            {meta}
          </span>
        )}
      </div>
    </article>
  );
}
