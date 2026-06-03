import "server-only";
import { apiRequest, nullOn404 } from "./client";
import type {
  CreateFilmsListCommand,
  CreateFilmsListResponse,
  FilmsListsByFilmResponse,
  ListDetail,
} from "@/types/api";

const DEFAULT_SLUG = "-";

/** GET /films/{slug}/{id}/lists — lists that feature a given film. */
export async function getFilmsListsByFilm(
  filmId: number,
  slug: string = DEFAULT_SLUG,
): Promise<FilmsListsByFilmResponse> {
  return apiRequest<FilmsListsByFilmResponse>(
    `/films/${encodeURIComponent(slug)}/${filmId}/lists`,
    { cache: { revalidate: 600 } },
  );
}

/** GET /lists/{id} — full list / collection detail. Returns null on 404. */
export async function getList(id: string): Promise<ListDetail | null> {
  return nullOn404(
    apiRequest<ListDetail>(`/lists/${encodeURIComponent(id)}`, {
      cache: { revalidate: 600 },
    }),
  );
}

/** POST /lists — create a new film list (auth required). */
export async function createFilmsList(
  command: CreateFilmsListCommand,
): Promise<CreateFilmsListResponse> {
  return apiRequest<CreateFilmsListResponse>("/lists", {
    method: "POST",
    body: command,
    auth: true,
  });
}
