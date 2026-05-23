import { ListCardData } from "@/types/film";

// Shared poster strip — the only assets currently available live in
// /public/imgs/listCarousel. Reused across demo entries.
const animePosters = [
  "/imgs/listCarousel/image 15.png",
  "/imgs/listCarousel/image 16.png",
  "/imgs/listCarousel/image 17.png",
  "/imgs/listCarousel/image 18.png",
];

export const lists: ListCardData[] = [
  {
    id: "anime-that-stays-with-you",
    title: "Anime That Stays With You",
    filmCount: 43,
    author: "velvetcinema",
    posters: animePosters,
  },
  {
    id: "studio-ghibli-essentials",
    title: "Studio Ghibli Essentials",
    filmCount: 28,
    author: "nightowl",
    posters: animePosters,
  },
  {
    id: "modern-shonen-classics",
    title: "Modern Shonen Classics",
    filmCount: 51,
    author: "frame_by_frame",
    posters: animePosters,
  },
  {
    id: "comfort-rewatches",
    title: "Comfort Rewatches",
    filmCount: 19,
    author: "velvetcinema",
    posters: animePosters,
  },
  {
    id: "midnight-animation",
    title: "Midnight Animation",
    filmCount: 36,
    author: "reel_therapy",
    posters: animePosters,
  },
];
