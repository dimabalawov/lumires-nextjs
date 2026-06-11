import Image from "next/image";
import Link from "next/link";

import { getReviewsWithReplies, withAt, FALLBACK_AVATAR } from "@/lib/reviews/community";
import { createClient } from "@/lib/supabase/server";
import type { ReviewComment } from "@/types/review";

export const metadata = { title: "Reviews · Admin" };

/** Compact 0–5 star score (rounded to the nearest half). */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-brand-gold text-[13px] tracking-[0.1em]" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={rating >= i + 1 ? "" : rating >= i + 0.5 ? "opacity-60" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

function ReplyRow({ reply }: { reply: ReviewComment }) {
  return (
    <li className="flex gap-3 py-2">
      <Image
        src={reply.avatarUrl || FALLBACK_AVATAR}
        alt={reply.username}
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0">
        <span className="font-manrope text-[13px] text-brand-light">{withAt(reply.username)}</span>
        <p className="font-manrope text-[13px] leading-[1.5] text-brand-muted whitespace-pre-line">
          {reply.text}
        </p>
      </div>
    </li>
  );
}

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = await getReviewsWithReplies(12, !!user);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-oswald uppercase font-light text-brand-light text-[28px] tracking-[0.08em]">
          Community Reviews
        </h1>
        <p className="mt-2 font-manrope text-[14px] leading-[1.5] text-brand-muted max-w-[680px]">
          The latest reviews aggregated from this week&apos;s most-reviewed films — the same source
          the home &ldquo;Reviews From The Community&rdquo; section reads from. View-only, including
          each review&apos;s replies. Seed more with{" "}
          <code className="text-brand-gold">npm run seed</code>.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="py-16 text-center font-manrope text-[14px] text-brand-muted">
          No reviews yet. Run <code className="text-brand-gold">npm run seed</code> to populate them.
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {rows.map(({ review, filmId, filmTitle, replies }) => {
            const visibleReplies = replies.filter((r) => (r.text ?? "").trim() !== "");
            return (
              <li
                key={review.id}
                className="rounded-[6px] border border-brand-muted/20 p-5"
              >
                {/* Review header */}
                <div className="flex items-start gap-4">
                  <Image
                    src={review.avatarUrl || FALLBACK_AVATAR}
                    alt={review.username}
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-manrope text-[16px] text-brand-light">
                        {withAt(review.username)}
                      </span>
                      <Link
                        href={`/films/${encodeURIComponent(filmId)}`}
                        className="font-manrope text-[12px] text-brand-gold underline underline-offset-2 hover:opacity-70"
                      >
                        on {filmTitle}
                      </Link>
                      {typeof review.rating === "number" && review.rating > 0 && (
                        <Stars rating={review.rating} />
                      )}
                    </div>
                    {review.title && (
                      <p className="mt-1 font-manrope text-[15px] text-brand-light/90">
                        {review.title}
                      </p>
                    )}
                    <p className="mt-1 font-manrope text-[14px] leading-[1.6] text-brand-muted whitespace-pre-line">
                      {review.text}
                    </p>
                    <div className="mt-2 flex items-center gap-4 font-manrope text-[12px] text-brand-muted/80">
                      <span>{review.likesCount ?? 0} likes</span>
                      <span>{review.repliesCount ?? replies.length} replies</span>
                      <Link
                        href={`/review/${encodeURIComponent(review.id)}?film=${encodeURIComponent(filmId)}`}
                        className="text-brand-gold underline underline-offset-2 hover:opacity-70"
                      >
                        open review →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Replies (read-only) */}
                <div className="mt-4 border-t border-brand-muted/15 pt-3 pl-2">
                  {visibleReplies.length > 0 ? (
                    <ul className="flex flex-col divide-y divide-brand-muted/10">
                      {visibleReplies.map((reply) => (
                        <ReplyRow key={reply.id} reply={reply} />
                      ))}
                    </ul>
                  ) : (
                    <p className="font-manrope text-[12px] text-brand-muted/70">
                      {(review.repliesCount ?? replies.length) > 0
                        ? "Replies exist but the API isn't returning their text yet (known backend serializer bug)."
                        : "No replies yet."}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
