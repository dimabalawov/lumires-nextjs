import { getProfile } from "@/lib/api/users";
import ThreadCard from "@/components/ui/ThreadCard";
import { getThreads } from "@/lib/api/threads";
import ThreadFilters, { ThreadFiltersValue } from "../ui/ThreadsFilters";

interface Props {
  username: string;
  searchParams: Record<string, string | string[] | undefined>;
}

function first(sp: Props["searchParams"], key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ThreadsSection({ username, searchParams }: Props) {
  // /threads filters by UserId, so resolve the profile's id. getProfile is
  // cache()-wrapped, so this reuses the fetch the layout already made.
  const profile = await getProfile(username);
  const data = profile ? await getThreads(profile.id, searchParams) : null;

  const hasActiveFilters = ["category", "sortBy"].some((k) => k in searchParams);

  const filterValue: ThreadFiltersValue = {
    category: Number(first(searchParams, "category") ?? 0),
    sortBy: Number(first(searchParams, "sortBy") ?? 0),
  };

  if (!data || data.results.length === 0) {
    return (
      <>
        <ThreadFilters value={filterValue} />
        <p className="font-manrope text-brand-light/50 text-sm tracking-wide py-16 text-center">
          {hasActiveFilters ? "No threads match these filters." : "No threads yet."}
        </p>
      </>
    );
  }

  return (
    <>
      <ThreadFilters value={filterValue} />

      <p className="font-manrope text-brand-light/40 text-xs uppercase tracking-[0.2em] mb-2">
        {data.totalResults} {data.totalResults === 1 ? "thread" : "threads"}
      </p>

      <div className="flex flex-col">
        {data.results.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </>
  );
}