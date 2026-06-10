import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Pagination from "@/components/ui/Pagination";
import ListActions from "@/components/ui/ListActions";
import ListFilmPosterCard, { type ListFilmCardData } from "@/components/ui/ListFilmPosterCard";
import ListDetailSort, {
  LIST_DETAIL_SORTS,
  type ListDetailSortValue,
} from "@/components/ui/ListDetailSort";
import { getList } from "@/lib/api/lists";
import { tmdbImage } from "@/lib/images/tmdb";
import { createClient } from "@/lib/supabase/server";
import type { ListFilmItem } from "@/types/api";

const PAGE_SIZE = 20;

interface ListDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: ListDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const list = await getList(id);
  if (!list) return { title: "List · Lumires" };
  return {
    title: `${list.title} · Lists · Lumires`,
    description: list.description ?? undefined,
  };
}

function toCard(item: ListFilmItem): ListFilmCardData {
  return {
    id: item.filmId,
    title: item.title,
    poster: tmdbImage(item.posterPath, "w500") ?? "",
    year: item.releaseYear != null ? String(item.releaseYear) : "",
    genre: item.genre ?? "",
    // API voteAverage is 0–5; round to the nearest half-star for display.
    rating: item.voteAverage ? Math.round(item.voteAverage * 2) / 2 : 0,
  };
}

function sortFilms(films: ListFilmItem[], sort: ListDetailSortValue): ListFilmItem[] {
  const copy = [...films];
  switch (sort) {
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "rating":
      return copy.sort((a, b) => (b.voteAverage ?? 0) - (a.voteAverage ?? 0));
    case "recent":
      return copy.sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
    case "order":
    default:
      return copy.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}

export default async function ListDetailPage({ params, searchParams }: ListDetailPageProps) {
  const [{ id }, resolvedSearchParams, supabase] = await Promise.all([
    params,
    searchParams,
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = !!user;

  const list = await getList(id, isAuthed);
  if (!list) notFound();

  const read = (key: string) => {
    const v = resolvedSearchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const rawSort = read("sort") as ListDetailSortValue | undefined;
  const sort: ListDetailSortValue =
    rawSort && LIST_DETAIL_SORTS.some((o) => o.value === rawSort) ? rawSort : "order";
  const requestedPage = Math.max(1, Number(read("page")) || 1);

  const films = list.films ?? [];
  const filmCount = list.filmCount ?? films.length;
  const author = list.username ?? list.authorName;

  const sorted = sortFilms(films, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageFilms = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <section className="section-container pt-28 lg:pt-32 pb-16 lg:pb-24">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-oswald uppercase text-brand-muted text-xs tracking-[0.2em]">
          <Link href="/lists" className="hover:text-brand-light transition-colors">
            Lists
          </Link>
          <span aria-hidden>·</span>
          <span className="text-brand-gold">List</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="font-oswald font-light text-brand-gold text-[40px] leading-[1.05] lg:text-[56px]">
            {list.title}
          </h1>
          <span className="shrink-0 font-manrope font-light text-brand-muted text-[16px] lg:pt-3">
            {filmCount} {filmCount === 1 ? "film" : "films"}
          </span>
        </div>

        {author && (
          <p className="mt-3 font-manrope font-light text-brand-light text-[16px]">
            by <span className="text-brand-gold">@{author}</span>
          </p>
        )}

        {list.description && (
          <p className="mt-4 max-w-[640px] font-manrope font-light text-brand-muted text-[15px] leading-[1.6]">
            {list.description}
          </p>
        )}

        {/* Controls row */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <ListDetailSort value={sort} />
          <ListActions
            listId={list.id}
            initialLiked={list.isLikedByMe}
            isAuthed={isAuthed}
          />
        </div>

        {/* Film grid */}
        {pageFilms.length === 0 ? (
          <p className="py-20 text-center font-manrope font-light text-brand-muted">
            This list has no films yet.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {pageFilms.map((film) => (
              <Link
                key={`${film.filmId}-${film.order}`}
                href={`/films/${film.filmId}`}
                className="block transition-opacity hover:opacity-90"
              >
                <ListFilmPosterCard film={toCard(film)} />
              </Link>
            ))}
          </div>
        )}

        <Pagination page={currentPage} totalPages={totalPages} />
      </section>
    </main>
  );
}
