import FilmColumn from "@/components/ui/FilmColumn";
import SectionHeader from "@/components/ui/SectionHeader";
import { mostReviewedFilms, topRatedFilms } from "@/data/weeklyFilms";
import { AccentTitle } from "../ui/AccentTitle";

interface WeeklySectionProps {
  title?: string;
  titleAccent?: string;
}

export default function WeeklySection({
  title = "This Week in Cinema",
  titleAccent,
}: WeeklySectionProps = {}) {
  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 flex flex-col items-center bg-brand-dark">
      {titleAccent ? (
        <div className="section-container mb-8 lg:mb-12">
          <AccentTitle text={title} accent={titleAccent} />
        </div>
      ) : (
        <SectionHeader title={title} />
      )}

      <div
        className="section-container rounded-md flex flex-col lg:flex-row gap-6 lg:gap-11.75 px-5 py-6 lg:px-12.25 lg:pt-7.5 lg:pb-11"
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
