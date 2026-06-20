import { ActiveMember, PopularMember } from "@/types/film";

// Reuses the /imgs/community avatar photo set as member portraits.
export const activeMembers: ActiveMember[] = [
  { id: "film_nerd92", username: "@film_nerd92", avatarUrl: "/imgs/community/cinephile.png", reviews: 56, lists: 6 },
  { id: "velvetcinema", username: "@velvetcinema", avatarUrl: "/imgs/community/velvetcinema.png", reviews: 48, lists: 9 },
  { id: "slowcinema", username: "@slowcinema", avatarUrl: "/imgs/community/slowcinema.png", reviews: 61, lists: 4 },
  { id: "grainyfilm", username: "@grainyfilm", avatarUrl: "/imgs/community/grainyfilm.png", reviews: 39, lists: 12 },
  { id: "midnightframes", username: "@midnightframes", avatarUrl: "/imgs/community/midnightframes.png", reviews: 52, lists: 7 },
  { id: "noirviewer", username: "@noirviewer", avatarUrl: "/imgs/community/noirviewer.png", reviews: 44, lists: 8 },
];

export const popularThisMonth: PopularMember[] = [
  { id: "lightandshadow", rank: "01", username: "@lightandshadow", quote: "Power demands belief.", replies: "324" },
  { id: "slowcinema", rank: "02", username: "@slowcinema", quote: "Beautiful, but a little cold.", replies: "514" },
  { id: "sandwalker", rank: "03", username: "@sandwalker", quote: "A film that earns its silence.", replies: "256" },
  { id: "noirviewer", rank: "04", username: "@noirviewer", quote: "A desert that watches back.", replies: "186" },
];
