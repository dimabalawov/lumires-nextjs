import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import GradientDivider from "@/components/ui/GradientDivider";
import type { EditorialCollection } from "@/data/editorialCollections";

interface EditorialCollectionRowProps {
  collection: EditorialCollection;
}

export default function EditorialCollectionRow({ collection }: EditorialCollectionRowProps) {
  return (
    <div
      className="flex flex-col gap-4 rounded-md border border-brand-gold/20 p-6 md:p-10 lg:px-[63px] lg:py-[45px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(210,166,106,0.07) 0%, rgba(18,16,14,0) 60%), #12100e",
      }}
    >
      <h3 className="font-oswald font-normal text-brand-gold text-[32px] leading-tight">
        {collection.title}
      </h3>
      <GradientDivider />
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-10 lg:gap-[60px]">
        {collection.films.map((film) => (
          <EditorialPosterCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}
