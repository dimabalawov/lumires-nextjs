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

      {/* Mobile (<sm): horizontal snap carousel, one card per view with a peek.
          sm+ reverts to the multi-column grid. */}
      <div className="section-container flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pb-0 lg:grid-cols-4 lg:gap-10 [&::-webkit-scrollbar]:hidden">
        {directors.map((director) => (
          <div
            key={director.id}
            className="w-[82%] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <DirectorCard director={director} />
          </div>
        ))}
      </div>
    </section>
  );
}
