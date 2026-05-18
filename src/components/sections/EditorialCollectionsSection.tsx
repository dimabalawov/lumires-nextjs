import Link from "next/link";

import EditorialCollectionRow from "@/components/ui/EditorialCollectionRow";
import { editorialCollections } from "@/data/editorialCollections";

export default function EditorialCollectionsSection() {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        {/* Section heading */}
        <div className="mb-10 lg:mb-14 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
          <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
            Editorial{" "}
            <span className="text-brand-gold">Collections</span>
          </h2>
          <Link
            href="#"
            className="uppercase text-brand-light hover:opacity-70 transition-opacity flex items-center gap-2 sm:mb-2 font-oswald font-light text-sm tracking-[0.06em]"
          >
            <span className="border-b border-current pb-0.5">SHOW ALL</span>
            <span>→</span>
          </Link>
        </div>

        {/* Collections stack */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {editorialCollections.map((collection) => (
            <EditorialCollectionRow key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
