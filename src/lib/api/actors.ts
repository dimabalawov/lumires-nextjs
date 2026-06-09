import "server-only";
import { apiRequest, nullOn404 } from "./client";
import type { ActorApiResponse } from "@/types/film";

/** GET /actors/{id} - actor biography & metadata. Returns null on 404. */
export async function getActor(id: string | number): Promise<ActorApiResponse | null> {
  return nullOn404(
    apiRequest<ActorApiResponse>(
      `/actors/${encodeURIComponent(String(id))}`,
      { cache: { revalidate: 3600 } },
    ),
  );
}
