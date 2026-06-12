
import EditorialCollectionRow from "@/components/ui/EditorialCollectionRow";
import { editorialCollections } from "@/data/editorialCollections";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

export default function EditorialCollectionsSection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        {/* Section heading */}
        <div className="mb-10 lg:mb-14 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
          <AccentTitle text="Editorial" accent="Collections" />
          <ShowAllLink href="#" className="hidden lg:flex uppercase text-brand-light 
          hover:opacity-70 transition-opacity items-center gap-2 sm:mb-2 font-oswald 
          font-light text-sm tracking-[0.06em]" withBorder={true} isCenter={true} />

        </div>

        {/* Collections stack */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {editorialCollections.map((collection) => (
            <EditorialCollectionRow key={collection.id} collection={collection} />
          ))}
        </div>

        <ShowAllLink href="#" className="lg:hidden flex justify-end mr-5 mt-5 lowercase
        text-brand-muted hover:opacity-70 transition-opacity items-center gap-2 
         sm:mb-2 font-oswald font-light text-[20px] tracking-[0.06em]" withBorder={false} />
      </div>
    </section>
  );
}
