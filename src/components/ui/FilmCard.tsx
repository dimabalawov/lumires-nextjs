import Image from "next/image";
import Link from "next/link";
import { FilmCardData } from "@/types/film";
import { SIDE_H, CENTER_W, CENTER_H, TRANSITION } from "@/constants/carousel";
import StarRating from "./StarRating";

interface FilmCardProps {
  film: FilmCardData;
  isCenter: boolean;
}

/**
 * Title font scales down as the title grows so any film — short ("Finding Nemo")
 * or long ("The Lord of the Rings: The Return of the King") — fits the card
 * without overflowing or leaving the block lopsided.
 */
function titleSize(len: number, isCenter: boolean): number {
  if (isCenter) {
    if (len <= 16) return 40;
    if (len <= 30) return 36;
    return 30;
  }
  if (len <= 16) return 24;
  if (len <= 30) return 21;
  return 18;
}

/** Right-aligned text block shared by the featured and side states. */
function CardContent({ film, isCenter }: FilmCardProps) {
  const meta = film.reviewer ? `Review by ${film.reviewer}` : film.year;

  const title = (
    <h3
      className="uppercase select-none text-brand-gold font-oswald font-normal tracking-[0.06em] text-balance wrap-break-word"
      style={{
        fontSize: titleSize(film.title.length, isCenter),
        lineHeight: 1.15,
        textShadow: "0 2px 14px rgba(0,0,0,0.75)",
      }}
    >
      {film.title}
    </h3>
  );

  const quote = film.quote ? (
    <p
      className={`text-brand-light/85 font-manrope italic select-none ${
        isCenter ? "text-[18px] leading-[24.6px] mt-4 mb-6" : "text-[11px] leading-3.75 mt-2 mb-6"
      }`}
      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
    >
      {film.quote}
    </p>
  ) : null;

  const rating =
    film.rating != null ? (
      <StarRating
        count={film.rating}
        max={5}
        className={`text-brand-gold select-none drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] ${
          isCenter ? "text-[18px]" : "text-[13px]"
        }`}
      />
    ) : null;

  const footer = (
    <div className="flex flex-col items-end">
      {meta ? (
        <div
          className={`font-manrope select-none text-brand-muted ${
            isCenter ? "text-[14px] leading-4.75 mb-2" : "text-[11px] leading-3.75 mb-1"
          }`}
        >
          {meta}
        </div>
      ) : null}
      <Link
        href={`/films/${film.id}`}
        className={`uppercase select-none text-brand-light font-oswald font-light tracking-[0.06em] hover:opacity-70 transition-opacity flex items-center ${
          isCenter ? "text-[20px] leading-12 gap-2" : "text-[15px] leading-5.75 gap-1.5"
        }`}
      >
        <span className="border-b border-brand-light/50 pb-0.5">SEE ALL REVIEWS</span>
        <span className={isCenter ? "text-xl leading-none -translate-y-px" : ""}>→</span>
      </Link>
    </div>
  );

  // Featured: title block pinned top, footer pinned bottom.
  if (isCenter) {
    return (
      <div className="flex h-full w-full flex-col items-end justify-between text-right pr-14.75 pt-14.25 pb-9.25">
        <div className="flex flex-col items-end max-w-[62%]">
          {title}
          {quote}
          {rating}
        </div>
        {footer}
      </div>
    );
  }

  // Side: everything bottom-aligned.
  return (
    <div className="flex h-full w-full flex-col items-end justify-end text-right pr-9 pb-6">
      <div className="flex flex-col items-end max-w-[60%]">
        {title}
        {quote}
        {rating}
        <div className="mt-10">{footer}</div>
      </div>
    </div>
  );
}

export default function FilmCard({ film, isCenter }: FilmCardProps) {
  return (
    <div
      className="relative shrink-0 group overflow-hidden cursor-pointer"
      style={{
        width: CENTER_W,
        height: isCenter ? CENTER_H : SIDE_H,
        transition: TRANSITION,
      }}
    >
      {/* Image + gradient overlays */}
      <div className="absolute inset-0 z-0 border border-white/5 overflow-hidden">
        {film.image ? (
          <Image
            src={film.image}
            alt={film.title}
            fill
            className="select-none object-cover transition-transform duration-500 group-hover:scale-105"
            // Card width is always CENTER_W (only height changes between
            // states), so keep `sizes` constant — otherwise toggling it swaps
            // the srcSet candidate mid-transition and the image re-decode
            // flashes ("twitches") the slide.
            sizes={`${CENTER_W}px`}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-brand-dark to-[#1d1a17]" />
        )}
        {/* Always-on scrims — constant across center/side so they never
            crossfade (crossfading dark layers caused a brightness "twitch"
            mid-transition). They give the right-aligned title/quote and the
            bottom footer a consistent dark backdrop in both states. */}
        <div className="absolute inset-0 bg-linear-to-l from-brand-dark via-brand-dark/45 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark/70 via-brand-dark/15 to-transparent" />
        {/* Side-only uniform dim veil — a single layer fading 0→1, so the
            overall darkness changes monotonically (no flicker). */}
        <div
          className="absolute inset-0 bg-brand-dark/35"
          style={{ opacity: isCenter ? 0 : 1, transition: "opacity 0.5s" }}
        />
      </div>

      {/* Featured (center) overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: isCenter ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: isCenter ? "auto" : "none",
        }}
      >
        <CardContent film={film} isCenter />
      </div>

      {/* Side (small) overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: isCenter ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: isCenter ? "none" : "auto",
        }}
      >
        <CardContent film={film} isCenter={false} />
      </div>
    </div>
  );
}
