export interface ThreadComment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  text: string;
  likesCount: number;
}
 
export interface ThreadItem {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  repliesCount: number;
  title: string | null;
  image: string | null;
  text: string;
  likesCount: number;
  createdAt: string; 
  isLikedByMe: boolean;
  isSpoilerFree: boolean;
  comment: ThreadComment | null;
}
 
export interface PagedResponse<T> {
  results: T[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}