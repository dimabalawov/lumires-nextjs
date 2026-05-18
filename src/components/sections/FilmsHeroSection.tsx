import Button from "@/components/ui/Button";
import { filmsHeroCopy, filmsHeroStats } from "@/data/filmsHero";

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FilmsHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 88% 50%, rgba(210,166,106,0.10), transparent 70%), radial-gradient(ellipse 60% 80% at 20% 100%, rgba(210,166,106,0.05), transparent 70%), #12100e",
      }}
    >
      <div className="section-container pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="grid gap-12 lg:gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* Left column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <span className="block h-px w-8 bg-brand-gold" />
              <span className="font-oswald uppercase text-brand-gold text-xs lg:text-sm tracking-[0.2em]">
                {filmsHeroCopy.eyebrow}
              </span>
            </div>

            <h1 className="font-oswald font-light text-brand-light text-[72px] leading-[1.02]">
              {filmsHeroCopy.titleLead}{" "}
              <span className="text-brand-gold">{filmsHeroCopy.titleAccent}</span>
            </h1>

            <p className="mt-6 lg:mt-8 font-manrope font-light text-auth-subtitle text-base lg:text-lg leading-relaxed max-w-[460px]">
              {filmsHeroCopy.description}
            </p>

            <div className="mt-8 lg:mt-10">
              <Button
                variant="goldFilled"
                rightIcon={<ChevronDown />}
                className="!font-manrope !font-normal !text-[24px] !tracking-normal h-auto py-3 px-6"
              >
                {filmsHeroCopy.ctaLabel}
              </Button>
            </div>
          </div>

          {/* Right column — stats */}
          <div className="flex flex-row lg:flex-col gap-10 lg:gap-12 lg:items-end lg:pr-2">
            {filmsHeroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col lg:items-end">
                <span className="font-oswald font-extralight text-brand-gold text-[56px] leading-none">
                  {stat.value}
                </span>
                <span className="font-oswald uppercase text-brand-muted text-xs lg:text-sm tracking-[0.18em] mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
