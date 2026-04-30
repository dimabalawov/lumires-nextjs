import { CollectionData } from "@/types/film";

const p = (name: string) => `/imgs/collections/${name}.png`;

// All 8 available collection images
const avatar    = p("4c138a94f34b8d3d5d3f40b2042d8f0ed89c307a"); // Avatar — top-500 center
const ryuk      = p("b749a2136d272fefa1a1515d804c6a2075dad176"); // Ryuk / Death Note — anime center
const spiderman = p("9da3e8cb43c7fb8fa9d1118c346558824d5d7049"); // Spider-Man — lifetime center
const her       = p("3ca03a223b8ed400dc140ff12b5b33bc948800bb"); // Her
const perks     = p("53c6783818942029a9e2627d1df2c4fc88ad6ef3"); // Perks of Being a Wallflower
const monaco    = p("78738e5e513ff6fa964c25f0eab9795a36ea6a18"); // Monaco
const dreamy    = p("a9017723a84dae4b4312e96019afcf3ac995660d"); // Dreamy / misty
const pride     = p("c3caf48ceb953e2d8bdc51a050d0a333c32e8c9c"); // Pride & Prejudice

export const collections: CollectionData[] = [
  {
    id: "top-500",
    title: "Letterboxd's Top 500 Films",
    // index 5 = center/featured
    films: [pride, monaco, ryuk, spiderman, dreamy, avatar, perks, her, spiderman, monaco, pride],
  },
  {
    id: "anime",
    title: "Anime That Stays With You",
    films: [spiderman, avatar, perks, pride, her, ryuk, monaco, dreamy, perks, avatar, spiderman],
  },
  {
    id: "lifetime",
    title: "Movies Everyone Should Watch at Least Once During Their Lifetime",
    films: [ryuk, dreamy, avatar, her, monaco, spiderman, pride, perks, avatar, dreamy, ryuk],
  },
];
