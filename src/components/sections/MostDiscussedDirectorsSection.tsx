import DirectorCard from "@/components/ui/DirectorCard";
import { getDiscussedDirectors } from "@/lib/directors/discussed";

// Show only the top 8 (2 rows × 4) most-discussed directors.
const MAX_DIRECTORS = 8;

export default async function MostDiscussedDirectorsSection() {
  const directors = (await getDiscussedDirectors()).slice(0, MAX_DIRECTORS);

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      <div className="section-container mb-8 lg:mb-12">
        <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Most Discussed <span className="text-brand-gold">Directors This Week</span>
        </h2>
      </div>

      <div className="section-container grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {directors.map((director) => (
          <DirectorCard key={director.id} director={director} />
        ))}
      </div>
    </section>
  );
}
