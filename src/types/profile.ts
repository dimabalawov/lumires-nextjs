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

export type ProfileSettings = {
    avatarUrl: string | null;
    displayName: string | null;
    username: string;
    tagline: string | null;
};

export type FavouriteFilmItem = {
    id: number;
    title: string;
    posterPath?: string | null;
    releaseYear: number | null;
    genres: string[];
    voteAverage: number;
    order: number;
};

export type FavouriteFilmsResponse = {
    favouriteFilms: FavouriteFilmItem[];
};

export type AccountSettings = {
    emailAddress: string | null;
    password: string | null;
};

export enum ProfileVisibility {
  Everyone = "everyone",
  Followers = "followersOnly",
  OnlyMe = "onlyMe",
}

export type PrivacySettings = {
    profileVisibility: ProfileVisibility;
    isAnyoneCanFollow: boolean;
    isWatchlistPublic: boolean;
    areLikesPublic: boolean;
    areRatingsShowInFeeds: boolean;
};

export type NotificationPreferences = {
    newFollower: boolean;
    likesOnContent: boolean;
    activityFromFollowed: boolean;
    repliesAndMentions: boolean;
    savesOnLists: boolean;
    weeklyDigest: boolean;
};

export type UserSettingsResponse = {
    id: string;
    profileSettings: ProfileSettings;
    favouriteFilms: FavouriteFilmsResponse;
    accountSettings: AccountSettings;
    privacySettings: PrivacySettings;
    notificationPreferences: NotificationPreferences;
};

export type FavouriteFilmCommand = {
  externalId: number;
  order: number;
};

export interface FriendItem {
  relationshipId: string;   
  sourceUserId: string;     
  targetUserId: string;     
  otherUserId: string;      
  username: string;
  avatarUrl?: string | null;
  status: RelationshipStatus;
  type: RelationshipType;
  followerCount: number;
}

// Response modxel
export interface FriendsResponse {
  friends: FriendItem[];
  totalFollowers: number;
  totalFollowings: number;
  totalFriends: number;
  isMe: boolean;
}