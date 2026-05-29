import { featuredQuote, moreQuotes } from "@/data/quoteOfWeek";

// Linear fill (warm, brighter top-left) + Linear stroke (~26%) per Figma.
const CARD_BG =
  "linear-gradient(160deg, rgba(210,166,106,0.06) 0%, rgba(18,16,14,0) 45%), linear-gradient(180deg, #1E1813 0%, #15120F 85%)";
const BORDER_GRADIENT =
  "linear-gradient(180deg, rgba(220,216,211,0.26) 0%, rgba(210,166,106,0.12) 100%)";
const DIVIDER_BOTH_SIDES =
  "linear-gradient(90deg, rgba(155,143,132,0) 0%, #9B8F84 50%, rgba(155,143,132,0) 100%)";

export default function QuoteOfTheWeekSection() {
  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {/* Header */}
      <div className="section-container mb-8 lg:mb-12">
        <h2 className="font-manrope font-light text-brand-light opacity-90 text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] tracking-[0.06em]">
          Quote Of <span className="text-brand-gold">The Week</span>
        </h2>
      </div>

      {/* Card (gradient stroke via p-px wrapper) */}
      <div className="section-container">
        <div className="rounded-[6px] p-px" style={{ background: BORDER_GRADIENT }}>
          <div className="rounded-[5px] p-6 lg:p-10" style={{ background: CARD_BG }}>
            {/* Featured quote */}
            <div className="border-l-[6px] border-brand-gold pl-5 lg:pl-7">
              <p className="capitalize font-oswald font-normal text-brand-light/90 text-[24px] leading-[32px] lg:text-[32px] lg:leading-[42px] tracking-[0.06em]">
                &ldquo;{featuredQuote.text}&rdquo;
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="font-manrope text-brand-muted text-[14px]">
                — @{featuredQuote.author} on {featuredQuote.film}
              </span>
              <a
                href="#"
                className="font-oswald uppercase text-brand-gold text-[13px] tracking-[0.18em] underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                The Full Review →
              </a>
            </div>

            <div className="mt-8 h-px" style={{ background: DIVIDER_BOTH_SIDES }} />

            {/* More quotes */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[180px_1fr]">
              <h3 className="font-oswald font-light uppercase text-brand-gold text-[13px] tracking-[0.2em]">
                More Quotes
              </h3>
              <div className="flex flex-col">
                {moreQuotes.map((quote, i) => (
                  <div key={quote.id}>
                    {i > 0 && <div className="my-6 h-px bg-brand-muted/30" />}
                    <div className="border-l-[3px] border-brand-gold pl-5">
                      <p className="font-manrope font-extralight text-brand-light/90 text-[18px] leading-[28px] lg:text-[24px] lg:leading-[36px] tracking-[0.06em]">
                        &ldquo;{quote.text}&rdquo;
                      </p>
                    </div>
                    <p className="mt-3 font-manrope text-brand-muted text-[14px]">
                      — @{quote.author} on {quote.film}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* See all reviews */}
            <div className="mt-8 flex justify-end">
              <a
                href="#"
                className="font-manrope text-brand-gold text-[15px] hover:opacity-70 transition-opacity"
              >
                See All Reviews →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
