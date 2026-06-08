import "server-only";
import { apiRequest, nullOn404 } from "./client";
import type { ActorApiResponse } from "@/types/film";

/** GET /actors/{slug}/{id} — actor biography & metadata. Returns null on 404.
 *  The slug is cosmetic (the numeric id is the real key); mirrors the
 *  director endpoint. */
export async function getActor(
  slug: string,
  id: string | number,
): Promise<ActorApiResponse | null> {
  return nullOn404(
    apiRequest<ActorApiResponse>(
      `/actors/${encodeURIComponent(slug)}/${encodeURIComponent(String(id))}`,
      { cache: { revalidate: 3600 } },
    ),
  );
}
