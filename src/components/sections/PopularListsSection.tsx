import ListsCarouselSection from "@/components/sections/ListsCarouselSection";
import type { ListCardData } from "@/types/film";
import type { PopularList } from "@/types/profile";

/** Map the profile's popular-list payload onto the shared trending-carousel card. */
function toListCardData(lists: PopularList[]): ListCardData[] {
    return lists.map((l) => ({
        id: l.id,
        title: l.title,
        filmCount: l.filmCount,
        author: l.username,
        posters: l.films
            .map((f) => f.posterPath)
            .filter((p): p is string => Boolean(p))
            .slice(0, 4),
    }));
}

export default function PopularListsSection({ lists }: { lists: PopularList[] }) {
    if (!lists?.length) return null;

    return (
        <ListsCarouselSection
            title="Popular"
            titleAccent="Lists"
            lists={toListCardData(lists)}
        />
    );
}
