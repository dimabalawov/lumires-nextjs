import "server-only";
import { apiRequest } from "./client";
import type { GenresResponse } from "@/types/api";

/** GET /genres — all genres with localized names. */
export async function getGenres(): Promise<GenresResponse> {
  return apiRequest<GenresResponse>("/genres", { cache: { revalidate: 86400 } });
}
