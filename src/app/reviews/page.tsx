import type { Metadata } from "next";

import FilmsHeroSection from "@/components/sections/FilmsHeroSection";
import PopularReviewsSection from "@/components/sections/PopularReviewsSection";
import { reviewsHeroCopy, reviewsHeroStats } from "@/data/reviewsHero";
import MostReviewedSection from "@/components/sections/MostReviewedSection";
import RecentActivitySection from "@/components/sections/RecentActivitySection";
import BrowseAllReviewsSection from "@/components/sections/BrowseAllReviewsSection";
import BrowseByTagSection from "@/components/sections/BrowseByTagSection";
import { getPopularReviews } from "@/lib/api/reviews";
import { tmdbImage } from "@/lib/images/tmdb";
import type { PopularReviewItem } from "@/types/api";
import type { FeaturedReview } from "@/types/review";

export const metadata: Metadata = {
  title: "Reviews · Lumires",
  description:
    "Long-form thoughts, short reactions, and the occasional rant — written by people who watch films like it's the best part of their week.",
};

const FALLBACK_AVATAR = "/imgs/community/noirviewer.png";

function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// Map a (currently undocumented) popular-review item onto the card's shape,
// degrading gracefully for any field the API omits.
function toFeaturedReview(item: PopularReviewItem, i: number): FeaturedReview {
  const poster =
    tmdbImage(item.posterPath, "w780") ?? tmdbImage(item.backdropPath, "w780") ?? "";
  return {
    id: item.reviewId ?? (item.externalId != null ? String(item.externalId) : String(i)),
    tag: "Popular",
    timeAgo: "",
    title: item.filmTitle ?? item.title ?? "Untitled",
    posterUrl: poster,
    year: item.releaseYear != null ? String(item.releaseYear) : "",
    genre: item.genre ?? "",
    runtime: formatRuntime(item.runtime),
    director: item.director ?? "",
    pullQuote: item.quote ?? item.text ?? "",
    body: item.text ? [item.text] : [],
    username: item.reviewerName ?? "",
    avatarUrl: item.avatarUrl ?? FALLBACK_AVATAR,
    date: "",
    readTime: "",
    rating: item.rating ?? 0,
    likes: item.likes ?? 0,
    replies: item.replies ?? 0,
  };
}

async function getPopularReviewCards(): Promise<FeaturedReview[] | undefined> {
  try {
    const { items } = await getPopularReviews(365);
    if (!items?.length) return undefined; // fall back to static demo data
    return items.map(toFeaturedReview);
  } catch {
    return undefined;
  }
}

export default async function ReviewsPage() {
  const popularReviews = await getPopularReviewCards();

  return (
    <main className="relative flex min-h-screen flex-col bg-brand-dark">
      <FilmsHeroSection copy={reviewsHeroCopy} stats={reviewsHeroStats} />
      <PopularReviewsSection reviews={popularReviews} />
      <MostReviewedSection />
      <RecentActivitySection />
      <BrowseAllReviewsSection />
      <BrowseByTagSection />
    </main>
  );
}
    