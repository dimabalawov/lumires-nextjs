import { AccentTitle } from "../ui/AccentTitle";

const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";

interface DirectorBiographySectionProps {
  name: string;
  bio: string;
  pullQuote?: string;
  topGenres?: string[];
}

export default function DirectorBiographySection({
  name,
  bio,
  pullQuote,
  topGenres,
}: DirectorBiographySectionProps) {
  return (
    <section className="section-container pt-8 lg:pt-12 pb-16 lg:pb-24">

      <AccentTitle text="Biography" className="mb-6 lg:mb-8" />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_320px]">
        {/* Bio card */}
        <div className="rounded-[6px] px-6 py-7 lg:px-10 lg:py-9" style={{ background: CARD_BG }}>
          {pullQuote && (
            <p className="font-oswald font-light uppercase text-brand-gold text-[16px] leading-[24px] tracking-[0.06em]">
              &ldquo;{pullQuote}&rdquo;
            </p>
          )}
          <p className="mt-6 font-manrope font-normal text-brand-light text-[16px] leading-[24px] tracking-[0.06em] whitespace-pre-line">
            {bio}
          </p>
          <p className="mt-6 text-right font-manrope text-brand-muted text-[16px] leading-[24px] tracking-[0.06em]">
            — {name}
          </p>
        </div>

        {/* Top genres */}
        {topGenres && topGenres.length > 0 && (
          <aside
            className="rounded-[6px] px-6 py-7 lg:px-7 lg:py-8 self-start"
            style={{ background: CARD_BG }}
          >
            <h3 className="font-oswald font-light uppercase text-brand-gold text-[16px] tracking-[0.24em]">
              Top Genres
            </h3>
            <p className="mt-5 font-manrope font-normal text-brand-light text-[16px] leading-[24px] tracking-[0.06em]">
              {topGenres.join(" · ")}
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
