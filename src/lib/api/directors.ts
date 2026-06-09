import "server-only";
import { apiRequest, nullOn404 } from "./client";
import type { DirectorApiResponse } from "@/types/film";

/** GET /directors/{id} - director biography & metadata. Returns null on 404. */
export async function getDirector(id: string | number): Promise<DirectorApiResponse | null> {
  return nullOn404(
    apiRequest<DirectorApiResponse>(
      `/directors/${encodeURIComponent(String(id))}`,
      { cache: { revalidate: 3600 } },
    ),
  );
}
