import Link from "next/link";

import MostReviewedCard from "@/components/ui/MostReviewedCard";
import { mostReviewedFilms } from "@/data/mostReviewed";

export default function MostReviewedSection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <div className="mb-10 lg:mb-14 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
          <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
            Most Reviewed{" "}
            <span className="text-brand-gold">This Week</span>
          </h2>
          <Link
            href="#"
            className="uppercase text-brand-light hover:opacity-70 transition-opacity flex items-center gap-2 sm:mb-2 font-oswald font-light text-sm tracking-[0.06em]"
          >
            <span className="border-b border-current pb-0.5">SHOW ALL</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mostReviewedFilms.map((film) => (
            <MostReviewedCard key={film.id} film={film} />
          ))}
        </div>
      </div>
    </section>
  );
}
