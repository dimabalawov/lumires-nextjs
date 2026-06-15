export interface ExternalFilmShort {
  externalId: number;
  title: string;
  posterPath: string | null | undefined;
  releaseYear: number | null; 
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[]; 
}


export interface ExternalPersonShort {
  externalId: number;
  name: string;
  profilePath?: string | null;
  knownFor: ExternalFilmShort[]; 
}
 
export interface FilmInListItem {
  posterPath: string | null;
}
 
export interface ListSearchResult {
  id: string;
  title: string;
  userId: string;
  username: string;
  filmCount: number;
  likeCount: number;
  films: FilmInListItem[];
}
 
export interface MemberResult {
  id: string;
  username: string;
  avatarUrl?: string;
  followersCount: number;
}
 
export interface SearchResponse {
  films?: ExternalFilmShort[];
  directors?: ExternalPersonShort[];
  actors?: ExternalPersonShort[];
  lists?: ListSearchResult[];
  members?: MemberResult[];
}