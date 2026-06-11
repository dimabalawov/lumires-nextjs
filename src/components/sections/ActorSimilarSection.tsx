import Image from "next/image";
import Link from "next/link";
import type { SimilarActor } from "@/data/actors";

export default function ActorSimilarSection({ actors }: { actors: SimilarActor[] }) {
  if (actors.length === 0) return null;

  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">
      <h2 className="font-manrope font-light text-brand-light/90 text-[48px] leading-14 tracking-[0.06em] mb-8 lg:mb-12">
        Similar Genre <span className="text-brand-gold">Actors</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8">
        {actors.map((a, i) => (
          <Link
            key={`${a.id}-${i}`}
            href={`/actors/${a.apiId}`}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative size-40 lg:size-50 overflow-hidden rounded-full">
              <Image
                src={a.image}
                alt={a.name}
                fill
                sizes="(min-width: 1024px) 200px, 160px"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
            </div>
            <div className="mt-5 font-manrope font-normal uppercase text-brand-light text-[14px] tracking-[0.12em] leading-[1.4]">
              {a.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
