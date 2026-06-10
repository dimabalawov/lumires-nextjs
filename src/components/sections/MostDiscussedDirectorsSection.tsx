import DirectorCard from "@/components/ui/DirectorCard";
import { getDiscussedDirectors } from "@/lib/directors/discussed";
import { AccentTitle } from "../ui/AccentTitle";

// Show only the top 8 (2 rows × 4) most-discussed directors.
const MAX_DIRECTORS = 8;

export default async function MostDiscussedDirectorsSection() {
  const directors = (await getDiscussedDirectors()).slice(0, MAX_DIRECTORS);

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      <div className="section-container mb-8 lg:mb-12">
        <AccentTitle text="Most Discussed" accent="Directors This Week" />
      </div>

      <div className="section-container overflow-scroll grid gap-8 grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {directors.map((director) => (
          <DirectorCard key={director.id} director={director} />
        ))}
      </div>
    </section>
  );
}
