import Link from "next/link";

import CollectionCard from "@/components/ui/CollectionCard";
import { collections as defaultCollections } from "@/data/collections";
import type { CollectionData } from "@/types/film";

interface CollectionsSectionProps {
  title?: string;
  titleAccent?: string;
  /** Live editorial collections; falls back to static demo data when empty/omitted. */
  collections?: CollectionData[];
  /** Lets each card's Like/Save buttons act for the current user. */
  isAuthed?: boolean;
}

export default function CollectionsSection({
  title = "Collections Created By",
  titleAccent = "Film Lovers",
  collections = defaultCollections,
  isAuthed = false,
}: CollectionsSectionProps = {}) {
  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <div className="mb-10 lg:mb-14 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
          <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
            {title}{" "}
            <span className="text-brand-gold">{titleAccent}</span>
          </h2>
          <Link
            href="#"
            className="uppercase text-brand-light hover:opacity-70 transition-opacity flex items-center gap-2 sm:mb-2 font-oswald font-light text-sm tracking-[0.06em]"
          >
            <span className="border-b border-current pb-0.5">SHOW ALL</span>
            <span>→</span>
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} isAuthed={isAuthed} />
          ))}
        </div>
      </div>
    </section>
  );
}
