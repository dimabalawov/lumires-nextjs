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
import { films as similarFilms } from "@/data/films";
import { getMovie } from "@/lib/api/movies";
import { getFilmReviews } from "@/lib/api/reviews";
import { tmdbImage } from "@/lib/images/tmdb";
import { filmExtras, genreShortName } from "@/data/filmExtras";
import { leftColumnThreads, rightColumnThreads } from "@/data/communityThreads";
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
    title: `${movie.localization.title} · Lumires`,
    description: movie.localization.overview,
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

function mapReviewsToThreads(reviews: Review[]): CommunityThread[] {
  return reviews.map((r, i) => ({
    id: String(r.id),
    username: r.username,
    avatarUrl: r.avatarUrl || FALLBACK_AVATAR,
    text: r.text,
    replies: r.replies,
    likes: r.likes,
    reply: r.topReply
      ? {
          username: r.topReply.username,
          replyTo: r.username,
          avatarUrl: r.topReply.avatarUrl || FALLBACK_AVATAR,
          text: r.topReply.text,
        }
      : {
          username: "",
          replyTo: r.username,
          avatarUrl: FALLBACK_AVATAR,
          text: "",
        },
    bgGradient: REVIEW_BG_VARIANTS[i % 2],
    borderGradient: REVIEW_BORDER_VARIANTS[i % 2],
  }));
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { id } = await params;
  const [movie, reviewsResponse] = await Promise.all([
    getMovie(id),
    getFilmReviews(id, { pageSize: 6 }).catch(() => null),
  ]);

  if (!movie) notFound();

  const extras = filmExtras[String(movie.id)] ?? {};
  const backdrop = tmdbImage(movie.backdropPath, "original");
  const genres = movie.genres.items.map((g) => genreShortName[g.name] ?? g.name);

  const apiReviews = reviewsResponse?.results ?? [];
  const placeholderReviews: CommunityThread[] = [...leftColumnThreads, ...rightColumnThreads].map(
    ({ filmTitle: _unused, ...rest }) => rest,
  );
  const reviews = apiReviews.length > 0 ? mapReviewsToThreads(apiReviews) : placeholderReviews;

  const data: FilmHeroData = {
    title: movie.localization.title,
    posterUrl: tmdbImage(movie.posterPath, "w500"),
    year: movie.releaseDate?.slice(0, 4),
    primaryGenre: genres[0],
    runtime: formatRuntime(movie.runtime),
    rating: extras.rating,
    tagline: extras.tagline,
    overview: movie.localization.overview,
    cast: movie.cast,
    genres,
    directors: movie.directors,
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
            { label: movie.localization.title },
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
