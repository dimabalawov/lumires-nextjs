import type { CollectionData } from "@/types/film";

const p = (name: string) => `/imgs/listMock/${name}.png`;

const r13 = p("Rectangle 13");
const r13_1 = p("Rectangle 13 (1)");
const r13_2 = p("Rectangle 13 (2)");
const r13_3 = p("Rectangle 13 (3)");
const r14 = p("Rectangle 14");
const r15 = p("Rectangle 15");
const r16 = p("Rectangle 16");
const r17 = p("Rectangle 17");
const r18 = p("Rectangle 18");

// Browse-lists grid. films[0] is the featured poster; films[1..] are the
// thin strips peeking on the right edge of the card.
export const browseLists: CollectionData[] = [
  { id: "slow-cinema-evenings", title: "Slow Cinema Evenings", films: [r17, r18, r13, r14, r15], filmCount: 43, author: "velvetcinema" },
  { id: "modern-sci-fi-essentials", title: "Modern Sci-Fi Essentials", films: [r15, r16, r13_1, r17, r18], filmCount: 43, author: "velvetcinema" },
  { id: "films-about-power-and-destiny", title: "Films About Power & Destiny", films: [r13, r14, r13_2, r15, r16], filmCount: 31, author: "nightowl" },
  { id: "epic-worlds", title: "Epic Worlds", films: [r14, r15, r13_3, r17, r18], filmCount: 58, author: "frame_by_frame" },
  { id: "desert-dreams", title: "Desert Dreams", films: [r16, r17, r13, r18, r14], filmCount: 22, author: "velvetcinema" },
  { id: "quiet-masterpieces", title: "Quiet Masterpieces", films: [r18, r13_1, r15, r16, r17], filmCount: 47, author: "reel_therapy" },
  { id: "comfort-rewatches", title: "Comfort Rewatches", films: [r13_2, r14, r16, r17, r18], filmCount: 19, author: "velvetcinema" },
  { id: "first-time-watches", title: "First-Time Watches", films: [r13_3, r15, r13, r14, r16], filmCount: 64, author: "nightowl" },
  { id: "after-midnight", title: "After Midnight", films: [r15, r17, r18, r13_1, r14], filmCount: 28, author: "frame_by_frame" },
  { id: "the-long-take", title: "The Long Take", films: [r17, r13, r16, r18, r15], filmCount: 36, author: "velvetcinema" },
];
