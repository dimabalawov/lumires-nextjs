/**
 * Profile banner colour themes for the "Banner colour" picker
 * (Figma node 2532:4145). Each theme's `gradient` re-themes the swatch in the
 * picker and is meant to render live behind the whole profile.
 *
 * Gradients are rebuilt from the Figma radial fills: a glow emanating from the
 * upper-left that falls off into the brand-dark base (#141110 ≈ rgb 20,17,15).
 */
export interface BannerTheme {
  id: string;
  name: string;
  description: string;
  /** Brightest stop — used for the selected ring + live profile accent. */
  accent: string;
  /** CSS background for the swatch and the live profile backdrop. */
  gradient: string;
}

const FALLOFF = "circle at 28% 0%";

/** Build a radial swatch gradient from amber-style 5-stop colour ramps. */
function ramp(s0: string, s1: string, s2: string, s3: string): string {
  return (
    `radial-gradient(${FALLOFF}, ` +
    `${s0} 0%, ${s1} 55%, ${s2} 73.5%, ${s3} 82.75%, rgb(20,17,15) 92%)`
  );
}

export const BANNER_THEMES: BannerTheme[] = [
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm amber — classic",
    accent: "rgb(208,162,96)",
    gradient: ramp(
      "rgba(208,162,96,0.85)",
      "rgba(128,98,56,0.25)",
      "rgba(74,58,36,0.625)",
      "rgba(47,37,25,0.8125)",
    ),
  },
  {
    id: "film-noir",
    name: "Film Noir",
    description: "Smoky monochrome",
    accent: "rgb(169,164,156)",
    gradient: ramp(
      "rgba(169,164,156,0.85)",
      "rgba(103,100,95,0.25)",
      "rgba(61,58,55,0.625)",
      "rgba(41,38,35,0.8125)",
    ),
  },
  {
    id: "crimson",
    name: "Crimson",
    description: "Giallo red",
    accent: "rgb(206,101,90)",
    gradient: ramp(
      "rgba(206,101,90,0.85)",
      "rgba(127,60,52,0.25)",
      "rgba(73,38,34,0.625)",
      "rgba(47,28,24,0.8125)",
    ),
  },
  {
    id: "rose-pavilion",
    name: "Rose Pavilion",
    description: "Powder mauve",
    accent: "rgb(241,164,187)",
    gradient:
      `radial-gradient(${FALLOFF}, ` +
      "rgba(207,133,156,0.85) 0%, rgba(168,107,125,0.55) 27.5%, " +
      "rgba(128,80,95,0.25) 55%, rgba(74,49,55,0.625) 73.5%, " +
      "rgba(47,33,35,0.8125) 82.75%, rgb(20,17,15) 92%)",
  },
  {
    id: "twilight",
    name: "Twilight",
    description: "Dusk violet",
    accent: "rgb(168,125,199)",
    gradient: ramp(
      "rgba(168,125,199,0.85)",
      "rgba(102,75,122,0.25)",
      "rgba(61,46,69,0.625)",
      "rgba(41,32,42,0.8125)",
    ),
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep indigo",
    accent: "rgb(104,123,197)",
    gradient: ramp(
      "rgba(104,123,197,0.85)",
      "rgba(62,74,121,0.25)",
      "rgba(41,45,68,0.625)",
      "rgba(30,31,41,0.8125)",
    ),
  },
  {
    id: "blue-velvet",
    name: "Blue Velvet",
    description: "Lynchian cobalt",
    accent: "rgb(101,149,209)",
    gradient: ramp(
      "rgba(101,149,209,0.85)",
      "rgba(60,90,129,0.25)",
      "rgba(40,54,72,0.625)",
      "rgba(30,35,44,0.8125)",
    ),
  },
  {
    id: "celluloid",
    name: "Celluloid",
    description: "Verdant green",
    accent: "rgb(108,177,123)",
    gradient: ramp(
      "rgba(108,177,123,0.85)",
      "rgba(64,108,74,0.25)",
      "rgba(42,63,44,0.625)",
      "rgba(31,40,30,0.8125)",
    ),
  },
];

/** The gold "Golden Hour" theme — matches the app's default brand-gold accent. */
export const DEFAULT_THEME_ID = "golden-hour";

/** Resolve a stored theme id to its theme, falling back to the default. */
export function getBannerTheme(id?: string | null): BannerTheme {
  return (
    BANNER_THEMES.find((t) => t.id === id) ??
    BANNER_THEMES.find((t) => t.id === DEFAULT_THEME_ID) ??
    BANNER_THEMES[0]
  );
}
