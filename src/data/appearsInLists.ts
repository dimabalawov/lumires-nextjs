import type { CollectionData } from "@/types/film";

const p = (name: string) => `/imgs/listMock/${name}.png`;

const r13   = p("Rectangle 13");
const r13_1 = p("Rectangle 13 (1)");
const r13_2 = p("Rectangle 13 (2)");
const r13_3 = p("Rectangle 13 (3)");
const r14   = p("Rectangle 14");
const r15   = p("Rectangle 15");
const r16   = p("Rectangle 16");
const r17   = p("Rectangle 17");
const r18   = p("Rectangle 18");

// 5 entries per list — index 0 is the featured (wide) image; the rest peek out
// as right-side strips.

export const appearsInLists: CollectionData[] = [
  {
    id: "slow-cinema-evenings",
    title: "Slow Cinema Evenings",
    films: [r17, r18, r13, r14, r15],
    filmCount: 43,
    author: "velvetcinema",
  },
  {
    id: "modern-sci-fi-essentials",
    title: "Modern Sci-Fi Essentials",
    films: [r15, r16, r13_1, r17, r18],
    filmCount: 28,
    author: "cosmicframe",
  },
  {
    id: "films-about-power-and-destiny",
    title: "Films About Power And Destiny",
    films: [r13, r14, r13_2, r15, r16],
    filmCount: 31,
    author: "ironcanon",
  },
  {
    id: "epic-worlds",
    title: "Epic Worlds",
    films: [r14, r15, r13_3, r17, r18],
    filmCount: 56,
    author: "vastreel",
  },
];
