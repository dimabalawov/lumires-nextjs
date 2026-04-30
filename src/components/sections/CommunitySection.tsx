import Link from "next/link";
import { CommunityThread } from "@/types/film";
import { leftColumnThreads, rightColumnThreads } from "@/data/communityThreads";
import ThreadCard from "@/components/ui/ThreadCard";

function ThreadColumn({ threads }: { threads: CommunityThread[] }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
}

export default function CommunitySection() {
  return (
    <section className="w-full pt-24 pb-24 flex flex-col items-center bg-brand-dark">
      <div className="section-container mb-8 lg:mb-12 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
        <h2 className="uppercase font-manrope font-light text-[24px] lg:text-[48px] leading-[1.333em] tracking-[0.06em] text-[#DCD8D3] opacity-90">
          Thoughts from the community
        </h2>
        <Link
          href="#"
          className="uppercase font-manrope font-light text-base leading-[1.625em] tracking-[0.06em] text-brand-light underline hover:opacity-70 transition-opacity sm:mb-2"
        >
          show all →
        </Link>
      </div>
      <div className="section-container flex flex-col lg:flex-row gap-8">
        <ThreadColumn threads={leftColumnThreads} />
        <ThreadColumn threads={rightColumnThreads} />
      </div>
    </section>
  );
}
