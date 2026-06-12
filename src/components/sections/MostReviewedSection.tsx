
import MostReviewedCard from "@/components/ui/MostReviewedCard";
import { mostReviewedFilms as fallbackFilms, type MostReviewedFilm } from "@/data/mostReviewed";
import { getThisWeekMostReviewed } from "@/lib/api/films";
import { getReviewsByFilm } from "@/lib/api/reviews";
import { tmdbImage } from "@/lib/images/tmdb";
import type { WeeklyReviewedItem } from "@/types/api";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";

// 2 rows × 3 per row.
const ROWS = 2;
const PER_ROW = 3;
const LIMIT = ROWS * PER_ROW;

const FALLBACK_STILL = fallbackFilms[0].still;

/**
 * Build the deep-link to a film's featured review. The weekly endpoint now
 * returns the review's id directly (`item.id`); if it's ever missing, fall back
 * to resolving it from the film's reviews by reviewer (+ quote/rating).
 */
async function resolveReviewHref(item: WeeklyReviewedItem): Promise<string | undefined> {
  const slugQuery = item.slug ? `&slug=${encodeURIComponent(item.slug)}` : "";
  if (item.id) {
    return `/review/${encodeURIComponent(item.id)}?film=${item.filmId}${slugQuery}`;
  }
  try {
    const { results } = await getReviewsByFilm(item.filmId, { pageSize: 100 });
    const byReviewer = results.filter((r) => r.userId === item.reviewerId);
    const match =
      byReviewer.find(
        (r) =>
          (!item.quote || r.title === item.quote) &&
          (item.rating == null || r.rating === item.rating),
      ) ?? byReviewer[0];
    if (!match?.id) return undefined;
    return `/review/${encodeURIComponent(String(match.id))}?film=${item.filmId}${slugQuery}`;
  } catch {
    return undefined;
  }
}

/**
 * Pull this week's most-reviewed films and map them onto the card shape, capped
 * at LIMIT. Degrades to the static demo data on any error or empty response.
 */
async function getMostReviewed(): Promise<MostReviewedFilm[]> {
  try {
    const { items } = await getThisWeekMostReviewed();
    if (!items?.length) return fallbackFilms.slice(0, LIMIT);
    const top = items.slice(0, LIMIT);
    const hrefs = await Promise.all(top.map(resolveReviewHref));
    return top.map((item, i) => ({
      id: String(item.filmId),
      title: item.title,
      quote: item.quote ? `“${item.quote}”` : "",
      rating: Math.round(item.rating ?? 0),
      reviewer: item.reviewerName ? `@${item.reviewerName}` : "",
      still: tmdbImage(item.backdropPath, "w780") ?? FALLBACK_STILL,
      href: hrefs[i],
    }));
  } catch {
    return fallbackFilms.slice(0, LIMIT);
  }
}

export default async function MostReviewedSection() {
  const films = await getMostReviewed();

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        <div className="mb-10 lg:mb-14 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">

          <AccentTitle text="Most Reviewed" accent="This Week" />
          <ShowAllLink href="#" className="hidden lg:flex uppercase text-brand-light 
          hover:opacity-70 transition-opacity items-center gap-2 sm:mb-2 font-oswald 
          font-light text-sm tracking-[0.06em]"
            withBorder={true} isCenter={true}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {films.map((film) => (
            <MostReviewedCard key={film.id} film={film} />
          ))}
        </div>
        <ShowAllLink href="#" className="lg:hidden flex justify-end mr-5 mt-5 lowercase
        text-brand-muted" withBorder={false} />
      </div>
    </section>
  );
}
