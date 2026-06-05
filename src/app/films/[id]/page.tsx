import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FilmHero, { type FilmHeroData } from "@/components/sections/FilmHero";
import FilmReviewsSection from "@/components/sections/FilmReviewsSection";
import AppearsInListsSection from "@/components/sections/AppearsInListsSection";
import SimilarFilmsSection from "@/components/sections/SimilarFilmsSection";
import { appearsInLists } from "@/data/appearsInLists";
import { allFilms } from "@/data/allFilms";
import { getMovie } from "@/lib/api/movies";
import { getSimilarFilms } from "@/lib/api/films";
import { getFilmReviews } from "@/lib/api/reviews";
import { tmdbImage } from "@/lib/images/tmdb";
import { filmExtras, genreShortName } from "@/data/filmExtras";
import { leftColumnThreads, rightColumnThreads } from "@/data/communityThreads";
import type { SimilarFilmItem } from "@/types/api";
import type { EditorialFilm } from "@/data/editorialCollections";
import type { CommunityThread } from "@/types/film";
import type { Review } from "@/types/review";

interface FilmPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return { title: "Film not found · Lumires" };

  return {
    title: `${movie.localization?.title ?? "Film"} · Lumires`,
    description: movie.localization?.overview,
  };
}

function formatRuntime(minutes: number): string | undefined {
  if (!minutes || minutes <= 0) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const REVIEW_BG_VARIANTS = [
  "[background:linear-gradient(41deg,rgba(210,166,106,0.08)_10%,rgba(18,16,14,0)_99%),#12100E]",
  "[background:linear-gradient(-44deg,rgba(210,166,106,0.08)_10%,rgba(18,16,14,0)_100%),#12100E]",
];
const REVIEW_BORDER_VARIANTS = [
  "[background:linear-gradient(225deg,rgba(210,166,106,0.44)_0%,rgba(18,16,14,0)_100%)]",
  "[background:linear-gradient(-44deg,rgba(18,16,14,0)_0%,rgba(210,166,106,0.44)_100%)]",
];
const FALLBACK_AVATAR = "/imgs/community/noirviewer.png";

function mapReviewsToThreads(reviews: Review[], filmId: string): CommunityThread[] {
  return reviews.map((r, i) => ({
    id: String(r.id),
    username: r.username.startsWith("@") ? r.username : `@${r.username}`,
    avatarUrl: r.avatarUrl || FALLBACK_AVATAR,
    href: `/review/${encodeURIComponent(r.id)}?film=${encodeURIComponent(filmId)}`,
    text: r.text,
    replies: r.repliesCount ?? 0,
    likes: r.likesCount ?? 0,
    reply: {
      username: "",
      replyTo: r.username,
      avatarUrl: FALLBACK_AVATAR,
      text: "",
    },
    bgGradient: REVIEW_BG_VARIANTS[i % 2],
    borderGradient: REVIEW_BORDER_VARIANTS[i % 2],
  }));
}

function genreName(genre: SimilarFilmItem["genres"][number] | undefined): string {
  if (!genre) return "";
  if (typeof genre === "string") return genre;
  return genre.name ?? "";
}

function mapSimilarToCards(items: SimilarFilmItem[]): EditorialFilm[] {
  return items.map((f) => ({
    id: String(f.externalId),
    title: f.title,
    poster: tmdbImage(f.posterPath, "w500") ?? "",
    year: f.releaseYear != null ? String(f.releaseYear) : "",
    // The API documents genres as string[] but actually returns {id, name}
    // objects; pull the name so we never render an object into the card.
    genre: genreName(f.genres?.[0]),
    // API rating is a 0–10 vote average; the card renders an out-of-5 score
    // (halves preserved, e.g. 8.6 → 4.5).
    rating: f.rating != null ? Math.round(f.rating) / 2 : 0,
  }));
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { id } = await params;
  const [movie, reviewsResponse, similarResponse] = await Promise.all([
    getMovie(id),
    getFilmReviews(id, { pageSize: 6 }).catch(() => null),
    getSimilarFilms(id).catch(() => null),
  ]);

  if (!movie) notFound();

  const apiSimilar = similarResponse?.films ?? [];
  const similarFilms =
    apiSimilar.length > 0 ? mapSimilarToCards(apiSimilar.slice(0, 12)) : allFilms.slice(0, 12);

  const extras = filmExtras[String(movie.id)] ?? {};
  const backdrop = tmdbImage(movie.backdropPath, "original");
  const genres = movie.genres?.items?.map((g) => genreShortName[g.name] ?? g.name) ?? [];

  const apiReviews = reviewsResponse?.results ?? [];
  const placeholderReviews: CommunityThread[] = [...leftColumnThreads, ...rightColumnThreads].map(
    ({ filmTitle: _unused, ...rest }) => rest,
  );
  const reviews = apiReviews.length > 0 ? mapReviewsToThreads(apiReviews, id) : placeholderReviews;

  const data: FilmHeroData = {
    title: movie.localization?.title ?? "Untitled",
    posterUrl: tmdbImage(movie.posterPath, "w500"),
    year: movie.releaseDate?.slice(0, 4),
    primaryGenre: genres[0],
    runtime: formatRuntime(movie.runtime),
    rating: extras.rating,
    tagline: extras.tagline,
    overview: movie.localization?.overview,
    cast: movie.cast?.map((c) => c.name) ?? [],
    genres,
    directors: movie.directors?.map((d) => d.name) ?? [],
    studio: movie.productionCompany,
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="absolute top-0 left-0 right-0 -z-10 bg-brand-dark overflow-hidden h-[760px] lg:h-[820px]">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center blur-[2px] scale-[1.02]"
          />
        )}
        <div className="absolute inset-0 bg-brand-dark/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/40 to-brand-dark" />
      </div>

      <Header />

      <section className="section-container pt-28 lg:pt-32 pb-24 relative">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Films", href: "/films" },
            { label: movie.localization?.title ?? "Untitled" },
          ]}
        />
        <FilmHero data={data} />
      </section>

      <FilmReviewsSection reviews={reviews} />

      <AppearsInListsSection lists={appearsInLists} />

      <SimilarFilmsSection films={similarFilms} />
    </main>
  );
}
