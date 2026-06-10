import Link from "next/link";

import CollectionCard from "@/components/ui/CollectionCard";
import { collections as defaultCollections } from "@/data/collections";
import type { CollectionData } from "@/types/film";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

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
          <AccentTitle text={title} accent={titleAccent} />
          <ShowAllLink href="#" className="hidden lg:flex uppercase text-brand-light"
            withBorder={true}
            isCenter={true} />
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
