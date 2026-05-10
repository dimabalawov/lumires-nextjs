import Image from "next/image";
import Link from "next/link";
import { FilmCardData } from "@/types/film";
import StarRating from "./StarRating";

interface MobileFilmCardProps {
  film: FilmCardData;
}

export default function MobileFilmCard({ film }: MobileFilmCardProps) {
  return (
    <Link
      href={`/films/${film.id}`}
      className="relative shrink-0 w-[220px] h-[160px] rounded-md overflow-hidden snap-start block"
    >
      <Image
        src={film.image}
        alt={film.title}
        fill
        className="object-cover"
        sizes="220px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
        <h3 className="text-brand-gold font-oswald font-normal text-[15px] uppercase tracking-[0.06em] leading-tight line-clamp-1">
          {film.title}
        </h3>
        <div className="flex items-center gap-2">
          <StarRating count={film.rating} />
        </div>
        <p className="text-brand-muted font-manrope text-[10px] italic leading-tight line-clamp-1">
          {film.quote}
        </p>
      </div>
    </Link>
  );
}
