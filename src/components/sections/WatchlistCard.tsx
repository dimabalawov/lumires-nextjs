import { FilmListItem } from "@/types/watchlist";
import Image from "next/image";
import Link from "next/link";

interface Props {
  film: FilmListItem;
  username: string;
}

export default function WatchlistCard({ film, username }: Props) {
  const rating =
    film.voteAverage > 0
      ? Number.isInteger(film.voteAverage)
        ? `${film.voteAverage}`
        : film.voteAverage.toFixed(1)
      : null;

  const meta = [
    film.releaseYear,
    film.genres[0],
    rating ? `${rating}★` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    // CommonFilmListResponse has no slug, so we link by id. If your film routes
    // are slug-based, add Slug to the DTO and switch href back to the slug.
    <Link href={`/films/${film.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[6px] bg-white/5">
        {film.posterPath ? (
          <Image
            src={film.posterPath}
            alt={film.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center font-manrope text-[11px] uppercase tracking-[0.2em] text-brand-light/40">
            {film.title}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-manrope text-sm text-brand-light transition-colors group-hover:text-brand-gold">
          {film.title}
        </h3>
        {meta && (
          <p className="font-manrope text-xs tracking-wide text-brand-light/55">{meta}</p>
        )}
        <p className="font-manrope text-xs tracking-wide text-brand-gold/70">
          <span aria-hidden="true">♥</span> @{username}
        </p>
      </div>
    </Link>
  );
}