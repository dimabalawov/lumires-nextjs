import Image from "next/image";
import { DirectorCardData } from "@/types/film";

// Linear gradient stroke (per Figma) — light, brighter at the top, warming gold
// at the bottom. Rendered as a 1px gradient frame via a p-px wrapper.
const BORDER_GRADIENT =
  "linear-gradient(180deg, rgba(220,216,211,0.35) 0%, rgba(220,216,211,0.06) 55%, rgba(210,166,106,0.16) 100%)";

// Portrait card: full-bleed director photo with mentions (top-right) and
// name + "currently discussed" film (bottom-left) over a dark scrim.
export default function DirectorCard({ director }: { director: DirectorCardData }) {
  return (
    <div className="rounded-[4px] p-px" style={{ background: BORDER_GRADIENT }}>
      <div className="relative aspect-[5/7] w-full overflow-hidden rounded-[3px]">
        <Image
          src={director.image}
          alt={director.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 90vw"
        />

        {/* Bottom-weighted scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Mentions */}
        <div className="absolute top-6 right-6 text-right">
          <div className="font-oswald font-light text-brand-gold text-[30px] lg:text-[34px] leading-none">
            {director.mentions}
          </div>
          <div className="mt-1 font-manrope text-[13px] lg:text-[14px] text-brand-light/70">
            mentions
          </div>
        </div>

        {/* Name + currently discussed */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="font-oswald font-normal text-brand-gold text-[30px] lg:text-[40px] leading-[1.05]">
            {director.name}
          </h3>
          <p className="mt-3 font-manrope text-[14px] leading-[1.5] text-brand-light/75">
            currently discussed:{" "}
            <span className="font-semibold text-brand-light underline underline-offset-2">
              {director.currentFilm}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
