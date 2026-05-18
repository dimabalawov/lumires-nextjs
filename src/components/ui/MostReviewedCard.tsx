import Image from "next/image";
import type { MostReviewedFilm } from "@/data/mostReviewed";

interface MostReviewedCardProps {
  film: MostReviewedFilm;
}

export default function MostReviewedCard({ film }: MostReviewedCardProps) {
  return (
    <article className="relative aspect-[339/235] w-full overflow-hidden rounded-md">
      <Image
        src={film.still}
        alt={film.title}
        fill
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0" 
        style={{
          background:
            "linear-gradient(270deg, rgba(14,12,11,0.85) 0%, rgba(14,12,11,0.55) 50%, rgba(14,12,11,0.25) 100%)",
        }}
      />

      <div className="absolute top-5 right-5 flex max-w-[60%] flex-col items-end gap-2 text-right">
        <h3 className="font-oswald font-normal text-brand-gold text-[28px] leading-[34px]">
          {film.title}
        </h3>
        <p className="font-manrope font-light text-[#DACBBD] text-[14px] leading-[20px]">
          {film.quote}
        </p>
      </div>

      <div className="absolute bottom-4 right-5 flex flex-col items-end gap-1">
        <span className="text-brand-gold text-[14px] tracking-[0.15em] leading-none">
          {"★".repeat(film.rating)}
        </span>
        <span className="font-manrope font-light text-brand-muted text-[12px] leading-none">
          {film.reviewer}
        </span>
      </div>
    </article>
  );
}
