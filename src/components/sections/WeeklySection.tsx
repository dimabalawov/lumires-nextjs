import FilmColumn from "@/components/ui/FilmColumn";
import SectionHeader from "@/components/ui/SectionHeader";
import { mostReviewedFilms, topRatedFilms } from "@/data/weeklyFilms";

export default function WeeklySection() {
  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      <SectionHeader title="This Week in Cinema" />

      <div
        className="section-container rounded-md flex flex-col lg:flex-row gap-6 lg:gap-[47px] px-5 py-6 lg:px-[49px] lg:pt-[30px] lg:pb-[44px]"
        style={{
          backgroundColor: "#12100E",
          backgroundImage:
            "linear-gradient(27deg, rgba(210, 166, 106, 0.17) 15%, rgba(18, 16, 14, 0) 99%)",
        }}
      >
        <FilmColumn title="Most Reviewed" films={mostReviewedFilms} align="left" />
        {/* Vertical divider — desktop only */}
        <div className="hidden lg:block w-px self-stretch bg-brand-gold/30 shrink-0" />
        {/* Horizontal divider — mobile only */}
        <div className="lg:hidden h-px w-full bg-brand-gold/30" />
        <FilmColumn title="Top Rated" films={topRatedFilms} align="right" />
      </div>
    </section>
  );
}
