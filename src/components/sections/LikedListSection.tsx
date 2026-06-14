import ListCard from "@/components/ui/ListCard";
import Pagination from "@/components/ui/Pagination";
import ListFilters from "@/components/sections/ListFilters";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import type { BrowseListItem, ListSortOrder } from "@/types/api";
import type { CollectionData } from "@/types/film";
import { getLikedLists } from "@/lib/api/users";

const PAGE_SIZE = 10;
const SORTS: ListSortOrder[] = ["mostRecent", "mostPopular", "mostFilms"];
const toInt = (v: string | undefined, f: number) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.floor(Number(v)) : f);

function mapToCards(items: BrowseListItem[]): CollectionData[] {
  return items.map((item) => ({
    ...item,
    films: (item.films ?? []).map((f) => tmdbImage(f.backdropPath, "w780") ?? "").filter(Boolean),
  }));
}

interface Props {
  username: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function LikedListsSection({ username, searchParams = {} }: Props) {
  const read = (k: string) => (Array.isArray(searchParams[k]) ? searchParams[k]![0] : searchParams[k]);

  const rawSort = read("sortBy") as ListSortOrder | undefined;
  const sortBy = rawSort && SORTS.includes(rawSort) ? rawSort : "mostRecent";
  const page = toInt(read("page"), 1);

  const result = await optionalData(getLikedLists(username, { sortBy, page, pageSize: PAGE_SIZE, authed: true }));
  const lists = mapToCards(result?.results ?? []);

  return (
    <>
      <ListFilters value={{ sortBy }} />

      {lists.length === 0 ? (
        <p className="py-16 text-center font-manrope font-light text-brand-muted">No liked lists yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-10 lg:gap-y-14">
          {lists.map((list, i) => (
            <ListCard key={list.id} list={list} paletteIndex={i} isAuthed />
          ))}
        </div>
      )}

      <Pagination page={result?.page ?? page} totalPages={result?.totalPages ?? 1} />
    </>
  );
}