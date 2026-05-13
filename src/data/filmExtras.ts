import type { MovieDetail } from "@/types/movie";

// Fields the Lumires API doesn't yet return — keyed by film id (stringified).
// Remove once tagline / rating are exposed by the API.
export const filmExtras: Record<string, Pick<MovieDetail, "tagline" | "rating">> = {
  "693134": {
    tagline: "Power demands belief",
    rating: 5,
  },
  "550": {
    tagline: "Mischief. Mayhem. Soap.",
    rating: 5,
  },
};

// Map TMDB long genre names to the shorter labels used in the design.
export const genreShortName: Record<string, string> = {
  "Science Fiction": "Sci-Fi",
};
