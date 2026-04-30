export interface FilmCardData {
  id: string;
  title: string;
  quote: string;
  reviewer: string;
  image: string;
  rating: number;
}

export interface WeeklyFilmData {
  id: string;
  title: string;
  image: string;
  reviewCount: string;
  isFeatured?: boolean;
}

export interface CollectionData {
  id: string;
  title: string;
  films: string[]; // exactly 11 image paths; index 5 is the center/featured card
}

export interface CommunityReply {
  username: string;
  replyTo: string;
  avatarUrl: string;
  text: string;
}

export interface CommunityThread {
  id: string;
  username: string;
  filmTitle: string;
  avatarUrl: string;
  text: string;
  replies: number;
  likes: number;
  reply: CommunityReply;
  bgGradient: string;
  borderGradient: string;
}
