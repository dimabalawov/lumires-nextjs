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
    joinedAt: string;
};
