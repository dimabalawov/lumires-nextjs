import Image from "next/image";
import Link from "next/link";
import type { SimilarDirector } from "@/data/directors";

export default function DirectorSimilarSection({
  directors,
}: {
  directors: SimilarDirector[];
}) {
  if (directors.length === 0) return null;

  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">
      <h2 className="font-manrope font-light text-brand-light/90 text-[48px] leading-[56px] tracking-[0.06em] mb-8 lg:mb-12">
        Similar <span className="text-brand-gold">Directors</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8">
        {directors.map((d, i) => (
          <Link
            key={`${d.id}-${i}`}
            href={`/directors/${d.id}/${d.apiId}`}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative size-[160px] lg:size-[200px] overflow-hidden rounded-full">
              <Image
                src={d.image}
                alt={d.name}
                fill
                sizes="(min-width: 1024px) 200px, 160px"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
            </div>
            <div className="mt-5 font-manrope font-normal uppercase text-brand-light text-[14px] tracking-[0.12em] leading-[1.4]">
              {d.name}
            </div>
            <div className="mt-2 font-manrope font-normal text-[12px] tracking-[0.06em]">
              <span className="text-brand-gold">{d.matchPercent}%</span>
              <span className="text-brand-muted ml-2">match</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
