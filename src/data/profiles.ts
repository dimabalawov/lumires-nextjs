import type { UserProfile } from "@/types/film";

const profilesBySlug: Record<string, UserProfile> = {
  lightandshadow: {
    slug: "lightandshadow",
    username: "@Lightandshadow",
    avatarUrl: "/imgs/community/cinephile.png",
    tagline: "Watching films and collecting quiet moments.",
    bio: `"I've always loved films that leave something unresolved — stories that stay with you quietly instead of trying to impress you immediately. Most of the movies I save here are atmospheric, emotional or visually immersive in some way.
I'm especially drawn to slow cinema, sci-fi with philosophical themes and films that make ordinary moments feel meaningful. For me, cinema has never really been about escaping reality, but about seeing it differently for a while.
Usually watching late at night with headphones on and all the lights off."
but about seeing it differently for a while. Usually watching late at night with headphones on and all the lights off."`,
    followers: "120",
    following: "342",
    friends: "12",
    stats: {
      totalFilmsRated: "2,341",
      listsCreated: "8",
      reviewsWritten: "187",
      joined: "Mar 2021",
    },
  },
};

const DEFAULT_PROFILE: UserProfile = {
  slug: "unknown",
  username: "@unknown",
  avatarUrl: "/imgs/community/quietobserver.png",
  tagline: "A quiet observer of cinema.",
  bio: `"Drifting between genres, gathering films the way others gather memories."`,
  followers: "0",
  following: "0",
  friends: "0",
  stats: {
    totalFilmsRated: "0",
    listsCreated: "0",
    reviewsWritten: "0",
    joined: "Jan 2026",
  },
};

export function getProfileBySlug(slug: string): UserProfile {
  return profilesBySlug[slug.toLowerCase()] ?? { ...DEFAULT_PROFILE, slug };
}
