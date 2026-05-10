import "server-only";
import type { MovieDetail } from "@/types/movie";

const BASE_URL =
  process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";

export async function getMovie(
  id: string,
  _locale: string = "en-US",
): Promise<MovieDetail | null> {
  const url = `${BASE_URL}/movies/-/${encodeURIComponent(id)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getMovie(${id}) failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as MovieDetail;
}
