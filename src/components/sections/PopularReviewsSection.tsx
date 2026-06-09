"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import GradientDivider from "@/components/ui/GradientDivider";
import StarRating from "@/components/ui/StarRating";
import { popularReviews as defaultPopularReviews } from "@/data/popularReviews";
import type { FeaturedReview } from "@/types/review";

const CARD_GRADIENT =
  "linear-gradient(125deg, rgba(210,166,106,0.12) 0%, rgba(64,45,27,0.12) 26%, rgba(210,166,106,0) 58%), #12100e";

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7L10 2.5V11.5L3 7Z" fill="currentColor" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M11 7L4 11.5V2.5L11 7Z" fill="currentColor" />
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
  "absolute top-1/2 -translate-y-1/2 z-10 size-10 rounded-full border border-brand-gold/70 text-brand-gold flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-colors";

interface PopularReviewsSectionProps {
  reviews?: FeaturedReview[];
}

export default function PopularReviewsSection({
  reviews = defaultPopularReviews,
}: PopularReviewsSectionProps = {}) {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  const total = reviews.length;

  const eyebrow = [review.tag, review.timeAgo].filter(Boolean).join(" \u00b7 ");
  const filmMeta = [
    review.year,
    review.genre,
    review.runtime,
    review.director ? `directed by ${review.director}` : "",
  ].filter(Boolean);
  const authorMeta = [review.date, review.readTime].filter(Boolean).join(" \u00b7 ");

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="section-container pt-8 pb-16 lg:pt-12 lg:pb-24">
      <h2 className="mb-8 lg:mb-10 font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.02em]">
        Popular <span className="text-brand-gold">Reviews</span>
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className={`${arrowClasses} left-3 lg:left-[22px]`}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className={`${arrowClasses} right-3 lg:right-[22px]`}
        >
          <ChevronRight />
        </button>

        <article
          className="relative overflow-hidden rounded-md border border-[rgba(210,166,106,0.18)] lg:aspect-[2/1]"
          style={{ background: CARD_GRADIENT }}
        >
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 md:p-8 lg:h-full lg:grid-cols-[258px_minmax(0,1fr)] lg:gap-[45px] lg:px-[88px] lg:py-[29px]">
            <div className="relative w-full max-w-[258px] aspect-[2/3] overflow-hidden rounded-[3px] shadow-2xl">
              <Image
                src={review.posterUrl}
                alt={review.title}
                fill
                sizes="(min-width: 1024px) 258px, (min-width: 768px) 240px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-col lg:h-full">
              {eyebrow && (
                <div className="flex items-center gap-2 font-oswald uppercase text-brand-gold text-xs tracking-[0.2em]">
                  <span aria-hidden>{"\u2605"}</span>
                  <span>{eyebrow}</span>
                </div>
              )}

              <h3 className="mt-5 max-w-[720px] font-oswald font-light text-brand-gold leading-[1.02] tracking-[0.01em] text-4xl lg:text-[64px] lg:leading-none">
                {review.href ? (
                  <Link href={review.href} className="hover:opacity-80 transition-opacity">
                    {review.title}
                  </Link>
                ) : (
                  review.title
                )}
              </h3>

              {filmMeta.length > 0 && (
                <p className="mt-2 font-manrope font-normal text-brand-muted text-[14px] lg:text-[15px] leading-[25px]">
                  {filmMeta.join(" \u00b7 ")}
                </p>
              )}

              <p className="mt-6 max-w-[655px] font-manrope font-light text-brand-light text-[22px] leading-[1.32] lg:text-[28px]">
                &ldquo;{review.pullQuote}&rdquo;
              </p>

              {review.body.length > 0 && (
                <div className="mt-7 border-l border-brand-gold/40 pl-5 flex flex-col gap-5 max-w-[650px]">
                  {review.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-manrope font-normal text-auth-subtitle text-[15px] leading-[24px] tracking-[0.01em]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              <GradientDivider className="mt-8 lg:mt-auto" />

              <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
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
                    {authorMeta && (
                      <span className="font-oswald uppercase text-brand-muted text-[11px] tracking-[0.12em]">
                        {authorMeta}
                      </span>
                    )}
                  </div>
                </div>

                <StarRating count={review.rating} max={5} className="text-brand-gold text-[16px]" />

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
