import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import StarRating from "@/components/ui/StarRating";
import LikeButton from "@/components/ui/LikeButton";
import { ReplyIcon } from "@/components/ui/icons";
import { getReview, getReviewReplies } from "@/lib/api/reviews";
import { getMovie } from "@/lib/api/movies";
import { createClient } from "@/lib/supabase/server";
import type { ReviewComment } from "@/types/review";

const FALLBACK_AVATAR = "/imgs/community/noirviewer.png";

interface ReviewPageProps {
  params: Promise<{ reviewId: string }>;
  // Film context is passed by review links so the breadcrumb / film link can be
  // built; the API resolves the review by reviewId alone, so these are optional.
  searchParams: Promise<{ film?: string; slug?: string }>;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${month} ${day} · ${d.getUTCFullYear()}`;
}

function toParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function withAt(username: string): string {
  return username.startsWith("@") ? username : `@${username}`;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { reviewId } = await params;
  const review = await getReview("-", reviewId);
  if (!review) return { title: "Review not found" };
  const title = review.title || `Review by ${review.username}`;
  return {
    title,
    description: review.text?.slice(0, 160),
  };
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const { reviewId } = await params;
  const { film, slug } = await searchParams;

  // When logged in, fetch per-user (Bearer + no-store) so `isLikedByMe` is
  // accurate; otherwise the read stays cached/anonymous.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = !!user;

  const review = await getReview(film ?? "-", reviewId, isAuthed);
  if (!review) notFound();

  // Replies come from the dedicated paginated endpoint (source of truth). Fall
  // back to the review's embedded comments[] only if that request fails.
  const replies = await getReviewReplies(
    film ?? "-",
    reviewId,
    { pageSize: 50, authed: isAuthed },
  ).catch(() => null);
  const comments = replies?.results ?? review.comments ?? [];
  const repliesCount = replies?.totalResults ?? review.repliesCount ?? 0;

  // Film title for the breadcrumb / back-link, only when film context is known.
  const movie = film ? await getMovie(film).catch(() => null) : null;
  const filmTitle = movie?.localization?.title;
  const filmHref = film ? `/films/${encodeURIComponent(film)}` : undefined;

  const breadcrumb: BreadcrumbItem[] = [{ label: "Films", href: "/films" }];
  if (filmTitle && filmHref) breadcrumb.push({ label: filmTitle, href: filmHref });
  breadcrumb.push({ label: "Reviews", href: filmHref ?? "/reviews" });
  breadcrumb.push({ label: "Review" });

  const rating = Math.round(review.rating ?? 0);
  const paragraphs = toParagraphs(review.text);
  const date = formatDate(review.createdAt);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <section className="section-container pt-28 lg:pt-32 pb-24">
        <Breadcrumb className="mb-10" items={breadcrumb} />

        {/* Review: col 1 = avatar, col 2 = meta + title + body + actions */}
        <div className="flex items-start gap-4">
          <Image
            src={review.avatarUrl || FALLBACK_AVATAR}
            alt={review.username}
            width={48}
            height={48}
            className="shrink-0 rounded-full object-cover size-[44px] lg:size-[48px]"
          />

          <div className="min-w-0 flex-1">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-manrope text-[13px]">
              <StarRating count={rating} max={5} className="text-brand-gold text-[14px]" />
              <span className="text-brand-muted">
                review by{" "}
                <span className="font-medium text-brand-gold">{withAt(review.username)}</span>
              </span>
              {date && (
                <span className="uppercase text-brand-muted text-[11px] tracking-[0.12em]">
                  {date}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-brand-muted">
                <span className="text-brand-gold">◆</span>
                {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
              </span>
            </div>

            {/* Title */}
            {review.title && (
              <h1 className="mt-6 font-oswald font-normal text-brand-light text-[32px] leading-[42px] tracking-[0.06em]">
                {review.title}
              </h1>
            )}

            {/* Body */}
            <div className="mt-6 flex max-w-[820px] flex-col gap-5">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-manrope font-normal text-auth-subtitle text-[15px] leading-[27px] tracking-[0.15px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-8 font-oswald uppercase text-[13px] tracking-[0.12em] text-brand-muted">
              <LikeButton
                liked={!!review.isLikedByMe}
                count={review.likesCount ?? 0}
                isAuthed={isAuthed}
                reviewId={review.id}
                filmId={film ?? "-"}
                slug={slug ?? "-"}
              />
              <span className="flex items-center gap-2">
                <ReplyIcon /> reply
              </span>
              <span className="flex items-center gap-2">··· share</span>
            </div>

            {/* Comments */}
            <CommentsList
              comments={comments}
              reviewAuthor={review.username}
              reviewId={review.id}
              filmId={film ?? "-"}
              slug={slug ?? "-"}
              isAuthed={isAuthed}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function CommentsList({
  comments,
  reviewAuthor,
  reviewId,
  filmId,
  slug,
  isAuthed,
}: {
  comments: ReviewComment[];
  reviewAuthor: string;
  reviewId: string;
  filmId: string;
  slug: string;
  isAuthed: boolean;
}) {
  if (!comments?.length) {
    return (
      <p className="mt-14 border-l border-brand-gold/30 pl-6 font-manrope text-[14px] text-brand-muted">
        No replies yet.
      </p>
    );
  }

  return (
    <div className="mt-14 border-l border-brand-gold/30 pl-6 lg:pl-10 flex flex-col gap-10">
      {comments.map((comment) => {
        const target = comment.targetedUserUsername;
        // Hide the "reply to" line when it points at the review author or the
        // replier themselves — it carries no information in those cases.
        const showReplyTo = !!target && target !== reviewAuthor && target !== comment.username;
        const date = formatDate(comment.createdAt);
        return (
          <article key={comment.id} className="flex items-start gap-4">
            <Image
              src={comment.avatarUrl || FALLBACK_AVATAR}
              alt={comment.username}
              width={40}
              height={40}
              className="shrink-0 rounded-full object-cover size-[36px] lg:size-[40px]"
            />
            <div className="min-w-0 flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex flex-col gap-0.5">
                  <span className="font-manrope text-[15px] text-[#DCD8D3]">
                    {withAt(comment.username)}
                  </span>
                  {showReplyTo && target && (
                    <span className="font-manrope text-[12px] text-brand-gold underline underline-offset-2">
                      → reply to {withAt(target)}
                    </span>
                  )}
                </div>
                {date && (
                  <span className="uppercase text-brand-muted text-[11px] tracking-[0.12em]">
                    {date}
                  </span>
                )}
              </div>
              {comment.text && (
                <p className="font-manrope text-[14px] leading-[24px] text-[#DCD8D3] whitespace-pre-line">
                  {comment.text}
                </p>
              )}
              <div className="mt-1 flex items-center gap-6 font-oswald uppercase text-[12px] tracking-[0.1em] text-brand-muted">
                <LikeButton
                  liked={!!comment.isLikedByMe}
                  count={comment.likesCount ?? 0}
                  isAuthed={isAuthed}
                  reviewId={reviewId}
                  replyId={comment.id}
                  filmId={filmId}
                  slug={slug}
                />
                <span className="flex items-center gap-2">
                  <ReplyIcon /> reply
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
