import type { MovieDetail } from "@/types/movie";

// Fields the Lumires API doesn't yet return — keyed by film id.
// Remove once runtime / tagline / rating / cast / director / studio are exposed by the API.
export const filmExtras: Record<
  string,
  Pick<MovieDetail, "runtime" | "tagline" | "rating" | "cast" | "director" | "studio">
> = {
  "693134": {
    runtime: "2h 46m",
    tagline: "Power demands belief",
    rating: 5,
    cast: [
      "Timothée Chalamet",
      "Zendaya",
      "Rebecca Ferguson",
      "Austin Butler",
      "Florence Pugh",
      "Javier Bardem",
    ],
    director: "Denis Villeneuve",
    studio: "Legendary Entertainment",
  },
};

// Map TMDB long genre names to the shorter labels used in the design.
export const genreShortName: Record<string, string> = {
  "Science Fiction": "Sci-Fi",
};
