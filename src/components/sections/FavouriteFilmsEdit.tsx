"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import type {
    FavouriteFilmCommand,
    FavouriteFilmItem,
    UserSettingsResponse,
} from "@/types/profile";
import type { ExternalFilmShort } from "@/types/search";
import { updateFavouriteFilms } from "@/lib/api/users.client";
import FilmSearchModal from "./FilmSearchModal";
import { genreNames } from "@/types/film";

const SLOTS = 4;

export default function FavoriteFilms({ initial }: { initial: UserSettingsResponse }) {
    const [films, setFilms] = useState<FavouriteFilmItem[]>(
        initial.favouriteFilms?.favouriteFilms ?? [],
    );
    const [editing, setEditing] = useState(false);
    const [picking, setPicking] = useState(false);
    const [saving, setSaving] = useState(false);

    // drag state
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    async function persist(next: FavouriteFilmItem[]) {
        setSaving(true);
        try {
            const payload: FavouriteFilmCommand[] = next.map((f, i) => ({
                externalId: f.id,
                order: i + 1,
            }));

            await updateFavouriteFilms({ favouriteFilms: payload }); 
            toast.success("Favorites saved");
        } catch {
            toast.error("Couldn't save favorites.");
        } finally {
            setSaving(false);
        }
    }


    function handleSelect(film: ExternalFilmShort) {
        setPicking(false);
        if (films.length >= SLOTS) return;
        if (films.some((f) => f.id === film.externalId)) {
            toast.error("Already in your favorites.");
            return;
        }
        const fav: FavouriteFilmItem = {
            id: film.externalId,
            title: film.title,
            posterPath: film.posterPath,
            releaseYear: film.releaseYear,
            genres: genreNames(film.genreIds),
            voteAverage: film.voteAverage,
            order: films.length + 1,
        };
        setFilms([...films, fav]); // только локально
    }

    function removeAt(index: number) {
        setFilms(films.filter((_, i) => i !== index)); // только локально
    }

    function reorder(from: number, to: number) {
        if (from === to) return;
        const next = [...films];
        if (to < next.length) {
            [next[from], next[to]] = [next[to], next[from]];
        } else {
            const [moved] = next.splice(from, 1);
            next.push(moved);
        }
        setFilms(next);
    }


    function handleDrop(targetIndex: number) {
        if (dragIndex !== null && dragIndex !== targetIndex) reorder(dragIndex, targetIndex);
        setDragIndex(null);
        setOverIndex(null);
    }

    const slots = Array.from({ length: SLOTS }, (_, i) => films[i] ?? null);

    const poster = (film: FavouriteFilmItem) => (
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-white/5">
            {film.posterPath && (
                <Image
                    src={film.posterPath}
                    alt=""
                    fill
                    unoptimized
                    draggable={false}
                    sizes="160px"
                    className="object-cover"
                />
            )}
        </div>
    );

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {slots.map((film, i) =>
                    film ? (
                        <div
                            key={film.id}
                            draggable={editing}
                            onDragStart={editing ? () => setDragIndex(i) : undefined}
                            onDragEnd={() => {
                                setDragIndex(null);
                                setOverIndex(null);
                            }}
                            onDragOver={
                                editing
                                    ? (e) => {
                                        e.preventDefault();
                                        setOverIndex(i);
                                    }
                                    : undefined
                            }
                            onDragLeave={editing ? () => setOverIndex((o) => (o === i ? null : o)) : undefined}
                            onDrop={editing ? () => handleDrop(i) : undefined}
                            className={[
                                "group relative rounded-sm transition",
                                editing ? "cursor-grab active:cursor-grabbing" : "",
                                dragIndex === i ? "opacity-40" : "",
                                overIndex === i && dragIndex !== i ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-dark" : "",
                            ].join(" ")}
                        >
                            <span className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark/80 font-oswald text-[12px] text-brand-gold ring-1 ring-brand-gold/40">
                                {i + 1}
                            </span>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => removeAt(i)}
                                    aria-label="Remove favorite"
                                    className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark/80 text-brand-danger ring-1 ring-brand-danger/40 hover:bg-brand-danger/20"
                                >
                                    ×
                                </button>
                            )}

                            {editing ? (
                                <div>{poster(film)}</div>
                            ) : (
                                <Link href={`/films/${film.id}`} className="block">
                                    {poster(film)}
                                </Link>
                            )}
                        </div>
                    ) : (
                        <button
                            key={`slot-${i}`}
                            type="button"
                            onClick={() => setPicking(true)}
                            onDragOver={
                                editing
                                    ? (e) => {
                                        e.preventDefault();
                                        setOverIndex(i);
                                    }
                                    : undefined
                            }
                            onDragLeave={editing ? () => setOverIndex((o) => (o === i ? null : o)) : undefined}
                            onDrop={editing ? () => handleDrop(i) : undefined}
                            className={[
                                "flex aspect-[2/3] flex-col items-center justify-center gap-1 rounded-sm border border-dashed text-brand-muted transition-colors hover:border-brand-gold/60 hover:text-brand-gold",
                                overIndex === i ? "border-brand-gold text-brand-gold" : "border-brand-gold/30",
                            ].join(" ")}
                        >
                            <span className="text-2xl leading-none">+</span>
                            <span className="font-manrope text-[11px] uppercase tracking-[0.18em]">Slot {i + 1}</span>
                        </button>
                    ),
                )}
            </div>

            <div className="mt-6 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setEditing((e) => !e)}
                    className="inline-flex items-center gap-2 rounded-md border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 font-manrope text-[12px] uppercase tracking-[0.14em] text-brand-gold transition-colors hover:border-brand-gold/60"
                >
                    {editing ? "Done editing" : "Edit favourites"}
                </button>

                <button
                    type="button"
                    onClick={() => persist(films)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-md border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 font-manrope text-[12px] uppercase tracking-[0.14em] text-brand-gold transition-colors hover:border-brand-gold/60 disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save favourites"}
                </button>
            </div>

            {picking && (
                <FilmSearchModal
                    onSelect={handleSelect}
                    onClose={() => setPicking(false)}
                    excludeIds={films.map((f) => f.id)}
                />
            )}
        </div>
    );
}