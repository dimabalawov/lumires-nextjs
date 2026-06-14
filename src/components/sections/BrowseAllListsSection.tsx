import ListCard from "@/components/ui/ListCard";
import Pagination from "@/components/ui/Pagination";
import ListFilters from "@/components/sections/ListFilters";
import CreateListModal from "@/components/ui/CreateListModal";
import { getLists } from "@/lib/api/lists";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import { browseLists } from "@/data/browseLists";
import type { BrowseListItem, ListCategoryFilter, ListSortOrder } from "@/types/api";
import type { CollectionData } from "@/types/film";

const PAGE_SIZE = 10;

const CATEGORIES: ListCategoryFilter[] = [
  "all",
  "trending",
  "recentlyUpdated",
  "editorPicks",
  "newLists",
  "friendsLists",
];
const SORTS: ListSortOrder[] = ["mostRecent", "mostPopular", "mostFilms"];

function toInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/** Read a film count from any of the plausible (undocumented) field names. */
function readFilmCount(item: BrowseListItem): number | undefined {
  const rec = item as unknown as Record<string, unknown>;
  for (const key of ["filmCount", "filmsCount", "count", "totalFilms", "moviesCount"]) {
    const v = rec[key];
    if (typeof v === "number" && v > 0) return v;
  }
  return item.filmsCount;
}

function mapToCards(items: BrowseListItem[]): CollectionData[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    // Real posters rendered in the card's filmstrip.
    films: (item.films ?? [])
      .map((f) => tmdbImage(f.backdropPath, "w500") ?? "")
      .filter(Boolean),
    filmsCount: readFilmCount(item),
    isPrivate: false,
    isMyList: item.isMyList,
    author: item.username,
    isLiked: item.isLikedByMe,
    isSaved: item.isSavedByMe,
  }));
}

interface BrowseAllListsSectionProps {
  searchParams?: Record<string, string | string[] | undefined>;
  isAuthed?: boolean;
}

export default async function BrowseAllListsSection({
  searchParams = {},
  isAuthed = false,
}: BrowseAllListsSectionProps) {
  const read = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const rawCategory = read("category") as ListCategoryFilter | undefined;
  const rawSort = read("sortBy") as ListSortOrder | undefined;
  const category = rawCategory && CATEGORIES.includes(rawCategory) ? rawCategory : "all";
  const sortBy = rawSort && SORTS.includes(rawSort) ? rawSort : "mostRecent";
  const requestedPage = toInt(read("page"), 1);

  const result = await optionalData(
    getLists({ category, sortBy, page: requestedPage, pageSize: PAGE_SIZE, authed: isAuthed }),
  );

  const apiLists = result?.results ?? [];
  const lists = apiLists.length > 0 ? mapToCards(apiLists) : browseLists;
  const currentPage = result?.page ?? requestedPage;
  const totalPages = result?.totalPages ?? 1;

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <div className="mb-8 lg:mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
            Browse <span className="text-brand-gold">Lists</span>
          </h2>
          <CreateListModal isAuthed={isAuthed} />
        </div>

        <ListFilters value={{ category, sortBy }} />

        {lists.length === 0 ? (
          <p className="py-16 text-center font-manrope font-light text-brand-muted">
            No lists match these filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-10 lg:gap-y-14">
            {lists.map((list, i) =>
              (!list.isPrivate || list.isMyList) && (
                <ListCard
                  key={list.id}
                  list={list}
                  paletteIndex={i}
                  isAuthed={isAuthed}
                />
              )
            )}

          </div>
        )}

        <Pagination page={currentPage} totalPages={totalPages} />
      </div>
    </section>
  );
}
