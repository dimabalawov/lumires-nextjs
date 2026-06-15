import { ThreadItem } from "@/types/threads";
import { PagedResponse } from "@/types/watchlist";
import { apiRequest } from "./client";

type RawSearchParams = Record<string, string | string[] | undefined>;
 
function first(sp: RawSearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}
 
export async function getThreads(
  userId: string,
  searchParams: RawSearchParams,
): Promise<PagedResponse<ThreadItem> | null> {
  const qs = new URLSearchParams();
  qs.set("UserId", userId);
 
  const category = first(searchParams, "category");
  const sort = first(searchParams, "sortBy");
  const page = first(searchParams, "page");
 
  if (category) qs.set("Category", category);
  if (sort) qs.set("SortBy", sort);
  if (page) qs.set("Page", page);
 
  return apiRequest<PagedResponse<ThreadItem>>(`/threads?${qs.toString()}`, {
    cache: "no-store",
    auth: true,
    authExcep: false, 
  });
}