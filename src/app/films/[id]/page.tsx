import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Breadcrumb from "@/components/ui/Breadcrumb";
import FilmHero, { type FilmHeroData } from "@/components/sections/FilmHero";
import FilmReviewsSection from "@/components/sections/FilmReviewsSection";
import AppearsInListsSection from "@/components/sections/AppearsInListsSection";
import SimilarFilmsSection from "@/components/sections/SimilarFilmsSection";
import { allFilms } from "@/data/allFilms";
import { getMovie } from "@/lib/api/movies";
import { getSimilarFilms, getFilmSources } from "@/lib/api/films";
import { getFilmReviews } from "@/lib/api/reviews";
import { optionalData } from "@/lib/api/client";
import { fetchTopReply, mapReviewsToThreads } from "@/lib/reviews/community";
import { normalizeSources } from "@/lib/watch/sources";
import { createClient } from "@/lib/supabase/server";
import { tmdbImage } from "@/lib/images/tmdb";
import { filmExtras, genreShortName } from "@/data/filmExtras";
import { leftColumnThreads, rightColumnThreads } from "@/data/communityThreads";
import type { SimilarFilmItem } from "@/types/api";
import type { EditorialFilm } from "@/data/editorialCollections";
import type { CollectionData, CommunityThread } from "@/types/film";
import type { Review, ReviewComment } from "@/types/review";
import { getFilmsListsByFilm } from "@/lib/api/lists";

interface FilmPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reviewsPage?: string }>;
}

const REVIEWS_PAGE_SIZE = 6;

