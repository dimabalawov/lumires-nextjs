import Image from "next/image";
import type { DirectorMostDiscussed } from "@/data/directors";
import type { EditorialReply } from "@/types/film";
import { AccentTitle } from "../ui/AccentTitle";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

function ReplyItem({ reply }: { reply: EditorialReply }) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <Image
          src={reply.avatarUrl}
          alt={reply.username}
          width={40}
          height={40}
          className="shrink-0 rounded-full object-cover size-[40px]"
        />
        <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="flex flex-col gap-1">
            <span className="font-manrope font-medium text-[14px] leading-[1.4] tracking-[0.06em] text-brand-light">
              {reply.username}
            </span>
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
          <span className="flex items-center gap-1.5">
            <span className="text-[12px] leading-none">♡</span>
            {reply.likes} likes
          </span>
          <span className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer">
            <span className="leading-none">💬</span>
            reply
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DirectorMostDiscussedSection({ thread }: { thread: DirectorMostDiscussed }) {
  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">

      <AccentTitle text="Most Discussed" accent="This Week" className="mb-6 lg:mb-8 uppercase" />

      <article
        className="rounded-[6px] px-6 py-7 lg:px-10 lg:py-9"
        style={{ background: CARD_BG }}
      >
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[260px_1fr]">

          {/* Poster + film meta */}
          {/* На мобилках выстраиваем в два столбца (140px картинка и 1fr под тексты), на lg возвращаем flex-col */}
          <div className="grid grid-cols-[250px_1fr] gap-x-5 gap-y-2 items-center lg:flex lg:flex-col lg:items-start">

            <div className="relative aspect-[2/3] w-full lg:max-w-none overflow-hidden rounded-[4px]">
              <Image
                src={thread.filmPoster}
                alt={thread.filmTitle}
                fill
                sizes="(min-width: 1024px) 260px, 250px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col text-center lg:text-left justify-between gap-15 lg:gap-0 lg:justify-normal">
              <h3 className="mt-0 lg:mt-5 font-oswald font-normal text-brand-gold text-4xl md:text-5xl lg:text-[24px] leading-10 lg:leading-8 tracking-[0.06em]">
                {thread.filmTitle}
              </h3>
              <p className="mt-2 font-manrope font-light uppercase text-brand-light text-lg md:text-xl lg:text-[12px] tracking-[0.2em]">
                — {thread.reviewsThisWeek} Reviews This Week
              </p>
            </div>

          </div>

          {/* Thread */}
          <div className="flex flex-col">
            {/* Author row */}
            <div className="flex items-center gap-4 flex-wrap">
              <Image
                src={thread.authorAvatar}
                alt={thread.author}
                width={40}
                height={40}
                className="shrink-0 rounded-full object-cover size-[40px]"
              />
              <span className="font-manrope font-medium text-brand-light text-[14px] tracking-[0.06em]">
                {thread.author}
              </span>
              <span className="font-manrope font-normal text-brand-muted text-[11px] tracking-[0.2em]">
                {thread.date}
              </span>
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
              <span className="flex items-center gap-1.5">
                <span className="text-[12px] leading-none">♡</span>
                {thread.likes} likes
              </span>
              <span className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer">
                <span className="leading-none">💬</span>
                reply
              </span>
              <span className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer">
                <span className="leading-none">⋯</span>
                share
              </span>
            </div>

            {/* Replies — indented with left guide */}
            {thread.topReplies.length > 0 && (
              <div className="mt-8 pl-2 lg:pl-4">
                <div className="flex flex-col gap-8 border-l border-brand-light/15 pl-6 lg:pl-8">
                  {thread.topReplies.map((reply) => (
                    <ReplyItem key={reply.id} reply={reply} />
                  ))}
                </div>
              </div>
            )}

            {/* Show all reviews */}
            <div className="mt-8 flex justify-end">
              <a
                href="#"
                className="font-oswald uppercase text-brand-gold text-[13px] tracking-[0.18em] underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Show All Reviews →
              </a>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
