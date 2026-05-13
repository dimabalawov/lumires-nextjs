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
