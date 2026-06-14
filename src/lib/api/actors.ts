import "server-only";
import { apiRequest, nullOn404Or403 } from "./client";
import type {
  ActorApiResponse,
  ActorStatsResponse,
  DirectorMostReviewedResponse,
  FilmographyFilm,
  FilmographyResponse,
  SimilarActorPerson,
  SimilarActorsResponse,
} from "@/types/film";

/** GET /actors/{id} - actor biography & metadata. Returns null on 404. */
export async function getActor(id: string | number): Promise<ActorApiResponse | null> {
  return nullOn404Or403(
    apiRequest<ActorApiResponse>(
      `/actors/${encodeURIComponent(String(id))}`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /actors/{id}/filmography - films the actor appears in. Returns [] on 404. */
export async function getActorFilmography(
  id: string | number,
): Promise<FilmographyFilm[]> {
  const data = await nullOn404Or403(
    apiRequest<FilmographyResponse>(
      `/actors/${encodeURIComponent(String(id))}/filmography`,
      { cache: { revalidate: 3600 } },
    ),
  );
  return data?.films ?? [];
}

/** GET /actors/{id}/stats - headline counters (films, rating, awards). Null on 404. */
export async function getActorStats(
  id: string | number,
): Promise<ActorStatsResponse | null> {
  return nullOn404Or403(
    apiRequest<ActorStatsResponse>(
      `/actors/${encodeURIComponent(String(id))}/stats`,
      { cache: { revalidate: 3600 } },
    ),
  );
}

/** GET /actors/{id}/similar - actors with a similar style. Returns [] on 404. */
export async function getActorSimilar(
  id: string | number,
): Promise<SimilarActorPerson[]> {
  const data = await nullOn404Or403(
    apiRequest<SimilarActorsResponse>(
      `/actors/${encodeURIComponent(String(id))}/similar`,
      { cache: { revalidate: 3600 } },
    ),
  );
  return data?.similarActors ?? [];
}

/**
 * GET /actors/{id}/films/most-reviewed - the actor's most-reviewed film with its
 * top review and comments. Returns null on 404 or 204 (no reviews).
 */
export async function getActorMostReviewed(
  id: string | number,
): Promise<DirectorMostReviewedResponse | null> {
  const data = await nullOn404Or403(
    apiRequest<DirectorMostReviewedResponse | undefined>(
      `/actors/${encodeURIComponent(String(id))}/films/most-reviewed`,
      { cache: { revalidate: 300 } },
    ),
  );
  return data ?? null;
}
