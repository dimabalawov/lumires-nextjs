import Image from "next/image";
import Link from "next/link";

import StarRating from "@/components/ui/StarRating";
import type { ActivityReview } from "@/types/review";

function Diamond() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
      <path d="M4 0l4 4-4 4-4-4z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.23l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.41L12 21.23z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function BookmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareDotsIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 20 14" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="7" r="1.6" />
      <circle cx="10" cy="7" r="1.6" />
      <circle cx="17" cy="7" r="1.6" />
    </svg>
  );
}

const actionClass =
  "flex items-center gap-2 hover:text-brand-light transition-colors";

export default function ActivityCard({
  review,
  divider = true,
}: {
  review: ActivityReview;
  divider?: boolean;
}) {
  return (
    <article
      className={`grid grid-cols-[auto_1fr_auto] gap-4 lg:gap-6 py-8 ${
        divider ? "border-t border-[#DACBBD]/10" : ""
      }`}
    >
      {/* Avatar */}
      <Image
        src={review.avatarUrl}
        alt={review.username}
        width={50}
        height={50}
        className="shrink-0 rounded-full object-cover size-[44px] lg:size-[50px]"
      />

      {/* Content */}
      <div className="min-w-0 flex flex-col gap-3">
        {/* Header line */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-manrope">
          <StarRating count={review.rating} max={5} className="text-brand-gold text-[13px]" />
          <span className="text-brand-muted">
            review by{" "}
            <span className="font-medium text-brand-gold">{review.username}</span>
          </span>
          <span className="text-brand-muted uppercase text-[11px] tracking-[0.12em]">
            {review.timeAgo}
          </span>
          <span className="flex items-center gap-1.5 text-brand-muted">
            <span className="text-brand-gold">
              <Diamond />
            </span>
            {review.replies} {review.replies === 1 ? "reply" : "replies"}
          </span>
        </div>

        {/* Film link */}
        <Link
          href={review.filmHref}
          className="self-start font-manrope text-[13px] tracking-[0.04em] text-brand-gold underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          on {review.filmTitle}
        </Link>

        {/* Title */}
        <h3 className="font-oswald font-light text-brand-light text-[24px] lg:text-[28px] leading-[1.1]">
          {review.title}
        </h3>

        {/* Body */}
        <div className="flex flex-col gap-3 max-w-[760px]">
          {review.body.map((paragraph, i) => (
            <p
              key={i}
              className="font-manrope font-normal text-auth-subtitle text-[15px] leading-[26px] tracking-[0.3px]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-1 flex flex-wrap items-center gap-6 font-manrope uppercase text-[12px] tracking-[0.1em] text-brand-muted">
          <button type="button" className={actionClass}>
            <span className="text-brand-gold">
              <HeartIcon />
            </span>
            {review.likes} likes
          </button>
          <button type="button" className={actionClass}>
            <CommentIcon /> reply
          </button>
          <button type="button" className={actionClass}>
            <BookmarkIcon /> save
          </button>
          <button type="button" className={actionClass}>
            <ShareDotsIcon /> share
          </button>
        </div>
      </div>

      {/* Poster */}
      <div className="relative w-[84px] lg:w-[110px] aspect-[2/3] shrink-0 overflow-hidden rounded-sm">
        <Image
          src={review.posterUrl}
          alt={review.filmTitle}
          fill
          sizes="(min-width: 1024px) 110px, 84px"
          className="object-cover"
        />
      </div>
    </article>
  );
}
