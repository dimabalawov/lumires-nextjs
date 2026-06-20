import EditorialCollectionRow from "@/components/ui/EditorialCollectionRow";
import { editorialCollections, type EditorialCollection } from "@/data/editorialCollections";
import { AccentTitle } from "../ui/AccentTitle";
import { ShowAllLink } from "../ui/ShowAllLink";
import { getFilms } from "@/lib/api/films";
import { optionalData } from "@/lib/api/client";
import { tmdbImage } from "@/lib/images/tmdb";
import { FilmContentOrder } from "@/types/api";

// Themed rows, each backed by the live catalogue filtered to one genre and
// sorted by rating. (Genre is matched by name — the API expects the display name.)
const THEMES: { id: string; title: string; genre: string }[] = [
  { id: "horror", title: "Horror Worth Losing Sleep Over", genre: "Horror" },
  { id: "scifi", title: "Science Fiction & Beyond", genre: "Science Fiction" },
  { id: "drama", title: "Drama That Stays With You", genre: "Drama" },
];

const FILMS_PER_ROW = 5;

async function buildCollection(theme: (typeof THEMES)[number]): Promise<EditorialCollection | null> {
  // Over-fetch so we can drop poster-less entries and still fill the row.
  const data = await optionalData(
    getFilms({ genres: [theme.genre], sortBy: FilmContentOrder.HighestRated, pageSize: 18 }),
  );
  if (!data) return null;

  const films = data.results
    .filter((f) => f.posterPath)
    .slice(0, FILMS_PER_ROW)
    .map((f) => ({
      id: f.id,
      title: f.title,
      year: f.releaseYear,
      genre: theme.genre,
      rating: Number(f.voteAverage.toFixed(1)),
      poster: tmdbImage(f.posterPath, "w500") ?? "",
    }));

  if (films.length === 0) return null;
  return { id: theme.id, title: theme.title, films };
}

export default async function EditorialCollectionsSection() {
  const built = (await Promise.all(THEMES.map(buildCollection))).filter(
    (c): c is EditorialCollection => c !== null,
  );

  // If the catalogue is unreachable, fall back to the static demo collections.
  const collections = built.length > 0 ? built : editorialCollections;

  return (
    <section className="w-full bg-brand-dark pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="section-container">
        {/* Section heading */}
        <div className="mb-10 lg:mb-14 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end pb-4">
          <AccentTitle text="Editorial" accent="Collections" />
          <ShowAllLink href="#" className="hidden lg:flex uppercase text-brand-light
          hover:opacity-70 transition-opacity items-center gap-2 sm:mb-2 font-oswald
          font-light text-sm tracking-[0.06em]" withBorder={true} isCenter={true} />

        </div>

        {/* Collections stack */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {collections.map((collection) => (
            <EditorialCollectionRow key={collection.id} collection={collection} />
          ))}
        </div>

        <ShowAllLink href="#" className="lg:hidden flex justify-end mr-5 mt-5 lowercase
        text-brand-muted hover:opacity-70 transition-opacity items-center gap-2
         sm:mb-2 font-oswald font-light text-[20px] tracking-[0.06em]" withBorder={false} />
      </div>
    </section>
  );
}
