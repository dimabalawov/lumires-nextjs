import Image from "next/image";
import type { EditorialFilm } from "@/data/editorialCollections";

interface EditorialPosterCardProps {
  film: EditorialFilm;
}

export default function EditorialPosterCard({ film }: EditorialPosterCardProps) {
  return (
    <article className="relative aspect-[167/250] w-full overflow-hidden rounded-md">
      <Image
        src={film.poster}
        alt={film.title}
        fill
        sizes="(min-width: 1024px) 18vw, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw"
        className="object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,12,11,0) 0%, rgba(14,12,11,0.89) 72%, rgba(18,16,14,0.85) 100%)",
        }}
      />
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <span className="font-oswald font-normal text-brand-gold text-[32px] leading-[42px]">
          {film.title}
        </span>
        <span className="font-manrope font-light text-brand-light text-[16px] leading-[16px] tracking-[0.06em]">
          {film.year} · {film.genre} ·{" "}
          <span className="text-brand-gold">{film.rating}★</span>
        </span>
      </div>
    </article>
  );
}
