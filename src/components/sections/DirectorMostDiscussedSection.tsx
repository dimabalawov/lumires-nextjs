import Image from "next/image";
import Link from "next/link";
import type { DirectorMostDiscussed } from "@/data/directors";
import type { EditorialReply } from "@/types/film";
import LikeButton from "@/components/ui/LikeButton";
import { HeartIcon, ReplyIcon } from "@/components/ui/icons";
import { AccentTitle } from "../ui/AccentTitle";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

/** Profile route slug for a username (strips the leading "@"; the route lowercases). */
function profileSlug(username: string): string {
  return encodeURIComponent(username.replace(/^@/, ""));
}

/** Avatar + username, linked to the user's profile. */
function UserLink({ username, avatarUrl }: { username: string; avatarUrl: string }) {
  return (
    <Link
      href={`/profile/${profileSlug(username)}`}
      className="flex items-center gap-4 transition-opacity hover:opacity-80"
    >
      <Image
        src={avatarUrl}
        alt={username}
        width={40}
        height={40}
        className="shrink-0 rounded-full object-cover size-[40px]"
      />
      <span className="font-manrope font-medium text-brand-light text-[14px] tracking-[0.06em]">
        {username}
      </span>
    </Link>
  );
}

function ReplyItem({
  reply,
  isAuthed,
  reviewId,
  filmId,
}: {
  reply: EditorialReply;
  isAuthed: boolean;
  reviewId?: string;
  filmId?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <Link href={`/profile/${profileSlug(reply.username)}`} className="shrink-0">
          <Image
            src={reply.avatarUrl}
            alt={reply.username}
            width={40}
            height={40}
            className="rounded-full object-cover size-[40px] transition-opacity hover:opacity-80"
          />
        </Link>
        <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="flex flex-col gap-1">
            <Link
              href={`/profile/${profileSlug(reply.username)}`}
              className="font-manrope font-medium text-[14px] leading-[1.4] tracking-[0.06em] text-brand-light hover:text-brand-gold transition-colors"
            >
              {reply.username}
            </Link>
            <span className="font-manrope font-normal text-[12px] leading-[1.4] tracking-[0.06em] text-brand-gold underline underline-offset-2">
              → reply to {reply.replyTo}
            </span>
          </div>
          <span className="font-manrope font-normal text-[11px] leading-none tracking-[0.2em] text-brand-muted">
            {reply.date}
          </span>
        </div>
      </div>

      <div className="mt-3 pl-[56px]">
        <p className="font-manrope font-normal text-[14px] leading-[1.7] tracking-[0.02em] text-brand-light/90">
          &ldquo;{reply.text}&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-6 font-manrope text-[11px] uppercase tracking-[0.12em] text-brand-muted">
          {reply.replyId ? (
            <LikeButton
              liked={reply.likedByMe ?? false}
              count={reply.likesCount ?? 0}
              isAuthed={isAuthed}
              reviewId={reviewId ?? "-"}
              replyId={reply.replyId}
              filmId={filmId ?? "-"}
              slug="-"
            />
          ) : (
            <span className="flex items-center gap-1.5">
              <HeartIcon /> {reply.likes} likes
            </span>
          )}
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer"
          >
            <ReplyIcon /> reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DirectorMostDiscussedSection({
  thread,
  isAuthed = false,
}: {
  thread: DirectorMostDiscussed;
  isAuthed?: boolean;
}) {
  // When the thread is backed by a real review, deep-link to the film's reviews.
  const reviewsHref = thread.filmId ? `/films/${thread.filmId}` : "#";

  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">
      <AccentTitle text="Most Discussed" accent="This Week" className="mb-6 lg:mb-8 uppercase" />

      <article
        className="rounded-[6px] px-6 py-7 lg:px-10 lg:py-9"
        style={{ background: CARD_BG }}
      >
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[260px_1fr]">

          {/* Poster + film meta */}
          <div className="grid grid-cols-[250px_1fr] gap-x-5 gap-y-2 items-center lg:flex lg:flex-col lg:items-start">

            <Link
              href={reviewsHref}
              className="relative aspect-[2/3] w-full lg:max-w-none overflow-hidden rounded-[4px] transition-opacity hover:opacity-90"
            >
              <Image
                src={thread.filmPoster}
                alt={thread.filmTitle}
                fill
                sizes="(min-width: 1024px) 260px, 250px"
                className="object-cover"
              />
            </Link>

            <div className="flex flex-col text-center lg:text-left justify-between gap-15 lg:gap-0 lg:justify-normal">
              <Link
                href={reviewsHref}
                className="mt-0 lg:mt-5 font-oswald font-normal text-brand-gold text-4xl md:text-5xl lg:text-[24px] leading-10 lg:leading-8 tracking-[0.06em] hover:opacity-80 transition-opacity"
              >
                {thread.filmTitle}
              </Link>
              <p className="mt-2 font-manrope font-light uppercase text-brand-light text-lg md:text-xl lg:text-[12px] tracking-[0.2em]">
                — {thread.reviewsThisWeek} Reviews This Week
              </p>
            </div>

          </div>

          {/* Thread */}
          <div className="flex flex-col">
            {/* Author row */}
            <div className="flex items-center gap-4 flex-wrap">
              <UserLink username={thread.author} avatarUrl={thread.authorAvatar} />
              {thread.date && (
                <span className="font-manrope font-normal text-brand-muted text-[11px] tracking-[0.2em]">
                  {thread.date}
                </span>
              )}
              <span className="flex items-center gap-1.5 font-manrope font-normal text-brand-gold text-[12px] tracking-[0.06em]">
                <span className="text-[9px] leading-none">◆</span>
                {thread.replies} replies
              </span>
            </div>

            {/* Title */}
            <h4 className="mt-5 font-manrope font-medium text-brand-light text-[22px] leading-[1.3] lg:text-[26px] tracking-[0.02em]">
              {thread.title}
            </h4>

            {/* Quote */}
            <p className="mt-4 font-manrope font-normal text-brand-light/90 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] tracking-[0.06em]">
              &ldquo;{thread.quote}&rdquo;
            </p>

            {/* Actions */}
            <div className="mt-5 flex items-center gap-6 font-manrope text-[11px] uppercase tracking-[0.12em] text-brand-muted">
              {thread.reviewId ? (
                <LikeButton
                  liked={thread.likedByMe ?? false}
                  count={thread.likesCount ?? 0}
                  isAuthed={isAuthed}
                  reviewId={thread.reviewId}
                  filmId={thread.filmId ?? "-"}
                  slug="-"
                />
              ) : (
                <span className="flex items-center gap-1.5">
                  <HeartIcon /> {thread.likes} likes
                </span>
              )}
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer"
              >
                <ReplyIcon /> reply
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer"
              >
                <span className="leading-none">···</span> share
              </button>
            </div>

            {/* Replies — indented with left guide */}
            {thread.topReplies.length > 0 && (
              <div className="mt-8 pl-2 lg:pl-4">
                <div className="flex flex-col gap-8 border-l border-brand-light/15 pl-6 lg:pl-8">
                  {thread.topReplies.map((reply) => (
                    <ReplyItem
                      key={reply.id}
                      reply={reply}
                      isAuthed={isAuthed}
                      reviewId={thread.reviewId}
                      filmId={thread.filmId}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Show all reviews */}
            <div className="mt-8 flex justify-end">
              <Link
                href={reviewsHref}
                className="font-oswald uppercase text-brand-gold text-[13px] tracking-[0.18em] underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Show All Reviews →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
