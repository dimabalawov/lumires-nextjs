import "server-only";
import type { DirectorApiResponse } from "@/types/film";

const BASE_URL =
  process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";

export async function getDirector(
  slug: string,
  id: string,
): Promise<DirectorApiResponse | null> {
  const url = `${BASE_URL}/directors/${encodeURIComponent(slug)}/${encodeURIComponent(id)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getDirector(${slug}/${id}) failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as DirectorApiResponse;
}
