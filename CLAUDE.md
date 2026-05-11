# CLAUDE.md — lumires-nextjs

Stack: **Next.js 16** (App Router) · **React 19** · **Tailwind v4** (`@theme inline` in `globals.css`) · **Supabase** (SSR + client) · **TypeScript**

Single source of truth for design tokens is `src/styles/globals.css`. Always prefer tokens / existing utilities over raw values.

---

## Design tokens

Defined in `src/styles/globals.css` via Tailwind v4 `@theme`. Use the class names listed — do **not** introduce raw hex unless flagging that no token matches.

| Token             | Hex       | Tailwind class           | Typical use |
|-------------------|-----------|--------------------------|-------------|
| `brand-dark`      | `#12100e` | `bg-brand-dark` / `text-brand-dark` | Page bg, dark overlays |
| `brand-light`     | `#f2eee9` | `text-brand-light`       | Default body/heading text on dark bg |
| `brand-gold`      | `#d2a66a` | `text-brand-gold` / `border-brand-gold` | Accent: logo, CTA borders, usernames |
| `brand-muted`     | `#9b8f84` | `text-brand-muted`       | Secondary/meta text |

Translucent dark overlays in inline styles use these RGBs (same colors, with opacity):
- `rgba(18,16,14,…)` = `brand-dark`
- `rgba(14,12,11,…)` = slightly cooler dark, used in `auth-overlay-*` and `HeroSection` gradients

---

## Fonts

Loaded in `src/app/layout.tsx`, exposed as CSS variables, mapped in `@theme`:

| Family       | CSS var          | Tailwind class | Weights loaded | Used for |
|--------------|------------------|----------------|----------------|----------|
| Oswald       | `--font-oswald`  | `font-oswald` (also `font-sans` default) | 200, 300, 400, 500, 700 | Uppercase nav, headings, logo |
| Manrope      | `--font-manrope` | `font-manrope` | 300, 400, 500, 600 | Hero subheadings, longer-form uppercase |
| Geist Mono   | `--font-geist-mono` | `font-mono` | default | Code / numeric |

`body` defaults to Oswald. Reach for `font-manrope` explicitly when matching the hero pattern.

---

## Layout & overlay utilities

Defined in `src/styles/globals.css`:

- **`section-container`** — page-width wrapper. Widths: 94% mobile · 90% ≥1024px · 83% ≥1280px · `max-width: 1197px` · auto margins. **Use this for every section's outer wrapper.**
- **`auth-overlay-right`** — horizontal dark fade for auth pages (right → transparent).
- **`auth-overlay-top`** — vertical dark fade for auth pages (top opaque → transparent).
- **`scrollbar-hide`** — hides scrollbars on overflow containers.
- **`.auth-card-border`** — gradient-bordered auth card via masked pseudo-element.
- **`text-auth-subtitle`** — `#dacbbd` subtitle color used in auth cards (no token for this yet).

---

## Recurring class patterns (observed in `src/components`)

- **Logo:** `text-brand-gold uppercase font-light text-[18px] tracking-[0.2em]`
- **Desktop nav links:** `text-white uppercase font-light text-base tracking-[0.12em] hover:opacity-70 transition-opacity`
- **Mobile menu links:** `text-brand-light uppercase font-oswald font-light text-[28px] tracking-[0.12em]`
- **Section heading (H2):** `uppercase font-oswald text-brand-light opacity-90 font-normal text-[28px] leading-[36px] lg:text-[56px] lg:leading-[64px] tracking-[0.06em]` — see `src/components/ui/SectionHeader.tsx`
- **Section "show all" link:** `uppercase text-brand-light font-oswald underline font-light text-base tracking-[0.06em] hover:opacity-70 transition-opacity`
- **Hero headline:** `font-oswald font-extralight text-brand-light uppercase` + `style={{ fontSize: "clamp(36px, 10vw, 160px)" }}`
- **Hero subheading:** `font-manrope font-light text-brand-light uppercase` (sizes via `text-[20px] lg:text-[60px]` etc.)
- **CTA / pill button:** `text-brand-gold uppercase font-light tracking-[0.12em] border border-brand-gold px-4 py-1.5 hover:bg-brand-gold hover:text-black transition-colors`
- **Hover convention:** `hover:opacity-60` (hero) or `hover:opacity-70` (nav/section links) + `transition-opacity`.
- **Tracking scale:** `[0.06em]` body uppercase · `[0.12em]` nav/buttons · `[0.2em]` logo.
- **Gradient overlays on hero/header:** vertical `bg-gradient-to-b from-black/X via-black/Y to-transparent`, often with `h-[150%]` or `h-[200%]` so the fade extends past the parent. For finer control, inline `linear-gradient` with `rgba(18,16,14,…)` stops (see `HeroSection.tsx:18-25`).

---

## Project conventions

- **Path alias:** `@/` → `src/`
- **Server actions:** `src/lib/actions/` (e.g. `signOut` in `auth.ts`)
- **Supabase clients:** `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (SSR — uses `server-only`)
- **External API:** TMDB-based film data via `src/lib/api/movies.ts` and `src/lib/images/tmdb.ts`
- **Static demo data:** `src/data/*.ts` (collections, films, threads, weekly)
- **Types:** `src/types/` — extend here rather than inlining shapes
- **Components:** `src/components/{layout,sections,ui}` — `layout` for site-chrome, `sections` for page-level blocks, `ui` for atomic/reusable pieces
- **Run dev server:** `npm run dev` (Next.js 16, defaults to <http://localhost:3000>)

---

## Workflow: matching designs from screenshots / Figma

Apply this loop whenever the user pastes a target image or Figma URL and asks me to reproduce it.

1. **If a Figma URL is provided:** call `mcp__plugin_figma_figma__get_design_context` first with the parsed `fileKey` + `nodeId`. The returned tokens/components are authoritative — fall back to inference from the screenshot only for things Figma doesn't expose.
2. **Inventory the target.** Before writing any code, list every visual property I need to reproduce: colors, spacing, typography (family/weight/size/tracking/leading), borders, radii, shadows, gradient stops, hover/active states, breakpoints.
3. **Map each property to a token or existing utility.** Look in the table above first. If something has no token match (e.g. a one-off color), call it out explicitly to the user rather than silently inlining a raw hex.
4. **Reuse existing components.** Check `src/components/ui/` and `src/components/sections/` before creating new ones — many patterns (`SectionHeader`, `FilmCard`, `Avatar`, etc.) already exist.
5. **Implement.** Make the smallest edit that achieves the look. Don't refactor surrounding code.
6. **Verify visually.** If `chrome-devtools` MCP is connected: ensure `npm run dev` is running, navigate to the page, take a screenshot, compare to the target, iterate. If not connected: implement, report what changed, and ask for a comparison screenshot.
7. **Never claim "done" without visual confirmation** — either via my own screenshot (MCP loop) or the user's.

When matching a CSS gradient from a screenshot, eyeball direction first, then stop counts (2 vs 3+), then approximate each stop's opacity in 10% increments — refine after the first render.

---

## Notes / gotchas

- `globals.css` lives at `src/styles/globals.css` (not the default `src/app/globals.css`). It is imported from `src/app/layout.tsx`.
- Tailwind v4 — no `tailwind.config.js`. Tokens live in `@theme inline` in `globals.css`. Edit there to add a token.
- Empty file `ClAUDE.md` (typo) is in the repo root and untracked. Safe to delete in favor of this `CLAUDE.md`.
