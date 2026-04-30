import Image from "next/image";
import Link from "next/link";
import { FilmCardData } from "@/types/film";
import { SIDE_W, SIDE_H, CENTER_W, CENTER_H, TRANSITION } from "@/constants/carousel";
import StarRating from "./StarRating";

interface FilmCardProps {
  film: FilmCardData;
  isCenter: boolean;
}

export default function FilmCard({ film, isCenter }: FilmCardProps) {
  return (
    <div
      className={`relative shrink-0 group overflow-hidden ${isCenter ? "cursor-default" : "cursor-pointer"}`}
      style={{
        width: CENTER_W,
        height: isCenter ? CENTER_H : SIDE_H,
        transition: TRANSITION,
      }}
    >
      {/* Image + gradient overlays */}
      <div className="absolute inset-0 z-0 border border-white/5 overflow-hidden">
        <Image
          src={film.image}
          alt={film.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={isCenter ? `${CENTER_W}px` : `${SIDE_W}px`}
        />
        <div
          className="absolute inset-0 bg-gradient-to-tl from-brand-dark via-brand-dark/40 to-transparent"
          style={{ opacity: isCenter ? 0.9 : 0, transition: "opacity 0.5s" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent"
          style={{ opacity: isCenter ? 0 : 0.9, transition: "opacity 0.5s" }}
        />
        <div
          className="absolute inset-0 bg-brand-dark/20"
          style={{ opacity: isCenter ? 0 : 1, transition: "opacity 0.5s" }}
        />
      </div>

      {/* Center (featured) overlay */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-end text-right w-full h-full pr-[59px] pt-[57px] pb-[37px] justify-between"
        style={{
          opacity: isCenter ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: isCenter ? "auto" : "none",
        }}
      >
        <div className="w-[318px] flex flex-col items-end">
          <h3 className="uppercase text-brand-gold font-oswald font-normal tracking-[0.06em] leading-[48px] text-[40px]">
            {film.title}
          </h3>
          <p className="text-brand-muted font-manrope text-[18px] italic leading-[24.6px] mt-4 mb-6">
            {film.quote}
          </p>
          <StarRating count={film.rating} />
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[14px] text-brand-muted font-manrope leading-[19px] mb-2">
            Review by {film.reviewer}
          </div>
          <Link
            href="#"
            className="uppercase text-brand-light font-oswald font-light text-[20px] leading-[48px] tracking-[0.06em] hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <span className="border-b border-brand-light/50 pb-[2px]">SEE ALL REVIEWS</span>
            <span className="text-xl leading-none -translate-y-px">→</span>
          </Link>
        </div>
      </div>

      {/* Side (small) overlay */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-end text-right justify-end w-full pr-[36px] pb-[24px]"
        style={{
          opacity: isCenter ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: isCenter ? "none" : "auto",
        }}
      >
        <div className="w-[198px] flex flex-col items-end">
          <h3 className="uppercase text-brand-gold font-oswald font-normal tracking-[0.06em] leading-[48px] text-[24px]">
            {film.title}
          </h3>
          <p className="text-brand-muted text-[11px] italic leading-[15px] font-manrope mt-2 mb-6">
            {film.quote}
          </p>
          <StarRating count={film.rating} />

          <div className="flex flex-col items-end mt-[69px]">
            <div className="text-[11px] leading-[15px] font-manrope text-brand-muted mb-1">
              Review by {film.reviewer}
            </div>
            <Link
              href="#"
              className="uppercase text-brand-light font-oswald font-light text-[15px] leading-[23px] tracking-[0.06em] hover:opacity-70 transition-opacity flex items-center gap-1.5"
            >
              <span className="border-b border-brand-light/50 pb-[2px]">SEE ALL REVIEWS</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
