export interface EditorialFilm {
  id: string;
  title: string;
  year: string;
  genre: string;
  rating: number;
  poster: string;
}

export interface EditorialCollection {
  id: string;
  title: string;
  films: EditorialFilm[];
}

const sendHelp = "/imgs/editorial/image 12.png";
const sendHelpEye = "/imgs/editorial/image 13.png";
const crucifix = "/imgs/editorial/image 13 (1).png";

export const editorialCollections: EditorialCollection[] = [
  {
    id: "best-horror-decade",
    title: "Best Horror Of The Decade",
    films: [
      { id: "bh-1", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
      { id: "bh-2", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelpEye },
      { id: "bh-3", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: crucifix },
      { id: "bh-4", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
      { id: "bh-5", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
    ],
  },
  {
    id: "films-defined-2010s",
    title: "Films That Defined 2010s",
    films: [
      { id: "fd-1", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
      { id: "fd-2", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelpEye },
      { id: "fd-3", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: crucifix },
      { id: "fd-4", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
      { id: "fd-5", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
    ],
  },
  {
    id: "essential-villeneuve",
    title: "Essential Villeneuve",
    films: [
      { id: "fd-1", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
      { id: "fd-2", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelpEye },
      { id: "fd-3", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: crucifix },
      { id: "fd-4", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
      { id: "fd-5", title: "Send Help", year: "2026", genre: "Horror-Thriller", rating: 5, poster: sendHelp },
    ],
  },
];
