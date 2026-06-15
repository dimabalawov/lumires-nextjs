"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { searchArchive, type SearchFilter } from "@/lib/api/search.client";
import type {
    ExternalFilmShort,
    ExternalPersonShort,
    ListSearchResult,
    MemberResult,
    SearchResponse,
} from "@/types/search";
import { genreNames } from "@/types/film";

const FILTERS: { value: SearchFilter; label: string }[] = [
    { value: "All", label: "All" },
    { value: "Films", label: "Films" },
    { value: "Directors", label: "Directors" },
    { value: "Actors", label: "Actors" },
    { value: "Lists", label: "Lists" },
    { value: "Members", label: "Members" },
];

const show = (filter: SearchFilter, section: SearchFilter) =>
    filter === "All" || filter === section;

const sectionLabel =
    "text-brand-gold font-oswald text-[12px] font-medium uppercase leading-[8px] tracking-[3.6px] ";

function rating(v: number) {
    return v > 0 ? `${Number.isInteger(v) ? v : v.toFixed(1)}★` : null;
}

export default function SearchOverlay({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [filter, setFilter] = useState<SearchFilter>("All");
    const [filterOpen, setFilterOpen] = useState(false);
    const [term, setTerm] = useState("");
    const [data, setData] = useState<SearchResponse>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            setTerm("");
            setData({});
            setFilterOpen(false);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const q = term.trim();
        if (!q) {
            setData({});
            setLoading(false);
            return;
        }
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                setData(await searchArchive(filter, q));
            } catch {
                setData({});
            } finally {
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(t);
    }, [term, filter, open]);

    if (!open) return null;

    const hasAny =
        (data.films?.length ?? 0) +
        (data.directors?.length ?? 0) +
        (data.actors?.length ?? 0) +
        (data.lists?.length ?? 0) +
        (data.members?.length ?? 0) >
        0;

    return (
        <div
            className="fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-black/75 p-4 pt-20"
            onClick={onClose}
        >
            <div
                className="h-fit w-full max-w-2xl rounded-lg border border-brand-gold/20 bg-[#15120F] p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className={`${sectionLabel} mb-3.5`}>Search the archive</p>

                {/* filter dropdown + input */}
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setFilterOpen((o) => !o)}
                            className="flex min-w-[120px] items-center justify-between gap-3 rounded-md border border-brand-gold/40 bg-[#171411] px-3 py-2.5 font-manrope text-[12px] uppercase tracking-[0.18em] text-brand-gold"
                        >
                            {FILTERS.find((f) => f.value === filter)?.label}
                            <span className="text-brand-muted">▾</span>
                        </button>
                        {filterOpen && (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-10 w-full overflow-hidden rounded-md border border-brand-gold/30 bg-[#171411] py-1 shadow-xl">
                                {FILTERS.map((f) => (
                                    <button
                                        key={f.value}
                                        type="button"
                                        onClick={() => {
                                            setFilter(f.value);
                                            setFilterOpen(false);
                                        }}
                                        className={`block w-full px-3 py-2 text-left font-manrope text-[12px] uppercase tracking-[0.1em] ${f.value === filter
                                            ? "bg-brand-gold text-brand-dark"
                                            : "text-brand-light/80 hover:bg-brand-gold/10 hover:text-brand-gold"
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            autoFocus
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Search…"
                            className="w-full rounded-md border border-brand-gold/20 bg-[#171411] px-9 py-2.5 font-manrope text-[15px] text-brand-light placeholder:text-brand-muted/50 focus:border-brand-gold/50 focus:outline-none"
                        />
                        {term && (
                            <button
                                type="button"
                                onClick={() => setTerm("")}
                                aria-label="Clear"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-light"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* results */}
                <div className="mt-5 space-y-7">
                    {loading && (
                        <p className="py-6 text-center font-manrope text-sm text-brand-muted">Searching…</p>
                    )}
                    {!loading && term.trim() && !hasAny && (
                        <p className="py-6 text-center font-manrope text-sm text-brand-muted">
                            Nothing found.
                        </p>
                    )}

                    {show(filter, "Films") && !!data.films?.length && (
                        <FilmsSection films={data.films} onNavigate={onClose} />
                    )}
                    {show(filter, "Directors") && !!data.directors?.length && (
                        <PeopleSection title="Directors" role="Director" people={data.directors} onNavigate={onClose} />
                    )}
                    {show(filter, "Actors") && !!data.actors?.length && (
                        <PeopleSection title="Actors" role="Actor" people={data.actors} onNavigate={onClose} />
                    )}
                    {show(filter, "Lists") && !!data.lists?.length && (
                        <ListsSection lists={data.lists} onNavigate={onClose} />
                    )}
                    {show(filter, "Members") && !!data.members?.length && (
                        <MembersSection members={data.members} onNavigate={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
}

function FilmsSection({ films, onNavigate }: { films: ExternalFilmShort[]; onNavigate: () => void }) {
    return (
        <section>
            <p className={sectionLabel}>Films</p>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {films.map((f) => (
                    <Link
                        key={f.externalId}
                        href={`/films/${f.externalId}`}
                        onClick={onNavigate}
                        className="group block"
                    >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-white/5">
                            {f.posterPath && (
                                <Image src={f.posterPath} alt="" fill unoptimized sizes="120px" className="object-cover" />
                            )}
                            {rating(f.voteAverage) && (
                                <span className="absolute right-1 top-1 rounded bg-black/60 px-1 py-0.5 font-manrope text-[10px] text-brand-gold">
                                    {rating(f.voteAverage)}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 truncate font-manrope text-[13px] text-brand-light">{f.title}</p>
                        <p className="font-manrope text-[11px] text-brand-muted">
                            {[f.releaseYear, genreNames(f.genreIds)[0]].filter(Boolean).join(" · ")}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function PeopleSection({
    title,
    role,
    people,
    onNavigate,
}: {
    title: string;
    role: string;
    people: ExternalPersonShort[];
    onNavigate: () => void;
}) {
    return (
        <section>
            <p className={sectionLabel}>{title}</p>
            <div className="mt-3 flex flex-col">
                {people.map((p) => {
                    const known = (p.knownFor ?? [])
                        .map((f) => f.title)
                        .filter(Boolean)
                        .slice(0, 3)
                        .join(", ");

                    return (
                        <Link
                            key={p.externalId}
                            href={`/people/${p.externalId}`} // TODO: confirm route
                            onClick={onNavigate}
                            className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-brand-gold/5"
                        >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                                {p.profilePath && (
                                    <Image src={p.profilePath} alt="" fill unoptimized sizes="40px" className="object-cover" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-manrope text-[14px] text-brand-light">{p.name}</p>
                                <p className="truncate font-manrope text-[11px] text-brand-muted">
                                    <span className="mr-2 uppercase tracking-[0.16em] text-brand-gold/70">{role}</span>
                                    {known}
                                </p>
                            </div>
                            <span className="text-brand-muted">→</span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

function ListsSection({ lists, onNavigate }: { lists: ListSearchResult[]; onNavigate: () => void }) {
    return (
        <section>
            <p className={sectionLabel}>Lists</p>
            <div className="mt-3 flex flex-col">
                {lists.map((l) => (
                    <Link
                        key={l.id}
                        href={`/lists/${l.id}`}
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-brand-gold/5"
                    >
                        <div className="flex shrink-0">
                            {l.films.slice(0, 3).map((film, i) => (
                                <div
                                    key={i}
                                    className="relative h-12 w-9 overflow-hidden rounded-sm bg-white/10 ring-1 ring-brand-dark"
                                    style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }}
                                >
                                    {film.posterPath && (
                                        <Image src={film.posterPath} alt="" fill unoptimized sizes="36px" className="object-cover" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-manrope text-[14px] text-brand-light">{l.title}</p>
                            <p className="font-manrope text-[11px] text-brand-muted">List by @{l.username}</p>
                        </div>
                        <span className="shrink-0 font-manrope text-[11px] uppercase tracking-[0.12em] text-brand-muted">
                            {l.filmCount} films · {l.likeCount} ♥
                        </span>
                        <span className="text-brand-muted">→</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function MembersSection({ members, onNavigate }: { members: MemberResult[]; onNavigate: () => void }) {
    return (
        <section>
            <p className={sectionLabel}>Members</p>
            <div className="mt-3 flex flex-col">
                {members.map((m) => (
                    <Link
                        key={m.id}
                        href={`/users/${m.username}`}
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-brand-gold/5"
                    >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                            {m.avatarUrl && (
                                <Image src={m.avatarUrl} alt="" fill unoptimized sizes="40px" className="object-cover" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-manrope text-[14px] text-brand-light">@{m.username}</p>
                            <p className="font-manrope text-[11px] text-brand-muted">
                                <span className="mr-2 uppercase tracking-[0.16em] text-brand-gold/70">Member</span>
                                {m.followersCount} followers
                            </p>
                        </div>
                        <span className="text-brand-muted">→</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}