import ActivityCard from "@/components/ui/ActivityCard";
import Pagination from "@/components/ui/Pagination";
import ReviewFilters from "@/components/sections/ReviewFilters";
import { optionalData } from "@/lib/api/client";
import { getLikedReviews } from "@/lib/api/users";
import { toActivityReview } from "../utils/mappers";

const PAGE_SIZE = 6;
const toInt = (v: string | undefined, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);

interface Props {
  username: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function LikedReviewsSection({ username, searchParams = {} }: Props) {
  const read = (k: string) => (Array.isArray(searchParams[k]) ? searchParams[k]![0] : searchParams[k]);

  const filter = toInt(read("filter"));
  const sortBy = toInt(read("sortBy"));
  const page = Math.max(1, toInt(read("page"), 1));

  const result = await optionalData(getLikedReviews(username, { filter, sortBy, page, pageSize: PAGE_SIZE, authed: true }));
  const reviews = result?.results ?? [];

  return (
    <>
      <ReviewFilters userSection={true}/>

      {reviews.length === 0 ? (
        <p className="py-16 text-center font-manrope font-light text-brand-muted">No liked reviews yet.</p>
      ) : (
        <div className="flex flex-col">
          {reviews.map((r, i) => (
            <ActivityCard key={r.id} review={toActivityReview(r)} divider={i > 0} />
          ))}
        </div>
      )}

      <Pagination page={result?.page ?? page} totalPages={result?.totalPages ?? 1} />
    </>
  );
}