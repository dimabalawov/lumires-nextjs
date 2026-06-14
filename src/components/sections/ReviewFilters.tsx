"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ContentFilterEnum, ContentOrderEnum, RatingEnum } from "@/types/api";

const CATEGORIES = [
    { value: ContentFilterEnum.All, label: "All Reviews" },
    { value: ContentFilterEnum.FromFriends, label: "From Friends" },
    { value: ContentFilterEnum.LongForm, label: "Long-form" },
    { value: ContentFilterEnum.SpoilerFree, label: "Spoiler-free" },
];
const RATINGS = [
    { value: RatingEnum.All, label: "All" },
    { value: RatingEnum.MoreThanFourHalf, label: "4½★ & up" },
    { value: RatingEnum.FourStars, label: "4★" },
    { value: RatingEnum.ThreeStars, label: "3★" },
    { value: RatingEnum.UnderThree, label: "Under 3★" },
];
const SORTS = [
    { value: ContentOrderEnum.MostRecent, label: "Most Recent" },
    { value: ContentOrderEnum.MostLiked, label: "Most Liked" },
    { value: ContentOrderEnum.MostReplies, label: "Most Replies" },
    { value: ContentOrderEnum.HighestRated, label: "Highest Rated" },
];

const selectClass =
    "appearance-none bg-transparent border border-brand-gold/30 rounded-[4px] pl-3 pr-8 py-1.5 text-brand-light font-manrope font-normal text-[13px] tracking-[0.2em] uppercase cursor-pointer hover:border-brand-gold/60 transition-colors";
const labelClass =
    "uppercase text-brand-muted text-[12px] tracking-[0.18em] font-manrope font-normal";
const chevron = (
    <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-2 w-3 text-brand-muted">
        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
);

interface ReviewFiltersProps {
    userSection?: boolean;
}

export default function ReviewFilters({ userSection = false }: ReviewFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const category = Number(params.get("category") ?? ContentFilterEnum.All);
    const filter = Number(params.get("filter") ?? RatingEnum.All);
    const sortBy = Number(params.get("sortBy") ?? ContentOrderEnum.MostRecent);

    function update(key: string, value: number, fallback: number) {
        const next = new URLSearchParams(params.toString());
        if (value === fallback) next.delete(key);
        else next.set(key, String(value));
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`, { scroll: false });
    }

    return (
        <>
            {!userSection && (
                <FilterTabs
                    tabs={CATEGORIES}
                    active={category}
                    onChange={(v) => update("category", v, ContentFilterEnum.All)}
                />
            )}

            <div className="mb-10 lg:mb-12 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-3">
                    <span className={labelClass}>Rating</span>
                    <span className="relative inline-block">
                        <select className={selectClass} value={filter} onChange={(e) => update("filter", Number(e.target.value), RatingEnum.All)}>
                            {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        {chevron}
                    </span>
                </label>
                <label className="flex items-center gap-3">
                    <span className={labelClass}>Sort</span>
                    <span className="relative inline-block">
                        <select className={selectClass} value={sortBy} onChange={(e) => update("sortBy", Number(e.target.value), ContentOrderEnum.MostRecent)}>
                            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        {chevron}
                    </span>
                </label>
            </div>
        </>
    );
}