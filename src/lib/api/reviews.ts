import "server-only";
import type { ReviewsResponse } from "@/types/review";

const BASE_URL =
  process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";

export async function getFilmReviews(
  filmId: string | number,
  { page = 1, pageSize = 6 }: { page?: number; pageSize?: number } = {},
): Promise<ReviewsResponse> {
  const params = new URLSearchParams({
    filter: "0",
    category: "0",
    sortBy: "0",
    page: String(page),
    pageSize: String(pageSize),
  });
  const url = `${BASE_URL}/films/-/${encodeURIComponent(String(filmId))}/reviews?${params}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`getFilmReviews(${filmId}) failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as ReviewsResponse;
}
