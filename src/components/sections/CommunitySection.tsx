import { CommunityThread } from "@/types/film";
import { leftColumnThreads, rightColumnThreads } from "@/data/communityThreads";
import ThreadCard from "@/components/ui/ThreadCard";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

function ThreadColumn({
  threads,
  isAuthed,
}: {
  threads: CommunityThread[];
  isAuthed: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-8">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} isAuthed={isAuthed} />
      ))}
    </div>
  );
}

interface CommunitySectionProps {
  title?: string;
  titleAccent?: string;
  uppercaseTitle?: boolean;
  /** Live community reviews. When omitted, falls back to static demo threads. */
  threads?: CommunityThread[];
  isAuthed?: boolean;
  /** Where "Show all" links to (e.g. /reviews). */
  showAllHref?: string;
}

export default function CommunitySection({
  title = "Thoughts from the community",
  titleAccent,
  uppercaseTitle = true,
  threads,
  isAuthed = false,
  showAllHref = "#",
}: CommunitySectionProps = {}) {
  // Split a single live feed into two balanced columns; otherwise use the
  // pre-split static demo columns.
  const useLive = threads != null && threads.length > 0;
  const mid = useLive ? Math.ceil(threads!.length / 2) : 0;
  const leftThreads = useLive ? threads!.slice(0, mid) : leftColumnThreads;
  const rightThreads = useLive ? threads!.slice(mid) : rightColumnThreads;

  return (
    <div className="pb-24 w-fullflex flex pt-24 flex-col gap-5">
      <section className="flex-col items-center bg-brand-dark">
        <div className="section-container mb-8 lg:mb-12 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
          <AccentTitle text={title} accent={titleAccent} className={uppercaseTitle ? "uppercase" : ""} />
          <ShowAllLink href={showAllHref} className="hidden lg:flex uppercase text-brand-light"
            withBorder={true}
            isCenter={true} />
        </div>
        <div className="section-container flex flex-col lg:flex-row gap-8">
          <ThreadColumn threads={leftThreads} isAuthed={isAuthed} />
          <ThreadColumn threads={rightThreads} isAuthed={isAuthed} />
        </div>
      </section>
      <ShowAllLink href={showAllHref} className="lg:hidden flex justify-end mr-5 lowercase
        text-brand-muted hover:opacity-70 transition-opacity items-center gap-2 
         sm:mb-2 font-oswald font-light text-[20px] tracking-[0.06em]" withBorder={false} />
    </div>


  );
}
