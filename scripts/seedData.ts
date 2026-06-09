// Static pools used by scripts/seed.ts. Kept separate so the main script stays
// focused on flow. None of this is shipped with the app — dev-time seeding only.

/**
 * Authors + lists seeded for the "Collections Created By Film Lovers" section
 * (run via `npm run seed:collections`). Each becomes a confirmed @lumires.test
 * user who owns one film list; the script then features those lists in the
 * admin-curated `featured_collections` table.
 */
export const FEATURED_COLLECTIONS: {
  username: string;
  title: string;
  description: string;
}[] = [
  {
    username: "cinephile_canon",
    title: "All-Time Greats — The Essential 250",
    description: "The canon, condensed. Start here if you want the films everyone keeps citing.",
  },
  {
    username: "worldbuilder_reel",
    title: "Worlds Worth Getting Lost In",
    description: "Sprawling, lived-in epics — the collections I return to again and again.",
  },
  {
    username: "cozy_frames",
    title: "Comfort Watches for a Rainy Day",
    description: "Soft, warm, and easy — the films you put on when the world is too much.",
  },
  {
    username: "synapse_reel",
    title: "Mind-Bending Sci-Fi",
    description: "Time loops, simulations, and questions that follow you out of the cinema.",
  },
  {
    username: "goldreel_picks",
    title: "Award Winners Worth the Hype",
    description: "Best Picture honourees and festival darlings that actually earned the trophy.",
  },
];

/**
 * Temporary avatars for seeded users. Local files under public/imgs/community,
 * stored on Users.AvatarUrl and served directly by next/image. Rotated across
 * seeded users so review/reply cards show varied faces instead of one fallback.
 * Swap for real uploaded avatars later.
 */
export const AVATARS: string[] = [
  "/imgs/community/cinemalover.png",
  "/imgs/community/cinephile.png",
  "/imgs/community/filmjournal.png",
  "/imgs/community/grainyfilm.png",
  "/imgs/community/lina.png",
  "/imgs/community/midnightframes.png",
  "/imgs/community/nightviewer.png",
  "/imgs/community/noirviewer.png",
  "/imgs/community/quietobserver.png",
  "/imgs/community/slowcinema.png",
  "/imgs/community/softlight.png",
  "/imgs/community/velvetcinema.png",
];

/** Reviewer display names. The script appends a numeric suffix on collision. */
export const USERNAMES: string[] = [
  "noir_viewer",
  "cinephile_42",
  "reel_talk",
  "frame_by_frame",
  "the_lateshow",
  "celluloid_dreams",
  "popcorn_critic",
  "auteur_hunter",
  "matinee_mara",
  "grain_and_glow",
  "second_watch",
  "the_final_cut",
  "widescreen_will",
  "soft_focus",
  "reel_deal_rae",
  "midnight_screening",
  "tracking_shot",
  "the_quiet_frame",
  "kino_kid",
  "double_feature",
  "lens_flare_lou",
  "after_credits",
  "the_dolly_zoom",
  "projector_pat",
  "slow_pan_sam",
  "arthouse_avi",
  "the_negative_space",
  "boxoffice_bex",
  "deep_focus_dee",
  "the_long_take",
  "freeze_frame_fran",
  "establishing_shot",
  "the_match_cut",
  "screen_test_sky",
  "title_card_tom",
];

/**
 * Review-copy fragments. The script composes a body from an opener + a beat,
 * so the same pools yield plenty of distinct-looking reviews.
 */
export const REVIEW_OPENERS: string[] = [
  "A genuine high-water mark for the genre.",
  "I went in skeptical and left a believer.",
  "Not flawless, but impossible to look away from.",
  "This one rewires how you watch everything after it.",
  "Quietly devastating in the best way.",
  "Pure craft from the first frame to the last.",
  "A film that trusts its audience completely.",
  "Bigger on the inside than its runtime suggests.",
  "The kind of movie you argue about on the walk home.",
  "Exactly the swing for the fences I wanted.",
  "Flawed, ambitious, and unforgettable.",
  "It earns every minute it asks of you.",
];

export const REVIEW_BEATS: string[] = [
  "The pacing never lets up and the performances hold the whole thing together.",
  "Every department is firing — score, cinematography, editing, all of it.",
  "It lingers on the small moments and that's where it really sings.",
  "There's a confidence to the filmmaking that's rare these days.",
  "The third act recontextualizes everything that came before it.",
  "Tonal control like this is harder than it looks.",
  "It would be a masterpiece with twenty minutes trimmed, but I'll take it.",
  "The lead carries scenes that lesser films would have cut entirely.",
  "Gorgeous to look at without ever being hollow.",
  "It respects the audience enough to leave questions unanswered.",
];

/** Short pull-quotes (the API surfaces one as `quote` on most-reviewed items). */
export const REVIEW_TITLES: string[] = [
  "A near-perfect sit",
  "Stayed with me for days",
  "Better than I expected",
  "The real deal",
  "Worth every minute",
  "Quietly brilliant",
  "An instant rewatch",
  "Bold and unforgettable",
  "Craft on full display",
  "Sticks the landing",
];

/**
 * Rating pool, skewed positive like a real catalogue. Values are 0.5-step
 * floats on a 5-point scale (API accepts a nullable float).
 */
export const RATING_POOL: number[] = [5, 5, 4.5, 4.5, 4, 4, 4, 3.5, 3.5, 3, 2.5, 5];

/**
 * Reply-copy fragments for seeding comments on reviews. Each is 5–255 chars
 * (the reply endpoint's bounds) and reads as a natural response to a review.
 */
export const REPLY_TEXTS: string[] = [
  "Totally agree with your take on the third act.",
  "I had the same feeling — it slowly shifts your perspective without you noticing.",
  "Exactly this. It's almost uncomfortable to watch, but that's what makes it powerful.",
  "Hadn't thought of it that way, but you're right about the pacing.",
  "The soundtrack carries so much of the emotion for me too.",
  "I didn't expect it to feel this personal. It really stayed with me.",
  "Beautifully put. The quiet moments are doing all the heavy lifting.",
  "Respectfully disagree on the ending, but I see where you're coming from.",
  "This is the review that finally convinced me to watch it.",
  "Couldn't have said it better — every department is firing.",
  "The performances are what sell it for me, completely agree.",
  "Great write-up. You captured exactly why it lingers.",
  "I went in skeptical too and walked out a believer.",
  "That third-act turn recontextualizes the whole film, so well observed.",
  "Saw it twice and your read holds up even better the second time.",
];
