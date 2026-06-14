import ListCard from "@/components/ui/ListCard";
import Pagination from "@/components/ui/Pagination";
import ListFilters from "@/components/sections/ListFilters";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import { AccentTitle } from "@/components/ui/AccentTitle";
import type { BrowseListItem, ListCategoryFilter, ListSortOrder } from "@/types/api";
import type { CollectionData } from "@/types/film";
import { getLists } from "@/lib/api";

const PAGE_SIZE = 10;
const SORTS: ListSortOrder[] = ["mostRecent", "mostPopular", "mostFilms"];

function toInt(value: string | undefined, fallback: number): number {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}


function mapToCards(items: BrowseListItem[]): CollectionData[] {
    return items.map((item) => ({
        ...item,
        films: (item.films ?? [])
            .map((f) => tmdbImage(f.backdropPath, "w780") ?? "")
            .filter(Boolean),
    }));
}


interface Props {
    userId: string;
    username: string;
    searchParams?: Record<string, string | string[] | undefined>;
    isAuthed?: boolean;
}

export default async function UserListsSection({
    userId,
    username,
    searchParams = {},
    isAuthed = true,
}: Props) {

    const read = (key: string) => {
        const v = searchParams[key];
        return Array.isArray(v) ? v[0] : v;
    };

    const rawSort = read("sortBy") as ListSortOrder | undefined;
    const sortBy = rawSort && SORTS.includes(rawSort) ? rawSort : "mostRecent";
    const requestedPage = toInt(read("page"), 1);

    const result = await optionalData(
        getLists({
            userId,
            sortBy,
            page: requestedPage,
            pageSize: PAGE_SIZE,
            authed: isAuthed,
        }),
    );

    const apiLists = result?.results ?? [];
    const lists = mapToCards(apiLists);

    const currentPage = result?.page ?? requestedPage;
    const totalPages = result?.totalPages ?? 1;

    return (
        <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
            <div className="section-container">
                <AccentTitle className={"mb-10"} text="Lists by" accent={username} />

                <ListFilters value={{ sortBy }} />

                {lists.length === 0 ? (
                    <p className="py-16 text-center font-manrope font-light text-brand-muted">
                        No lists match these filters.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-10 lg:gap-y-14">
                        {lists.map((list, i) => (
                            <ListCard key={list.id} list={list} paletteIndex={i} isAuthed={isAuthed} />
                        ))}
                    </div>
                )}

                <Pagination page={currentPage} totalPages={totalPages} />
            </div>
        </section>
    );
}