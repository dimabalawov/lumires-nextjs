import Image from "next/image";
import { CommunityThread } from "@/types/film";

export default function ThreadCard({ thread }: { thread: CommunityThread }) {
  return (
    <div
      className={`p-px rounded-[6px] ${thread.borderGradient}`}
    >
      <div
        className={`rounded-[5px] p-6 relative ${thread.bgGradient}`}
      >
        {/* Vertical connector line */}
        <div className="absolute w-px bg-[#DACBBD] opacity-35 left-[41px] lg:left-[49px] top-[76px] lg:top-[88px] h-[110px] lg:h-[130px]" />

        <div className="flex flex-col gap-8">
          {/* Original post */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Image
                src={thread.avatarUrl}
                alt={thread.username}
                width={50}
                height={50}
                className="shrink-0 rounded-full object-cover size-[40px] lg:size-[50px]"
              />
              <div className="flex flex-col gap-1">
                <span className="font-manrope font-normal text-[18px] leading-[1.333em] tracking-[0.06em] text-[#DCD8D3]">
                  {thread.username}
                </span>
                {thread.filmTitle && (
                  <span className="font-manrope font-normal text-[12px] leading-[1.5em] tracking-[0.06em] text-brand-gold underline underline-offset-2">
                    on {thread.filmTitle}
                  </span>
                )}
              </div>
            </div>

            <div className="pl-[66px] flex flex-col gap-1">
              <p className="font-manrope font-normal text-[14px] leading-[1.714em] tracking-[0.06em] text-[#DCD8D3] whitespace-pre-line">
                {thread.text}
              </p>
              <span className="font-manrope font-medium text-[11px] leading-[1.636em] tracking-[0.06em] text-[#DACBBD]">
                {thread.replies} replies&nbsp;&nbsp;&nbsp;&nbsp;{thread.likes} likes
              </span>
            </div>
          </div>

          {/* Reply */}
          <div className="pl-[50px] flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Image
                src={thread.reply.avatarUrl}
                alt={thread.reply.username}
                width={50}
                height={50}
                className="shrink-0 rounded-full object-cover size-[40px] lg:size-[50px]"
              />
              <div className="flex flex-col gap-1">
                <span className="font-manrope font-normal text-[18px] leading-[1.333em] tracking-[0.06em] text-[#DCD8D3]">
                  {thread.reply.username}
                </span>
                <span className="font-manrope font-normal text-[12px] leading-[1.5em] tracking-[0.06em] text-brand-gold underline underline-offset-2">
                  → reply to {thread.reply.replyTo}
                </span>
              </div>
            </div>

            <div className="pl-[66px]">
              <p className="font-manrope font-normal text-[14px] leading-[1.714em] tracking-[0.06em] text-[#DCD8D3]">
                {thread.reply.text}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2.5">
          <span className="font-oswald font-light text-base leading-[2em] tracking-[0.06em] uppercase text-[#DACBBD] underline underline-offset-[3px] cursor-pointer inline">
            see more replies ({thread.replies})→
          </span>
        </div>
      </div>
    </div>
  );
}
