# Lumires — Letterboxd Clone

## Project Overview

A Letterboxd-inspired movie tracking and social platform.

## Tech Stack

- Frontend: Next.js 16 + TypeScript (/lumires-nextjs)
- Backend: C# (planned — not yet scaffolded)
- Styling: Tailwind CSS v4
- Design: Figma MCP (connect on every session)

## Figma

- File: nQJEoZ9niM0XjJK4JoYvfa — letterboxdClon
- URL: https://www.figma.com/design/nQJEoZ9niM0XjJK4JoYvfa/letterboxdClon
- Handle: Dmytro Balashov (balas_td51@student.itstep.org)

## Session Startup Checklist

1. Use FrameLink MCP (mcp__Framelink_Figma_MCP__get_figma_data) — NOT the plugin Figma MCP (mcp__plugin_figma_figma__*), which hits rate limits on the Education plan.
2. Pull structure: get_figma_data(fileKey="nQJEoZ9niM0XjJK4JoYvfa", depth=2) to find node IDs, then drill in with a specific nodeId.
3. Check /lumires-nextjs/src for existing components before generating new ones.

## Project Structure

lumires-front/
└── lumires-nextjs/       # Next.js 16 + TypeScript app
    ├── src/
    │   ├── app/          # App Router pages
    │   ├── components/
    │   │   ├── layout/   # Header, Footer, etc.
    │   │   ├── sections/ # Page sections (Hero, Trending, Weekly…)
    │   │   └── ui/       # Reusable cards and primitives
    │   ├── data/         # Static mock data (replace with API calls later)
    │   ├── types/        # TypeScript interfaces
    │   ├── constants/    # Shared magic values (carousel sizes, etc.)
    │   └── styles/       # globals.css (Tailwind v4 @theme tokens)
    ├── public/
    │   └── imgs/         # Local images (trending/, weekly/, collections/)
    ├── next.config.ts
    └── tsconfig.json

## Component Pattern

Every section follows this 4-file pattern:

1. src/data/<name>.ts — mock data (typed)
2. src/types/film.ts — shared interfaces
3. src/components/ui/<Name>Card.tsx — card/item component
4. src/components/sections/<Name>Section.tsx — full section

When creating a new section, create all four files. Check existing ones first.

## Styling Rules

- Use Tailwind classes for everything; avoid inline style={} except for clamp() fluid typography
- Brand tokens (defined in globals.css @theme):
  - bg-brand-dark → #12100E
  - text-brand-light → #F2EEE9
  - text-brand-gold → #D2A66A
  - text-brand-muted → #9B8F84
- Fonts: font-oswald for headings/UI, font-manrope for body/quotes
- Section container: use the section-container utility class (defined in globals.css) — applies w-[94%] lg:w-[90%] xl:w-[83%] max-w-[1197px] mx-auto everywhere for consistency
- Heading style: uppercase font-oswald font-light text-[56px] leading-[64px] tracking-[0.06em]
- Dark background on all sections: bg-brand-dark

## "use client" Policy

Only add "use client" when the component genuinely needs hooks or browser events.
Prefer Server Components. If only a child needs interactivity, keep the parent as RSC.
Current client components: TrendingSection, FilmColumn, WeeklyFilmCard, CollectionCard

## Navigation Links

/films, /reviews, /lists, /threads, /community — linked in Header but not yet implemented.
Next route to scaffold: /films/[slug]

## Known Issues to Fix

- layout.tsx metadata still says "Create Next App" — needs project-specific title/description
- CollectionCard uses useRouter instead of <Link> — breaks right-click/cmd+click
- No responsive breakpoints — entire app is desktop-only
- Root lumires-front/package-lock.json is unused and causes Next.js build warnings
- server-only in package.json dependencies is unused

## Prompt Patterns for Repetitive Tasks

- New section: "Implement the [Name] section from Figma node [nodeId] — follow the 4-file section pattern in src/components/sections/"
- Make responsive: "Add sm/md/lg breakpoints to [component] — collapse nav to hamburger on mobile"
- New route: "Scaffold src/app/films/[slug]/page.tsx with a Server Component that accepts params"
- Fix image domain: "Add remotePatterns to next.config.ts for TMDB image domain image.tmdb.org"