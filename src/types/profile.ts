export enum Pronouns {
    NotDefined = "NotDefined",
    HeHim = "HeHim",
    SheHer = "SheHer",
    TheyThem = "TheyThem",
    HeThey = "HeThey",
    SheThey = "SheThey",
    TheyHe = "TheyHe",
    TheyShe = "TheyShe",
    Other = "Other",
}

export enum RelationshipType {
    Follow = "follow",
    Block = "block",
}

export enum RelationshipStatus {
    Pending = "pending",
    Accepted = "accepted"
}

type Relationship = {
    type: RelationshipType | null,
    status: RelationshipStatus | null
}


export interface UserProfile {
    id: string;
    username: string;
    displayName: string | null;
    pronouns: Pronouns;
    location: string | null;
    tagline: string | null;
    avatarUrl: string | undefined;
    biography: string | null;
    followers: number,
    followings: number,
    friends: number,
    isMe: boolean | null;
    incomingRelationship: Relationship | null;
    outgoingRelationship: Relationship | null;
    reviewsWritten: number,
    threadsWritten: number,
    listsCreated: number
}

export type UserProfileStats = {
    mostWatchedDirectors: string[];
    mostWatchedDecades: string[];
    mostWatchedGenres: string[];
    averageRatings: Record<number, number>;
};


export type UserProfileSummary = {
    totalFilmsRated: number;
    listsCreated: number;
    reviewsWritten: number;
    watchlistFilms: number;
    likesCount: number;
    joinedAt: string;
};

export interface ProfileFeaturedReview {
    id: string;
    filmId: number;
    filmTitle: string;
    filmSlug: string;
    posterPath: string | null;
    releaseYear: number | null;
    genres: string[];
    runtime: number;
    directorId: string;
    directorName: string;
    title: string | null;
    text: string;
    userId: string;
    username: string;
    avatarUrl: string | undefined;
    createdAt: string;
    rating: number | null;
    likesCount: number;
    repliesCount: number;
    isLikedByMe: boolean;
    isEditorPick: boolean;
    minutesRead: number;
}

export interface PopularListFilm {
    posterPath: string | null;
}

export interface PopularList {
    id: string;
    title: string;
    filmCount: number;
    isLiked: boolean;
    isSaved: boolean;
    userId: string;
    username: string;
    films: PopularListFilm[];
}

export interface PopularListsResponse {
    lists: PopularList[]
}

export interface UserStatistics {
    mostWatchedDirectors: string[];
    mostWatchedDecades: string[];
    mostWatchedGenres: string[];
    averageRatings: Record<string, number>;
}