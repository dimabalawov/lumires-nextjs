"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import GradientDivider from "@/components/ui/GradientDivider";
import StarRating from "@/components/ui/StarRating";
import { popularReviews as defaultPopularReviews } from "@/data/popularReviews";
import type { FeaturedReview } from "@/types/review";

// Card fill + stroke per Figma: gold (D2A66A) gradient 10%→0% over dark, 1px gold @18% inside stroke.
const CARD_GRADIENT =
  "linear-gradient(135deg, rgba(210,166,106,0.10) 0%, rgba(210,166,106,0) 60%), #12100e";

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

const arrowClasses =
  "absolute top-1/2 -translate-y-1/2 z-10 size-10 rounded-full border border-brand-gold/60 text-brand-gold flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors";

interface PopularReviewsSectionProps {
  reviews?: FeaturedReview[];
}

export default function PopularReviewsSection({
  reviews = defaultPopularReviews,
}: PopularReviewsSectionProps = {}) {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  const total = reviews.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="section-container pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Heading */}
      <h2 className="mb-8 lg:mb-10 font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.02em]">
        Popular <span className="text-brand-gold">Reviews</span>
      </h2>

      <div className="relative">
        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className={`${arrowClasses} left-3 lg:left-6`}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className={`${arrowClasses} right-3 lg:right-6`}
        >
          <ChevronRight />
        </button>

        {/* Card */}
        <article
        className="relative rounded-md overflow-hidden border border-[rgba(210,166,106,0.18)] lg:aspect-[2/1]"
        style={{ background: CARD_GRADIENT }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8 p-6 md:px-8 lg:px-24 lg:h-full">
          {/* Poster */}
          <div className="relative w-full max-w-[280px] aspect-[2/3] overflow-hidden shadow-2xl">
            <Image
              src={review.posterUrl}
              alt={review.title}
              fill
              sizes="(min-width: 1024px) 240px, (min-width: 768px) 220px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col lg:h-full">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 font-oswald uppercase text-brand-gold text-xs tracking-[0.2em]">
              <span aria-hidden>★</span>
              <span>
                {review.tag} · {review.timeAgo}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-4 font-oswald font-light text-brand-gold leading-[1.02] tracking-[0.01em] text-4xl lg:text-[52px]">
              {review.href ? (
                <Link href={review.href} className="hover:opacity-80 transition-opacity">
                  {review.title}
                </Link>
              ) : (
                review.title
              )}
            </h3>

            {/* Meta */}
            <p className="mt-3 font-manrope font-normal text-auth-subtitle text-[14px] lg:text-[16px] leading-[25px]">
              {review.year} · {review.genre} · {review.runtime} · directed by {review.director}
            </p>

            {/* Pull quote */}
            <p className="mt-6 font-manrope font-light text-brand-light text-[22px] lg:text-[26px] leading-[1.3] max-w-[640px]">
              &ldquo;{review.pullQuote}&rdquo;
            </p>

            {/* Body */}
            <div className="mt-6 border-l border-brand-gold/40 pl-5 flex flex-col gap-4 max-w-[607px]">
              {review.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-manrope font-normal text-auth-subtitle text-[15px] leading-[26px] tracking-[0.3px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <GradientDivider className="mt-8 lg:mt-auto" />

            {/* Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Image
                  src={review.avatarUrl}
                  alt={review.username}
                  width={40}
                  height={40}
                  className="shrink-0 rounded-full object-cover size-[40px]"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-manrope font-medium text-[14px] tracking-[0.04em] text-brand-gold">
                    {review.username}
                  </span>
                  <span className="font-oswald uppercase text-brand-muted text-[11px] tracking-[0.12em]">
                    {review.date} · {review.readTime}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <StarRating count={review.rating} max={5} className="text-brand-gold text-[16px]" />

              {/* Stats */}
              <div className="flex items-center gap-6 text-brand-muted font-manrope text-[14px]">
                <span className="flex items-center gap-2">
                  <span className="text-brand-gold">
                    <HeartIcon />
                  </span>
                  {review.likes}
                </span>
                <span className="flex items-center gap-2">
                  <CommentIcon />
                  {review.replies} replies
                </span>
              </div>
            </div>
          </div>
        </div>
        </article>
      </div>
    </section>
  );
}
