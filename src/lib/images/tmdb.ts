export type TmdbImageSize = "w342" | "w500" | "w780" | "original";

export function tmdbImage(
  path: string | null | undefined,
  size: TmdbImageSize,
): string | undefined {
  if (!path) return undefined;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${normalized}`;
}

