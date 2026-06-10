import Link from "next/link";
import { CommunityThread } from "@/types/film";
import { leftColumnThreads, rightColumnThreads } from "@/data/communityThreads";
import ThreadCard from "@/components/ui/ThreadCard";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

function ThreadColumn({ threads }: { threads: CommunityThread[] }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
}

interface CommunitySectionProps {
  title?: string;
  titleAccent?: string;
  uppercaseTitle?: boolean;
}

export default function CommunitySection({
  title = "Thoughts from the community",
  titleAccent,
  uppercaseTitle = true,
}: CommunitySectionProps = {}) {
  return (
    <div className="pb-24 w-fullflex flex pt-24 flex-col gap-5">
      <section className="flex-col items-center bg-brand-dark">
        <div className="section-container mb-8 lg:mb-12 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
          <AccentTitle text={title} accent={titleAccent} className={uppercaseTitle ? "uppercase" : ""} />
          <ShowAllLink href="#" className="hidden lg:flex uppercase text-brand-light"
            withBorder={true}
            isCenter={true} />
        </div>
        <div className="section-container flex flex-col lg:flex-row gap-8">
          <ThreadColumn threads={leftColumnThreads} />
          <ThreadColumn threads={rightColumnThreads} />
        </div>
      </section>
      <ShowAllLink href="#" className="lg:hidden flex justify-end mr-5 lowercase
        text-brand-muted hover:opacity-70 transition-opacity items-center gap-2 
         sm:mb-2 font-oswald font-light text-[20px] tracking-[0.06em]" withBorder={false} />
    </div>


  );
}
