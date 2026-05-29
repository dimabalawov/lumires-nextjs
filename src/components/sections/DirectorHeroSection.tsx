import Image from "next/image";
import { DirectorProfile } from "@/types/film";

const STATS_CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

function buildYearLine(birthYear: number | null, deathYear: number | null): string | null {
  if (birthYear && deathYear) return `${birthYear} – ${deathYear}`;
  if (birthYear) return `Born ${birthYear}`;
  return null;
}

export default function DirectorHeroSection({ director }: { director: DirectorProfile }) {
  const yearLine = buildYearLine(director.birthYear, director.deathYear);

  return (
    <section className="section-container pt-8 lg:pt-12 pb-12 lg:pb-20">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[300px_1fr_320px]">
        {/* Portrait */}
        <div className="relative aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-[4px] bg-brand-dark/60">
          {director.imageUrl && (
            <Image
              src={director.imageUrl}
              alt={director.name}
              fill
              priority
              sizes="(min-width: 1024px) 300px, 90vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Name + meta + bio */}
        <div className="flex flex-col">
          <h1 className="font-oswald font-normal text-brand-gold text-[48px] leading-[56px] lg:text-[72px] lg:leading-[80px]">
            {director.name}
          </h1>
          {(yearLine || director.birthplace) && (
            <p className="mt-4 font-manrope text-brand-muted text-[15px] lg:text-[16px]">
              {yearLine}
              {yearLine && director.birthplace && <span className="mx-2">·</span>}
              {director.birthplace && (
                <span className="text-brand-light">Born in {director.birthplace}</span>
              )}
            </p>
          )}
          <p className="mt-6 font-manrope font-normal text-brand-light text-[16px] leading-[24px] tracking-[0.06em] max-w-[640px] whitespace-pre-line">
            {director.bio}
          </p>
        </div>

        {/* Stats card */}
        <div className="self-start">
          <div
            className="rounded-[6px] px-6 py-7 lg:px-7 lg:py-8 flex flex-col"
            style={{ background: STATS_CARD_BG }}
          >
            <ul className="flex flex-col">
              <li className="font-oswald font-light uppercase text-brand-gold text-[16px] tracking-[0.24em] py-2">
                {director.stats.featureFilms} Feature Films
              </li>
              <li className="h-px bg-brand-gold/25" />
              <li className="font-oswald font-light uppercase text-brand-gold text-[16px] tracking-[0.24em] py-2">
                {director.stats.avgRating.toFixed(1)} Avg Rating
              </li>
              <li className="h-px bg-brand-gold/25" />
              <li className="font-oswald font-light uppercase text-brand-gold text-[16px] tracking-[0.24em] py-2">
                {director.stats.reviewsCount} Reviews On Lumieres
              </li>
            </ul>

            <button
              type="button"
              className="mt-7 lg:mt-8 w-full rounded-[6px] bg-brand-gold text-brand-dark font-manrope font-medium uppercase tracking-[0.24em] text-[13px] py-3 hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
