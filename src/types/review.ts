// Lumires reviews API shape (best-guess until non-empty data lands).
// Endpoint: GET /films/-/{id}/reviews?filter=0&category=0&sortBy=0&page=1&pageSize=N
// Update fields here once the real payload is available.

export interface ReviewReply {
  username: string;
  avatarUrl: string;
  text: string;
}

export interface Review {
  id: string | number;
  username: string;
  avatarUrl: string;
  text: string;
  replies: number;
  likes: number;
  topReply?: ReviewReply;
}

export interface ReviewsResponse {
  results: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Editorial featured review used in the "Popular Reviews" carousel on /reviews.
export interface FeaturedReview {
  id: string;
  tag: string; // "Editor's Pick"
  timeAgo: string; // "4 days ago"
  title: string;
  posterUrl: string;
  year: string;
  genre: string;
  runtime: string;
  director: string;
  pullQuote: string;
  body: string[];
  username: string;
  avatarUrl: string;
  date: string; // "May 2"
  readTime: string; // "8 min read"
  rating: number;
  likes: number;
  replies: number;
}

// Flat review item used in the "Recent Activity" feed on /reviews.
export interface ActivityReview {
  id: string;
  avatarUrl: string;
  username: string;
  rating: number; // 0..5
  timeAgo: string;
  replies: number;
  filmTitle: string;
  filmHref: string;
  title: string;
  body: string[];
  likes: number;
  posterUrl: string;
}
