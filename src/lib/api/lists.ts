import "server-only";
import { apiRequest, nullOn404 } from "./client";
import type { LikeToggleResponse } from "@/types/review";
import type {
  BrowseListsResponse,
  CreateFilmsListCommand,
  CreateFilmsListResponse,
  EditorialListsResponse,
  FilmsListsByFilmResponse,
  ListCategoryFilter,
  ListDetail,
  ListsSummary,
  ListSortOrder,
  TrendingListsResponse,
} from "@/types/api";

export interface GetListsParams {
  category?: ListCategoryFilter;
  sortBy?: ListSortOrder;
  /** Restrict to lists that contain this film. */
  filmId?: number;
  page?: number;
  pageSize?: number;
  /** Fetch per-user (Bearer + no-store) so each item's like/save state is accurate. */
  authed?: boolean;
}

/**
 * GET /lists — sorted, filtered, paginated browse feed. The 200 body is
 * undocumented; we type it as BrowseListsResponse (best-guess) and callers
 * parse defensively. Pass `authed` so `isLikedByMe`/`isSavedByMe` are per-user.
 */
export async function getLists({
  category = "all",
  sortBy = "mostRecent",
  filmId,
  page = 1,
  pageSize = 10,
  authed = false,
}: GetListsParams = {}): Promise<BrowseListsResponse> {
  return apiRequest<BrowseListsResponse>("/lists", {
    query: { category, sortBy, filmId, page, pageSize },
    ...(authed
      ? { auth: true, cache: "no-store" as const }
      : { cache: { revalidate: 300 } }),
  });
}

/** GET /lists/trending/weekly — six trending collections. Served anonymously. */
export async function getTrendingLists(): Promise<TrendingListsResponse> {
  return apiRequest<TrendingListsResponse>("/lists/trending/weekly", {
    cache: { revalidate: 600 },
  });
}

/** GET /lists/editorial — editor-picked collections. Served anonymously. */
export async function getEditorialLists(): Promise<EditorialListsResponse> {
  return apiRequest<EditorialListsResponse>("/lists/editorial", {
    cache: { revalidate: 600 },
  });
}

/** GET /lists/summary — total/today list counts for the hero banner. */
export async function getListsSummary(): Promise<ListsSummary> {
  return apiRequest<ListsSummary>("/lists/summary", { cache: { revalidate: 300 } });
}

/** GET /films/{id}/lists — the four most popular lists featuring a film. */
export async function getFilmsListsByFilm(
  filmId: number,
): Promise<FilmsListsByFilmResponse> {
  return apiRequest<FilmsListsByFilmResponse>(`/films/${filmId}/lists`, {
    cache: { revalidate: 600 },
  });
}

/**
 * GET /lists/{id} — full list / collection detail. Returns null on 404.
 * Pass `authed` to fetch per-user (Bearer + no-store) so the like/save state is
 * accurate; otherwise the response is cached anonymously.
 */
export async function getList(
  id: string,
  authed = false,
): Promise<ListDetail | null> {
  return nullOn404(
    apiRequest<ListDetail>(
      `/lists/${encodeURIComponent(id)}`,
      authed ? { auth: true, cache: "no-store" } : { cache: { revalidate: 600 } },
    ),
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

/**
 * POST /lists/{id}/like — toggle the current user's like on a list (auth
 * required). Requires a JSON body (empty `{}` is enough — without it the server
 * replies 415/400); returns the new like state. Mirrors `likeReview`.
 */
export async function likeList(listId: string): Promise<LikeToggleResponse> {
  return apiRequest<LikeToggleResponse>(
    `/lists/${encodeURIComponent(listId)}/like`,
    { method: "POST", body: {}, auth: true },
  );
}

/** POST /lists/{id}/save — save a list for the current user (auth required, 204). */
export async function saveList(listId: string): Promise<void> {
  await apiRequest<void>(`/lists/${encodeURIComponent(listId)}/save`, {
    method: "POST",
    body: {},
    auth: true,
  });
}

/** DELETE /lists/{id}/saved — remove a list from the user's saved (auth required, 204). */
export async function unsaveList(listId: string): Promise<void> {
  await apiRequest<void>(`/lists/${encodeURIComponent(listId)}/saved`, {
    method: "DELETE",
    auth: true,
  });
}
