/** "Denis Villeneuve" → "denis-villeneuve" for profile route slugs.
 *  The slug is cosmetic in /actors and /directors routes (the numeric TMDB id
 *  is the real key), so a best-effort ASCII slug is sufficient. */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
