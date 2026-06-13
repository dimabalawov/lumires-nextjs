"use client";

import { UserFavouriteFilm } from "@/types/film";
import Link from "next/link";
import EditorialPosterCard from "@/components/ui/EditorialPosterCard";
import { useProfileContext } from "../context/ProfileContext";

const MAX_FAVOURITES = 4;

export function FavouriteFilms({
    films
}: {
    films: UserFavouriteFilm[];
}) {
    const { profile } = useProfileContext();
    const canEdit = profile.isMe ?? false;
    const shown = films.slice(0, MAX_FAVOURITES);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-[50.5px]">
            {shown.map((film) => (
                <Link
                    key={film.id}
                    href={`/films/${film.id}`}
                    className="block transition-opacity hover:opacity-95"
                >
                    <EditorialPosterCard
                        film={{
                            id: film.id,
                            title: film.title,
                            year: film.releaseYear,
                            genre: film.genres[0],
                            rating: film.voteAverage,
                            poster: film.posterPath ?? "",
                        }}
                    />
                </Link>
            ))}

            {canEdit && shown.length < MAX_FAVOURITES && (
                <button
                    type="button"
                    className="group flex aspect-167/250 w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-brand-light/25 text-brand-light/45 transition-colors hover:border-brand-gold/60 hover:text-brand-gold"
                >
                    <span className="text-3xl font-light leading-none">+</span>
                    <span className="font-manrope text-[11px] uppercase tracking-[0.18em]">Add a favorite</span>
                </button>
            )}
        </div>
    );
}