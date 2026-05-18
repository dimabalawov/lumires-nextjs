export interface MostReviewedFilm {
  id: string;
  title: string;
  quote: string;
  rating: number;
  reviewer: string;
  still: string;
}

const interstellar = "/imgs/trending/interstellar.jpg";

export const mostReviewedFilms: MostReviewedFilm[] = [
  { id: "mr-1", title: "Interstellar", quote: "“A film that makes you feel both the vastness of space and the intimacy of human love.”", rating: 5, reviewer: "@daniel.hayes", still: interstellar },
  { id: "mr-2", title: "Interstellar", quote: "“A film that makes you feel both the vastness of space and the intimacy of human love.”", rating: 5, reviewer: "@daniel.hayes", still: interstellar },
  { id: "mr-3", title: "Interstellar", quote: "“A film that makes you feel both the vastness of space and the intimacy of human love.”", rating: 5, reviewer: "@daniel.hayes", still: interstellar },
  { id: "mr-4", title: "Interstellar", quote: "“A film that makes you feel both the vastness of space and the intimacy of human love.”", rating: 5, reviewer: "@daniel.hayes", still: interstellar },
  { id: "mr-5", title: "Interstellar", quote: "“A film that makes you feel both the vastness of space and the intimacy of human love.”", rating: 5, reviewer: "@daniel.hayes", still: interstellar },
  { id: "mr-6", title: "Interstellar", quote: "“A film that makes you feel both the vastness of space and the intimacy of human love.”", rating: 5, reviewer: "@daniel.hayes", still: interstellar },
];
