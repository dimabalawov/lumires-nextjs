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
      {/* На экранах меньше lg: grid-cols-[120px_1fr] (картинка слева, текст справа).
        На больших экранах lg: возвращаем трехколоночную структуру [300px_1fr_320px].
      */}
      <div className="grid gap-6 md:gap-8 lg:gap-12 grid-cols-[120px_1fr] lg:grid-cols-[300px_1fr_320px]">
        
        {/* 1. Portrait */}
        {/* Убрали max-w-[360px] для мобильных, чтобы адаптивно сжимался в своей колонке */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-brand-dark/60 lg:max-w-[360px]">
          {director.imageUrl && (
            <Image
              src={director.imageUrl}
              alt={director.name}
              fill
              priority
              sizes="(min-width: 1024px) 300px, 120px"
              className="object-cover"
            />
          )}
        </div>

        {/* 2. Name + meta + bio */}
        <div className="flex flex-col justify-center lg:justify-start">
          <h1 
            className="font-oswald font-normal text-brand-gold leading-[1.1] lg:leading-[80px]"
            style={{ fontSize: "clamp(24px, 4vw, 72px)" }} // Чуть уменьшили стартовый размер для мобилок
          >
            {director.name}
          </h1>
          
          {(yearLine || director.birthplace) && (
            <p className="mt-2 lg:mt-4 font-manrope text-brand-muted text-[14px] lg:text-[16px] flex flex-wrap gap-x-2">
              <span>{yearLine}</span>
              {yearLine && director.birthplace && <span className="text-brand-muted/50">·</span>}
              {director.birthplace && (
                <span className="text-brand-light">Born in {director.birthplace}</span>
              )}
            </p>
          )}

          {/* Биографию на мобильных скрываем или выносим ниже, 
              но если она короткая — оставляем в колонке. 
              Чтобы на мобильных она не ломала верстку, добавили col-span-2 для md экранов,
              либо можно оставить её прямо тут, если текст небольшой. */}
          <p className="hidden md:block mt-6 font-manrope font-normal text-brand-light text-[16px] leading-[24px] tracking-[0.06em] max-w-[640px] whitespace-pre-line">
            {director.bio}
          </p>
        </div>

        {/* Мобильная версия био (опционально): если нужно, чтобы на совсем мелких экранах 
            био падало вниз под картинку и имя, раскомментируйте этот блок: */}
        {/* <p className="md:hidden col-span-2 mt-2 font-manrope font-normal text-brand-light text-[15px] leading-[22px]">
          {director.bio}
        </p> 
        */}

        {/* 3. Stats card */}
        {/* col-span-2: на мобильных занимает всю ширину под картинкой и текстом.
          lg:col-span-1: на десктопе возвращается в свою законную третью колонку.
        */}
        <div className="col-span-2 lg:col-span-1 self-start mt-4 lg:mt-0">
          <div
            className="rounded-[6px] px-6 py-7 lg:px-7 lg:py-8 flex flex-col"
            style={{ background: STATS_CARD_BG }}
          >
            <ul className="flex flex-col">
              <li className="font-oswald font-light uppercase text-brand-gold text-[15px] lg:text-[16px] tracking-[0.24em] py-2">
                {director.stats.featureFilms} Feature Films
              </li>
              <li className="h-px bg-brand-gold/25" />
              <li className="font-oswald font-light uppercase text-brand-gold text-[15px] lg:text-[16px] tracking-[0.24em] py-2">
                {director.stats.avgRating.toFixed(1)} Avg Rating
              </li>
              <li className="h-px bg-brand-gold/25" />
              <li className="font-oswald font-light uppercase text-brand-gold text-[15px] lg:text-[16px] tracking-[0.24em] py-2">
                {director.stats.awards} Awards
              </li>
            </ul>

            <a
              href="#biography"
              className="mt-6 lg:mt-8 w-full rounded-[6px] bg-brand-gold text-brand-dark font-manrope font-medium uppercase tracking-[0.24em] text-[13px] py-3 text-center hover:opacity-90 transition-opacity"
            >
              See Full Biography
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}