import DirectorCard from "@/components/ui/DirectorCard";
import { discussedDirectors } from "@/data/directors";

export default function MostDiscussedDirectorsSection() {
  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      <div className="section-container mb-8 lg:mb-12">
        <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Most Discussed <span className="text-brand-gold">Directors This Week</span>
        </h2>
      </div>

      <div className="section-container grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {discussedDirectors.map((director) => (
          <DirectorCard key={director.id} director={director} />
        ))}
      </div>
    </section>
  );
}
