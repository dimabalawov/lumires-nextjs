import Image from "next/image";
import { HotTakeCardData } from "@/types/film";

interface HotTakeCardProps {
  take: HotTakeCardData;
  isCenter: boolean;
}

// A single "hot take": film still on top, headline, then author + date · replies.
// Side-card scaling/dimming is handled by HotTakesCarouselSection.
export default function HotTakeCard({ take, isCenter }: HotTakeCardProps) {
  return (
    <div
      className="flex w-full flex-col select-none rounded-[6px] border border-brand-gold/[0.18] px-6 pt-6 pb-8"
      style={{
        background:
          "linear-gradient(135deg, rgba(210,166,106,0.07) 0%, rgba(18,16,14,0) 60%), #12100E",
      }}
    >
      {/* Film still */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px]">
        <Image src={take.image} alt="" fill className="object-cover" sizes="562px" />
        {/* Dim the non-centered cards */}
        <div
          className="absolute inset-0 bg-brand-dark/40"
          style={{ opacity: isCenter ? 0 : 1, transition: "opacity 0.5s" }}
        />
      </div>

      {/* Headline — Oswald Regular 32/42, 6% (H5 WEB) */}
      <h3 className="mt-6 font-oswald font-normal text-brand-light tracking-[0.06em] text-[24px] leading-[32px] lg:text-[32px] lg:leading-[42px]">
        {take.title}
      </h3>

      {/* Author + meta */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        {/* by @author — Manrope Regular 18/24 (BODY1 WEB) */}
        <span className="font-manrope font-normal text-brand-gold text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px]">
          by @{take.author}
        </span>
        <div className="flex items-center gap-4">
          {/* date — Manrope Regular 11, 2.2px tracking */}
          <span className="font-manrope font-normal text-brand-muted text-[11px] leading-none tracking-[0.2em]">
            {take.date}
          </span>
          {/* replies — Manrope Regular 12, 0.72px tracking */}
          <span className="flex items-center gap-1.5 font-manrope font-normal text-brand-gold text-[12px] leading-none tracking-[0.06em]">
            <span className="text-[9px] leading-none">◆</span>
            {take.replies} replies
          </span>
        </div>
      </div>
    </div>
  );
}
