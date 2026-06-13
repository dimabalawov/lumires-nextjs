"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api/auth.client";
import { PopularList, PopularListFilm } from "@/types/profile";

const MAX_COVERS = 5;
const MAX_LISTS = 2;

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M12 21.23l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.41L12 21.23z" />
        </svg>
    );
}

function PosterFan({ films }: { films: PopularListFilm[] }) {
    const covers = films.slice(0, MAX_COVERS);
    const n = covers.length;
    const width = n === 1 ? 100 : 60;
    const step = n > 1 ? (100 - width) / (n - 1) : 0;

    return (
        <div className="relative h-77.75 w-full overflow-hidden rounded-lg bg-black/40 ring-1 ring-brand-light/10">
            {covers.map((film, i) => (
                <div
                    key={i}
                    className="absolute top-0 h-full overflow-hidden shadow-[6px_0_16px_rgba(0,0,0,0.5)]"
                    style={{ left: `${i * step}%`, width: `${width}%`, zIndex: n - i }}
                >
                    {film.posterPath ? (
                        <Image
                            src={film.posterPath}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 511px, 86vw"
                            className="object-cover object-center"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-brand-light/10" />
                    )}
                </div>
            ))}
        </div>
    );
}

function ListLikeButton({ listId, initialLiked }: { listId: string; initialLiked: boolean }) {
    const [liked, setLiked] = useState(initialLiked);
    const busy = useRef(false);

    async function toggle() {
        if (busy.current) return;
        busy.current = true;
        const next = !liked;
        setLiked(next);
        try {
            // TODO: confirm the like route for lists in your API
            await apiRequest<void>(`/films-lists/${listId}/like`, {
                method: "POST",
                auth: true,
                cache: "no-store",
            });
        } catch {
            setLiked(!next);
            toast.error("Couldn't update like.");
        } finally {
            busy.current = false;
        }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={liked}
            className={[
                "mt-3 mx-auto inline-flex w-fit items-center gap-1.5 rounded-md border px-3 py-1 font-manrope text-[11px] uppercase tracking-[0.16em] transition-colors",
                liked
                    ? "border-brand-gold text-brand-gold"
                    : "border-brand-muted/50 text-brand-muted hover:border-brand-gold hover:text-brand-gold",
            ].join(" ")}
        >
            <HeartIcon filled={liked} />
            Like
        </button>
    );
}

function ListCard({ list }: { list: PopularList }) {
    return (
        <article className="flex w-full flex-col sm:w-85">
            <Link href={`/lists/${list.id}`} className="group block">
                <PosterFan films={list.films} />
                <h3 className="mt-4 line-clamp-1 text-center font-oswald font-light text-brand-gold text-[36px] leading-11.5
                    transition-opacity group-hover:opacity-80">
                    {list.title}
                </h3>
            </Link>
            <div className="mt-2 flex items-center justify-center gap-2 font-manrope text-[18px]">
                <span className="lowercase text-brand-light tracking-[0.08em]">{list.filmCount} films</span>
                <Link href={`/users/${list.username}`} className="text-brand-muted hover:opacity-80">
                    by @{list.username}
                </Link>
            </div>
            <ListLikeButton listId={list.id} initialLiked={list.isLiked} />
        </article>
    );
}

export default function PopularListsSection({ lists }: { lists: PopularList[] }) {
    if (!lists?.length) return null;
    const shown = lists.slice(0, MAX_LISTS);

    return (
        <section className="section-container">
            <div className="flex flex-wrap justify-center gap-8">
                {shown.map((list) => (
                    <ListCard key={list.id} list={list} />
                ))}
            </div>
        </section>
    );
}