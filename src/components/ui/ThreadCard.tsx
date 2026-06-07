import Image from "next/image";
import Link from "next/link";
import { CommunityThread } from "@/types/film";
import LikeButton from "@/components/ui/LikeButton";

/** Compact 0–5 rating with half-star support (clipped gold overlay). */
function RatingStars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center text-[12px] leading-none text-brand-gold"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = rating >= i + 1 ? "100%" : rating >= i + 0.5 ? "50%" : "0%";
        return (
          <span key={i} className="relative inline-block">
            <span className="text-[#DACBBD] opacity-30">★</span>
            <span className="absolute inset-0 overflow-hidden" style={{ width: fill }}>
              ★
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function ThreadCard({
  thread,
  isAuthed = false,
}: {
  thread: CommunityThread;
  isAuthed?: boolean;
}) {
  const hasReply = Boolean(thread.reply.username || thread.reply.text);
  // Threads backed by a real review carry film context; show the live,
  // toggleable like counter. Static/demo threads keep the plain count.
  const isReview = Boolean(thread.filmId);

  const content = (
    <div className={`rounded-[5px] p-6 relative ${thread.bgGradient}`}>
      <div className="flex flex-col">
        {/* Original post: [avatar rail] [content]. The rail's line grows to fill
            the post's height, so it always reaches the reply avatar below —
            regardless of how long the review text is. */}
        <div className="flex gap-4">
          <div className="flex w-[40px] lg:w-[50px] shrink-0 flex-col items-center">
            <Image
              src={thread.avatarUrl}
              alt={thread.username}
              width={50}
              height={50}
              className="shrink-0 rounded-full object-cover size-[40px] lg:size-[50px]"
            />
            {hasReply && <div className="mt-1 w-px grow bg-[#DACBBD] opacity-35" />}
          </div>

          <div className={`min-w-0 flex-1 flex flex-col gap-1 ${hasReply ? "pb-8" : ""}`}>
            <span className="font-manrope font-normal text-[18px] leading-[1.333em] tracking-[0.06em] text-[#DCD8D3]">
              {thread.username}
            </span>
            {thread.filmTitle && (
              <span className="font-manrope font-normal text-[12px] leading-[1.5em] tracking-[0.06em] text-brand-gold underline underline-offset-2">
                on {thread.filmTitle}
              </span>
            )}
            <p className="mt-1 font-manrope font-normal text-[14px] leading-[1.714em] tracking-[0.06em] text-[#DCD8D3] whitespace-pre-line">
              {thread.text}
            </p>
            <div className="flex items-center gap-4 font-manrope font-medium text-[11px] leading-[1.636em] tracking-[0.06em] text-[#DACBBD]">
              {typeof thread.rating === "number" && thread.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <RatingStars rating={thread.rating} />
                  <span>{thread.rating.toFixed(1)}</span>
                </span>
              )}
              <span>{thread.replies} replies</span>
              {isReview ? (
                <LikeButton
                  liked={thread.likedByMe ?? false}
                  count={thread.likes}
                  isAuthed={isAuthed}
                  reviewId={thread.id}
                  filmId={thread.filmId ?? "-"}
                  slug={thread.slug ?? "-"}
                />
              ) : (
                <span>{thread.likes} likes</span>
              )}
            </div>
          </div>
        </div>

        {/* Reply: avatar shares the rail's column, so the connector above lands on
            its horizontal center. */}
        {hasReply && (
          <div className="flex gap-4">
            <div className="flex w-[40px] lg:w-[50px] shrink-0 flex-col items-center">
              <Image
                src={thread.reply.avatarUrl}
                alt={thread.reply.username}
                width={50}
                height={50}
                className="shrink-0 rounded-full object-cover size-[40px] lg:size-[50px]"
              />
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <span className="font-manrope font-normal text-[18px] leading-[1.333em] tracking-[0.06em] text-[#DCD8D3]">
                {thread.reply.username}
              </span>
              <span className="font-manrope font-normal text-[12px] leading-[1.5em] tracking-[0.06em] text-brand-gold underline underline-offset-2">
                → reply to {thread.reply.replyTo}
              </span>
              <p className="mt-1 font-manrope font-normal text-[14px] leading-[1.714em] tracking-[0.06em] text-[#DCD8D3] whitespace-pre-line">
                {thread.reply.text}
              </p>
              {(thread.reply.likes ?? 0) > 0 && (
                <div className="flex items-center gap-4 font-manrope font-medium text-[11px] leading-[1.636em] tracking-[0.06em] text-[#DACBBD]">
                  <span>{thread.reply.likes} likes</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {thread.replies > 0 && (
        <div className="mt-2.5">
          <span className="font-oswald font-light text-base leading-[2em] tracking-[0.06em] uppercase text-[#DACBBD] underline underline-offset-[3px] cursor-pointer inline">
            see more replies ({thread.replies})→
          </span>
        </div>
      )}
    </div>
  );

  // When the thread is backed by a real review, the whole card links to it.
  if (thread.href) {
    return (
      <Link
        href={thread.href}
        className={`block p-px rounded-[6px] transition-opacity hover:opacity-90 ${thread.borderGradient}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`p-px rounded-[6px] ${thread.borderGradient}`}>{content}</div>;
}
