import Image from "next/image";
import Link from "next/link";

import GradientDivider from "@/components/ui/GradientDivider";
import StarRating from "@/components/ui/StarRating";
import { ProfileFeaturedReview } from "@/types/profile";

const CARD_GRADIENT =
    "linear-gradient(125deg, rgba(210,166,106,0.12) 0%, rgba(64,45,27,0.12) 26%, rgba(210,166,106,0) 58%), #12100e";


function formatDate(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(iso?: string) {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const mins = Math.floor((Date.now() - then) / 60000);
    if (mins < 60) return `${Math.max(mins, 1)} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mo ago`;
    return `${Math.floor(months / 12)} yr ago`;
}

function HeartIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21.23l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.41L12 21.23z" />
        </svg>
    );
}

function CommentIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.38 8.38 0 0 1 8.5-8.5A8.5 8.5 0 0 1 21 11.5z" />
        </svg>
    );
}

function Poster({ src, alt, sizes }: { src: string | null; alt: string; sizes: string }) {
    if (!src) return <div className="absolute inset-0 bg-brand-light/10" />;
    return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />;
}

function ReviewFooter({
    review,
    authorMeta,
}: {
    review: ProfileFeaturedReview;
    authorMeta: string;
}) {
    return (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-gold/40">
                    {review.avatarUrl ? (
                        <Image src={review.avatarUrl} alt={review.username} fill className="object-cover" />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center bg-brand-gold text-[14px] text-black">
                            {review.username[0]?.toUpperCase()}
                        </span>
                    )}
                </span>
                <div className="flex flex-col gap-0.5">
                    <span className="font-manrope font-medium text-[14px] tracking-[0.04em] text-brand-gold">
                        {review.username}
                    </span>
                    {authorMeta && (
                        <span className="font-oswald uppercase text-brand-muted text-[11px] tracking-[0.12em]">
                            {authorMeta}
                        </span>
                    )}
                </div>
            </div>
            <StarRating count={review.rating ?? 0} max={5} className="text-brand-gold text-[16px]" />
            <div className="flex items-center gap-6 text-brand-muted font-manrope text-[14px]">
                <span className="flex items-center gap-2">
                    <span className="text-brand-gold">
                        <HeartIcon />
                    </span>
                    {review.likesCount}
                </span>
                <span className="flex items-center gap-2">
                    <CommentIcon />
                    {review.repliesCount} replies
                </span>
            </div>
        </div>
    );
}

export default function PopularReviewCard({ review }: { review: ProfileFeaturedReview }) {
    const eyebrow = [review.isEditorPick ? "Editor pick" : "", relativeTime(review.createdAt)]
        .filter(Boolean)
        .join(" \u00b7 ");
    const filmMeta = [
        review.releaseYear,
        review.genres?.length ? review.genres.join(", ") : "",
        review.runtime ? `${review.runtime} min` : "",
        review.directorName ? `directed by ${review.directorName}` : "",
    ].filter(Boolean);
    const authorMeta = [formatDate(review.createdAt), review.minutesRead ? `${review.minutesRead} min read` : ""]
        .filter(Boolean)
        .join(" \u00b7 ");

    const poster = review.posterPath;
    const filmHref = `/films/${review.filmSlug}`;

    return (
        <article
            className="relative overflow-hidden rounded-md border border-[rgba(210,166,106,0.18)]"
            style={{ background: CARD_GRADIENT }}
        >
            <div
                className="grid grid-cols-[120px_minmax(0,1fr)] gap-6 p-6 
            md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 md:p-8 
            lg:hidden"
            >
                <div className="relative w-full aspect-2/3 overflow-hidden rounded-[3px] shadow-2xl">
                    <Poster src={poster} alt={review.filmTitle} sizes="240px" />
                </div>
                <div className="flex flex-col stretch justify-around lg:justify-center min-w-0">
                    {eyebrow && (
                        <div className="flex items-center gap-2 font-oswald uppercase text-brand-gold text-xl lg:text-xs tracking-[0.2em]">
                            <span aria-hidden>{"\u2605"}</span>
                            <span>{eyebrow}</span>
                        </div>
                    )}
                    <h3 className="mt-5 font-oswald font-light text-brand-gold leading-[1.02] tracking-[0.01em] text-6xl lg:text-4xl">
                        <Link href={filmHref} className="hover:opacity-80 transition-opacity">
                            {review.filmTitle}
                        </Link>
                    </h3>
                    {filmMeta.length > 0 && (
                        <p className="mt-2 font-manrope font-normal text-brand-muted text-[20px] lg:text-[14px] leading-6.25">
                            {filmMeta.join(" \u00b7 ")}
                        </p>
                    )}
                </div>
            </div>

            <div className="hidden lg:grid h-full grid-cols-[258px_minmax(0,1fr)] gap-11.25 px-10 py-7.25">
                <div className="relative w-full max-w-64.5 aspect-2/3 overflow-hidden rounded-[3px] shadow-2xl">
                    <Poster src={poster} alt={review.filmTitle} sizes="258px" />
                </div>
                <div className="flex min-w-0 flex-col h-full">
                    {eyebrow && (
                        <div className="flex items-center gap-2 font-oswald uppercase text-brand-gold text-xs tracking-[0.2em]">
                            <span aria-hidden>{"\u2605"}</span>
                            <span>{eyebrow}</span>
                        </div>
                    )}
                    <h3 className="mt-5 max-w-180 font-oswald font-light text-brand-gold leading-[1.02] tracking-[0.01em] text-[64px]">
                        <Link href={filmHref} className="hover:opacity-80 transition-opacity">
                            {review.filmTitle}
                        </Link>
                    </h3>
                    {filmMeta.length > 0 && (
                        <p className="mt-2 font-manrope font-normal text-brand-muted text-[15px] leading-6.25">
                            {filmMeta.join(" \u00b7 ")}
                        </p>
                    )}
                    {review.title && (
                        <p className="mt-6 font-manrope font-extralight text-brand-light line-clamp-3 text-[28px] tracking-[6%] leading-9">
                            "{review.title}"
                        </p>
                    )}

                    <div className="flex border-l border-brand-light/15 pl-5 mt-9.75">
                        <p className="mt-2 max-w-163.75 font-manrope font-light text-brand-light text-[14px] leading-6 tracking-[6%]">
                            &ldquo;{review.text}&rdquo;
                        </p>
                    </div>

                    <GradientDivider className="mt-auto" />
                    <ReviewFooter review={review} authorMeta={authorMeta} />
                </div>
            </div>

            <div className="lg:hidden flex flex-col px-6 pb-6 md:px-8 md:pb-8">
                {review.title && (
                    <p className="mb-2 font-manrope font-medium text-brand-gold text-[14px] tracking-[0.02em]">
                        {review.title}
                    </p>
                )}
                <p className="font-manrope font-light text-brand-light text-[22px] leading-[1.32]">
                    &ldquo;{review.text}&rdquo;
                </p>
                <GradientDivider className="mt-8" />
                <ReviewFooter review={review} authorMeta={authorMeta} />
            </div>
        </article>
    );
}