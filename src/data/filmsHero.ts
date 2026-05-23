export interface FilmsHeroStat {
  value: string;
  label: string;
}

export interface FilmsHeroCopy {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  ctaLabel: string;
}

export const filmsHeroStats: FilmsHeroStat[] = [
  { value: "1.1m", label: "Films" },
  { value: "19", label: "Genres" },
];

export const filmsHeroCopy: FilmsHeroCopy = {
  eyebrow: "The Archive",
  titleLead: "Explore The",
  titleAccent: "Films.",
  description:
    "Every film, rated and reviewed by people who actually care. Browse by genre, decade, director — or just wander.",
  ctaLabel: "Find your next film",
};
