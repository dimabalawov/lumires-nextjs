import CollectionCard from "@/components/ui/CollectionCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { collections } from "@/data/collections";

export default function CollectionsSection() {
  return (
    <section className="w-full pt-24 pb-24 flex flex-col items-center bg-brand-dark">
      <SectionHeader title="Collections Created by Film Lovers" />
      <div className="w-[94%] lg:w-[90%] xl:w-[83%] max-w-[1197px] flex flex-col gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
