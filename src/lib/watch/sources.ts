import type { FilmSource } from "@/types/api";

/**
 * Which tab a provider lands in. JustWatch monetization types map as:
 *   free / ads        → "free"   (Free tab)
 *   flatrate / sub    → "sub"    (Subscribe & Rent tab)
 *   rent / buy        → "rent"   (Subscribe & Rent tab)
 */
export type WatchCategory = "free" | "sub" | "rent";

export interface WatchProvider {
  name: string;
  /** Logo under /imgs/wheretowatch, or null to fall back to the letter badge. */
  logo: string | null;
  /** Single-letter fallback shown when there's no logo. */
  initial: string;
  /** Tailwind classes for the fallback badge background/text. */
  badgeClass: string;
  /** Best available quality, e.g. "4K", "HD", "SD" (HDR/Dolby suffix preserved). */
  quality: string;
  category: WatchCategory;
  /** Sub-label after the quality dot, e.g. "SUBSCRIPTION", "RENT OR BUY", "WITH ADS". */
  detail: string;
  /** Lowest rent/buy price, or null for free/subscription providers. */
  price: number | null;
  /** Deep link to the provider's watch page. */
  url: string;
}

export interface WatchSources {
  free: WatchProvider[];
  subRent: WatchProvider[];
}

/**
 * Provider → local logo + fallback badge. Matched by case-insensitive substring
 * against the API's `providerName`, so "Amazon Prime Video", "Prime Video" etc.
 * all resolve to the same entry.
 */
const PROVIDER_META: {
  match: string[];
  logo: string | null;
  initial: string;
  badgeClass: string;
}[] = [
  { match: ["netflix"], logo: "/imgs/wheretowatch/netflix.png", initial: "N", badgeClass: "bg-[#E50914] text-white" },
  { match: ["fubo"], logo: "/imgs/wheretowatch/fubo.png", initial: "f", badgeClass: "bg-[#E84B17] text-white" },
  { match: ["apple"], logo: "/imgs/wheretowatch/apple.jpg", initial: "A", badgeClass: "bg-black text-white" },
  { match: ["amazon", "prime"], logo: "/imgs/wheretowatch/prime.png", initial: "a", badgeClass: "bg-[#00A8E1] text-white" },
  { match: ["google"], logo: "/imgs/wheretowatch/googleplay.jpg", initial: "G", badgeClass: "bg-white text-[#4285F4]" },
  { match: ["fandango", "vudu", "at home"], logo: "/imgs/wheretowatch/fathome.png", initial: "F", badgeClass: "bg-[#FF7300] text-white" },
  { match: ["pluto"], logo: "/imgs/wheretowatch/pluto.png", initial: "P", badgeClass: "bg-[#1B1464] text-[#FCE300]" },
  { match: ["tubi"], logo: "/imgs/wheretowatch/tubi.webp", initial: "t", badgeClass: "bg-[#FF310B] text-white" },
  { match: ["max", "hbo"], logo: null, initial: "M", badgeClass: "bg-[#0046FF] text-white" },
  { match: ["plex"], logo: null, initial: "x", badgeClass: "bg-[#1A1A1A] text-[#E5A00D]" },
  { match: ["archive"], logo: null, initial: "A", badgeClass: "bg-transparent text-brand-light ring-1 ring-brand-muted/50" },
];

const DEFAULT_BADGE = "bg-brand-gold/15 text-brand-gold";

function providerMeta(name: string) {
  const lower = name.toLowerCase();
  const hit = PROVIDER_META.find((p) => p.match.some((m) => lower.includes(m)));
  return {
    logo: hit?.logo ?? null,
    initial: hit?.initial ?? (name.trim()[0]?.toUpperCase() ?? "?"),
    badgeClass: hit?.badgeClass ?? DEFAULT_BADGE,
  };
}

function categoryOf(type: string): WatchCategory {
  const t = type.toLowerCase();
  if (t === "free" || t === "ads") return "free";
  if (t === "sub" || t === "flatrate") return "sub";
  return "rent"; // rent, buy
}

const QUALITY_RANK: Record<string, number> = { "4k": 3, hd: 2, sd: 1 };

function qualityScore(quality: string): number {
  const base = quality.toLowerCase().replace(/\s*(hdr|dolby).*/, "").trim();
  return QUALITY_RANK[base] ?? 0;
}

function detailFor(category: WatchCategory, type: string): string {
  if (category === "sub") return "SUBSCRIPTION";
  if (category === "rent") return "RENT OR BUY";
  return type.toLowerCase() === "ads" ? "WITH ADS" : "FREE";
}

/**
 * Collapse the raw, per-quality/per-type source rows into one display row per
 * provider, split into the two tabs the design shows. A provider with several
 * entries keeps its best quality and (for rent/buy) its lowest price. Within a
 * tab, free/subscription providers sort first, then by price ascending.
 */
export function normalizeSources(sources: FilmSource[] | null | undefined): WatchSources {
  const byProvider = new Map<string, WatchProvider>();

  for (const s of sources ?? []) {
    const category = categoryOf(s.type);
    const key = `${s.providerName}|${category}`;
    const existing = byProvider.get(key);

    if (!existing) {
      const meta = providerMeta(s.providerName);
      byProvider.set(key, {
        name: s.providerName,
        ...meta,
        quality: s.quality,
        category,
        detail: detailFor(category, s.type),
        price: category === "rent" ? s.price : null,
        url: s.url,
      });
      continue;
    }

    // Keep the highest quality seen for this provider.
    if (qualityScore(s.quality) > qualityScore(existing.quality)) {
      existing.quality = s.quality;
    }
    // Keep the lowest rent/buy price.
    if (category === "rent" && s.price != null) {
      existing.price = existing.price == null ? s.price : Math.min(existing.price, s.price);
    }
  }

  const all = [...byProvider.values()];
  const sort = (a: WatchProvider, b: WatchProvider) =>
    (a.price ?? -1) - (b.price ?? -1) || a.name.localeCompare(b.name);

  return {
    free: all.filter((p) => p.category === "free").sort(sort),
    subRent: all.filter((p) => p.category !== "free").sort(sort),
  };
}
