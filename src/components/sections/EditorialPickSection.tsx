import Image from "next/image";

import Button from "@/components/ui/Button";
import GradientDivider from "@/components/ui/GradientDivider";
import { editorialPick } from "@/data/editorialPick";
import type { EditorialReply } from "@/types/film";

function ReplyItem({ reply }: { reply: EditorialReply }) {
  return (
    <div>
      {/* Header: avatar + handle + reply-to, with date on the right */}
      <div className="flex items-start gap-4">
        <Image
          src={reply.avatarUrl}
          alt={reply.username}
          width={40}
          height={40}
          className="shrink-0 rounded-full object-cover size-[40px]"
        />
        <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="font-manrope font-medium text-[14px] leading-[1.4] tracking-[0.06em] text-[#DCD8D3]">
              {reply.username}
            </span>
            <span className="font-manrope font-normal text-[12px] leading-[1.5] tracking-[0.06em] text-brand-gold underline underline-offset-2">
              ↩ reply to {reply.replyTo}
            </span>
          </div>
          <span className="font-manrope font-normal text-[11px] leading-none tracking-[0.2em] text-brand-muted">
            {reply.date}
          </span>
        </div>
      </div>

      {/* Body + footer, indented under the handle */}
      <div className="mt-2 pl-[56px]">
        <p className="font-manrope font-normal text-[14px] leading-[1.7] tracking-[0.02em] text-[#cfc8c0]">
          {reply.text}
        </p>
        <div className="mt-3 flex items-center gap-6 font-manrope text-[11px] uppercase tracking-[0.12em] text-brand-muted">
          <span className="flex items-center gap-1.5">
            <span className="text-[12px] leading-none">♡</span>
            {reply.likes} likes
          </span>
          <span className="flex items-center gap-1.5 hover:text-brand-light transition-colors cursor-pointer">
            <span className="leading-none">↩</span>
            reply
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EditorialPickSection() {
  const pick = editorialPick;

  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header — matches the manrope-light section heading used on this page */}
      <div className="section-container mb-8 lg:mb-12">
        <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Editorial Pick <span className="text-brand-gold">This Week</span>
        </h2>
      </div>

      {/* Featured card */}
      <div className="section-container">
        <article
          className="rounded-[6px] border border-brand-gold/[0.18] p-5 lg:p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(210,166,106,0.07) 0%, rgba(18,16,14,0) 60%), #12100E",
          }}
        >
          {/* Hero still */}
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[4px]">
            <Image
              src={pick.image}
              alt={pick.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1140px, 100vw"
            />
          </div>

          {/* Title — Oswald, H4-scale */}
          <h3 className="mt-6 font-oswald font-normal text-brand-light tracking-[0.06em] text-[24px] leading-[32px] lg:text-[36px] lg:leading-[44px]">
            {pick.title}
          </h3>

          {/* Body */}
          <p className="mt-4 font-manrope font-normal text-[14px] lg:text-[15px] leading-[1.8] tracking-[0.02em] text-[#cfc8c0]">
            {pick.body}
          </p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <span className="font-manrope font-normal text-brand-gold text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px]">
              by @{pick.author}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-manrope font-normal text-brand-muted text-[11px] leading-none tracking-[0.2em]">
                {pick.date}
              </span>
              <span className="flex items-center gap-1.5 font-manrope font-normal text-brand-gold text-[12px] leading-none tracking-[0.06em]">
                <span className="text-[9px] leading-none">◆</span>
                {pick.replies} replies
              </span>
              <span className="font-manrope font-normal text-brand-muted text-[12px] leading-none tracking-[0.06em]">
                · {pick.views} views
              </span>
            </div>
          </div>

          <GradientDivider className="mt-6" />

          {/* Top replies */}
          <div className="mt-6">
            {/* H6 WEB — Manrope Extralight 28/36 */}
            <h4 className="font-manrope font-extralight text-brand-light text-[28px] leading-[36px] tracking-[0.06em]">
              Top Replies
            </h4>
            {/* Indented list with a vertical divider down the left gutter */}
            <div className="mt-6 pl-[52px] lg:pl-[60px]">
              <div className="flex flex-col gap-10 border-l border-[#DACBBD]/25 pl-6 lg:pl-8">
                {pick.topReplies.map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="goldOutlined"
            className="mt-8 w-full justify-center"
          >
            Join the conversation now!
          </Button>
        </article>
      </div>
    </section>
  );
}
