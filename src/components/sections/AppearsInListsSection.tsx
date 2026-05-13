import Link from "next/link";
import type { CollectionData } from "@/types/film";
import ListCard from "@/components/ui/ListCard";

interface AppearsInListsSectionProps {
  lists: CollectionData[];
  showAllHref?: string;
}

export default function AppearsInListsSection({
  lists,
  showAllHref = "#",
}: AppearsInListsSectionProps) {
  if (lists.length === 0) return null;

  return (
    <section className="section-container pb-24">
      <div className="mb-8 lg:mb-12 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
        <h2 className="font-manrope font-light text-[28px] lg:text-[48px] leading-[1.2em] tracking-[0.02em] text-brand-light opacity-90">
          Appears In <span className="text-brand-gold">Lists</span>
        </h2>
        <Link
          href={showAllHref}
          className="uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2"
        >
          show all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 lg:gap-y-14">
        {lists.map((list, i) => (
          <ListCard key={list.id} list={list} paletteIndex={i} />
        ))}
      </div>
    </section>
  );
}