/** TMDB vote average is on a 0–10 scale; the UI shows a 0–5 star score. */
function toStarRating(voteAverage?: number): number | undefined {
  if (voteAverage == null || voteAverage <= 0) return undefined;
  const scaled = voteAverage > 5 ? voteAverage / 2 : voteAverage;
  return Math.round(scaled * 10) / 10;
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return { title: "Film not found" };

  return {
    title: movie.localization?.title ?? "Film",
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

const withAt = (name: string) => (name.startsWith("@") ? name : `@${name}`);

/**
 * Pick a review's most-liked reply that has visible text. Returns null when the
 * review has no usable reply. NOTE: the replies API currently omits the reply
 * `text` and misattributes the author (backend serializer bug), so this yields
 * null until that's fixed — the card then renders without a reply. Once the API
 * returns real reply bodies, the most-liked one shows automatically.
 */
async function fetchAppearsInLists(filmId: string): Promise<CollectionData[]> {
  const res = await optionalData(getFilmsListsByFilm(Number(filmId)));
  if (!res?.filmsLists) return [];
  console.log(res.filmsLists);

  return res.filmsLists.map(l => {
    const uniqueBackdrops = Array.from(
      new Set(l.films.map(f => f.backdropPath).filter((p): p is string => !!p))
    );

    return {
      id: l.id,
      title: l.name,
      films: l.films.map(f => f.backdropPath ?? "").filter(Boolean),
      backdrops: uniqueBackdrops.map(path => tmdbImage(path, "w780")!),
      filmCount: l.films.length,
      author: undefined,
      isLiked: l.isLikedByMe,
      isSaved: l.isSavedByMe,
    };
  });
}

async function fetchTopReply(
  filmId: string,
  reviewId: string,
  authed: boolean,
): Promise<ReviewComment | null> {
  const res = await optionalData(
    getReviewReplies(filmId, reviewId, { pageSize: 50, authed }),
  );
  const items = (res?.results ?? []).filter((c) => (c.text ?? "").trim() !== "");
  if (!items.length) return null;
  return items.reduce((best, c) => ((c.likesCount ?? 0) > (best.likesCount ?? 0) ? c : best));
}

function mapReviewsToThreads(
  reviews: Review[],
  filmId: string,
  topReplies: (ReviewComment | null)[],
): CommunityThread[] {
  return reviews.map((r, i) => {
    const top = topReplies[i];
    return {
      id: String(r.id),
      username: withAt(r.username),
      avatarUrl: r.avatarUrl || FALLBACK_AVATAR,
      href: `/review/${encodeURIComponent(r.id)}?film=${encodeURIComponent(filmId)}`,
      text: r.text,
      replies: r.repliesCount ?? 0,
      likes: r.likesCount ?? 0,
      rating: r.rating ?? undefined,
      filmId,
      slug: "-",
      likedByMe: r.isLikedByMe ?? false,
      reply: top
        ? {
          username: withAt(top.username),
          replyTo: withAt(r.username),
          avatarUrl: top.avatarUrl || FALLBACK_AVATAR,
          text: top.text ?? "",
          likes: top.likesCount ?? 0,
        }
        : { username: "", replyTo: withAt(r.username), avatarUrl: FALLBACK_AVATAR, text: "" },
      bgGradient: REVIEW_BG_VARIANTS[i % 2],
      borderGradient: REVIEW_BORDER_VARIANTS[i % 2],
    };
  });
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

export default async function FilmPage({ params, searchParams }: FilmPageProps) {
  const { id } = await params;
  const { reviewsPage } = await searchParams;
  const reviewsPageNum = Math.max(1, Number.parseInt(reviewsPage ?? "1", 10) || 1);

  // When logged in, fetch reviews per-user (Bearer + no-store) so each card's
  // `isLikedByMe` is accurate; otherwise the read stays cached/anonymous.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = !!user;

  const [movie, reviewsResponse, similarResponse, sourcesResponse, listsResponse] = await Promise.all([
    getMovie(id),
    optionalData(
      getFilmReviews(id, { page: reviewsPageNum, pageSize: REVIEWS_PAGE_SIZE, authed: isAuthed }),
    ),
    optionalData(getSimilarFilms(id)),
    optionalData(getFilmSources(id)),
    optionalData(fetchAppearsInLists(id)),
  ]);

  if (!movie) notFound();

  const watchSources = normalizeSources(sourcesResponse?.sources);

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
  // Fetch each review's most-liked reply (in parallel) so the card can preview it.
  const topReplies =
    apiReviews.length > 0
      ? await Promise.all(apiReviews.map((r) => fetchTopReply(id, r.id, isAuthed)))
      : [];
  const hasApiReviews = apiReviews.length > 0;
  const reviews = hasApiReviews
    ? mapReviewsToThreads(apiReviews, id, topReplies)
    : placeholderReviews;
  // Pagination only applies to real API data; placeholders are a single page.
  const reviewsTotalPages = hasApiReviews ? reviewsResponse?.totalPages ?? 1 : 1;
  const reviewsCurrentPage = hasApiReviews ? reviewsResponse?.page ?? reviewsPageNum : 1;

  const data: FilmHeroData = {
    title: movie.localization?.title ?? "Untitled",
    posterUrl: tmdbImage(movie.posterPath, "w500"),
    year: movie.releaseDate?.slice(0, 4),
    primaryGenre: genres[0],
    runtime: formatRuntime(movie.runtime),
    // Prefer the live TMDB vote average; fall back to the static extras rating.
    rating: toStarRating(movie.voteAverage) ?? extras.rating,
    voteCount: movie.voteCount,
    tagline: extras.tagline,
    overview: movie.localization?.overview,
    cast: movie.cast ?? [],
    genres,
    directors: movie.directors ?? [],
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

      <section className="section-container pt-28 lg:pt-32 pb-24 relative">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Films", href: "/films" },
            { label: movie.localization?.title ?? "Untitled" },
          ]}
        />
        <FilmHero data={data} filmId={id} slug="-" isAuthed={isAuthed} watchSources={watchSources} />
      </section>

      <FilmReviewsSection
        reviews={reviews}
        isAuthed={isAuthed}
        currentPage={reviewsCurrentPage}
        totalPages={reviewsTotalPages}
      />

      {listsResponse && listsResponse.length > 0 && (
        <AppearsInListsSection
          lists={listsResponse}
          showAllHref={`/films/${id}/lists`}
        />
      )}

      <SimilarFilmsSection films={similarFilms} />
    </main>
  );
}
