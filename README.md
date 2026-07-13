# Artifacta - Digital Museum Website

A modern digital museum experience showcasing cultural artifacts with rich multimedia content, migration stories, and interactive animations. Built with Next.js 16, Tailwind CSS, and GSAP.

**Tagline:** "Objects, Voices and Global Journeys"

## 🌟 Project Overview

Artifacta is a digital museum platform that presents cultural artifacts through:

- **Landing Page** - Immersive introduction with smooth animations
- **List Page** - Browseable gallery with category filtering and multiple view modes
- **Detail Page** - Rich artifact presentations with audio, PDFs, migration journeys, and contributor stories

The application focuses on the migration narratives behind cultural objects, featuring:

- 12 curated artifacts from diverse cultures
- 7 categories: Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable
- Migration journey visualizations showing artifact movement across countries
- Contributor stories and quotes
- Dark/light theme switching with accessibility controls

## 🛠 Tech Stack

- **Framework:** Next.js 16.2.10 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP with ScrollTrigger
- **Language:** TypeScript 5
- **Package Manager:** pnpm
- **Code Quality:** ESLint 9, Prettier 3.9
- **Fonts:** Google Fonts (Patua One, Playfair Display)

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** >= 20.x
- **pnpm** >= 8.x (recommended package manager)
- **Git** (for version control)

## 🚀 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd digital-museum
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```
   The application will be available at [http://localhost:8084](http://localhost:8084)

## 🎯 Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 8084
pnpm dev:turbo        # Start with Turbopack for faster builds

# Building
pnpm build            # Build for production (runs lint first)
pnpm start            # Start production server on port 8084

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues automatically
pnpm lint:next        # Run Next.js specific linting

pnpm format           # Check code formatting with Prettier
pnpm format:fix       # Fix formatting issues automatically

# Type Checking
pnpm ts:check         # Run TypeScript type checking
pnpm ts:watch         # Watch mode for type checking

# All Checks
pnpm check            # Run lint, type check, and format check
```

## 📁 Project Structure

```
digital-museum/
├── src/
│   ├── app/                     # Next.js App Router — routing + page-specific components
│   │   ├── layout.tsx           # Root layout (fonts, metadata, theme providers)
│   │   ├── page.tsx             # `/` route
│   │   ├── fonts.ts             # next/font/google definitions (Patua One, Playfair Display)
│   │   ├── landing/             # Landing page route segment (Epic 2)
│   │   │   └── components/      # Landing-only components, colocated (not routable)
│   │   ├── list/                # List/gallery page route segment (Epic 3/4)
│   │   │   └── components/      # List-only components, colocated (not routable)
│   │   ├── detail/              # Artifact detail page route segment (Epic 5)
│   │   │   └── components/      # Detail-only components, colocated (not routable)
│   │   └── gsap-demo/           # GSAP + ScrollTrigger setup smoke-test route
│   │       └── components/      # e.g. gsap-scroll-demo, colocated (demo-only)
│   ├── components/              # Components shared across more than one page
│   │   ├── layout/               # Shared chrome — SiteHeader, SiteFooter (Story 1.7)
│   │   └── ui/                   # Shared, page-agnostic primitives — icons.tsx (Story 1.7)
│   ├── data/                    # Mock data — `mock-data.ts` (Story 1.5): 12 artifacts
│   ├── lib/                     # Shared utilities: gsap-utils.ts, utils.ts, data-utils.ts (Story 1.5), theme-script.ts (Story 1.7)
│   └── types/                   # Shared TypeScript interfaces — artifact.ts (Story 1.5), theme.ts (Story 1.7)
├── public/                      # Static assets, organized by type
│   ├── images/                  # Photography/artwork (artifact imagery — referenced by mock data, added in a later story)
│   └── assets/                  # Icons and other non-photographic static assets
├── docs/                        # Additional documentation (e.g. GSAP performance guide)
├── .github/                     # GitHub workflows and configurations
├── AGENTS.md                    # AI agent guidelines
├── EPICS_AND_STORIES.md         # Detailed project specifications
├── CLAUDE.md                    # Claude-specific rules
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
├── prettier.config.mjs          # Prettier configuration
└── postcss.config.mjs           # PostCSS configuration
```

### Conventions

- **Page-specific components are colocated in `app/`.** Each route segment that needs its own components gets a `components/` subfolder next to its `page.tsx` (e.g. `app/landing/components/`, `app/gsap-demo/components/gsap-scroll-demo/`). A bare `components` folder has no special Next.js filename inside it, so it's never routable — it's purely an implementation detail of that route.
- **`src/components` is reserved for components shared across more than one page** — the site-wide chrome (`layout/`, e.g. `SiteHeader`/`SiteFooter` from Story 1.7) and generic, page-agnostic UI primitives (`ui/`, e.g. buttons, form controls). If a component is only ever used by one page, it belongs under that page's `app/<route>/components/`, not here.
- Multi-file components use a folder with an `index.tsx` (see `app/gsap-demo/components/gsap-scroll-demo` for the pattern) plus a co-located CSS module when custom styles are needed.
- **`data/` vs `lib/`:** `data/` holds the static mock content itself (e.g. `mock-data.ts`); `lib/` holds the utilities that operate on it (e.g. `data-utils.ts`) alongside other shared helpers (`gsap-utils.ts`, `utils.ts`).
- **`types/`** holds shared interfaces consumed across pages/components (e.g. `Artifact`). Component-local prop types stay next to the component.
- **`public/`** is split by asset type: `images/` for photographic/artifact media, `assets/` for icons and other static files. Reference them with an absolute path from the public root (e.g. `/assets/vercel.svg`).
- Currently-empty directories are kept in version control with a `.gitkeep` placeholder until their first real file lands in a later story.

## 🎨 Design System

### Color Palette

- **Primary:** Dark navy background (`#1a2744` range)
- **Secondary:** Cream/off-white foreground
- **Accents:** Warm tones from artifact photography
- **Theme:** Dark/light mode support with class-based switching

### Typography

- **Display/Headings:** Patua One (Google Fonts)
- **Body/Serif:** Playfair Display (Google Fonts)
- **Font Utilities:** `font-display`, `font-serif` in Tailwind

### Component Architecture

- Shared header/footer chrome with logo and theme controls
- Reusable UI components in `/components/ui`
- Feature-specific components organized by page
- GSAP animation utilities for scroll-based effects

## 🔧 Configuration Files

- **next.config.ts** - Next.js configuration
- **tsconfig.json** - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- **src/app/globals.css** - Tailwind v4 theme config (`@theme inline { ... }`); this project has no `tailwind.config.js` — see [Story 1.2's implementation note](./_bmad-output/implementation-artifacts/story-1-2-configure-tailwind-css.md#implementation-note-no-tailwindconfigjs)
- **eslint.config.mjs** - ESLint rules (Next.js + TypeScript)
- **prettier.config.mjs** - Prettier formatting rules
- **postcss.config.mjs** - PostCSS configuration for Tailwind

## 📊 Data Model

Artifacts follow this TypeScript interface:

```typescript
interface Artifact {
  id: string
  title: string
  type:
    'Architectural' | 'Ceremonial' | 'Decorative' | 'Musical' | 'Playful' | 'Useable' | 'Wearable'
  thumbnail: string
  media: string[]
  description: string
  contributor?: {
    name: string
    quote: string
    story?: string
  }
  audioUrl: string | null
  audioDurationSeconds?: number
  pdfUrl: string | null
  journey?: {
    country: string
    flag: string
  }[]
}
```

The 7 categories live in a single source of truth, `ARTIFACT_TYPES` (`src/types/artifact.ts`), and `ArtifactType` is derived from it (`(typeof ARTIFACT_TYPES)[number]`) — adding an 8th category later is a one-line change instead of updating a union type in multiple places.

### Mock Data & Data Utilities

- **`src/data/mock-data.ts`** exports `mockArtifacts`: all 12 real artifacts from the Figma board (Wooden Chest, Vyshyvanka, Carnival Mask, Beaded Gown, Mshatta Façade, Lei Po'o, Tatreez Thobe, Mbira, Minbar, Bamboo Pen, Backgammon Board, Jamdani), covering all 7 categories.
- **`src/lib/data-utils.ts`** exposes the functions pages/components should use instead of importing `mockArtifacts` directly:
  - `getAllArtifacts()` — every artifact.
  - `getArtifactById(id)` — a single artifact, or `undefined` if not found.
  - `getArtifactsByType(type = "All Objects")` — filters by category; the default (or the `ALL_OBJECTS_FILTER` sentinel) returns everything, matching the list page's "no filter" state (Story 4.2).
  - `getArtifactCategories()` — `["All Objects", ...ARTIFACT_TYPES]` (also exported as the `ARTIFACT_CATEGORIES` constant), ready to render the category filter bar.
- `audioUrl`/`pdfUrl` are non-optional in the `Artifact` type — always a path or explicit `null`, never omitted — so consuming UI can check them directly without an `in` guard; `journey` and `contributor` are populated on all 12 artifacts in this dataset.

### Shared Chrome, Theme & Font-Size Controls (Story 1.7)

- **`src/components/layout/site-header`** (`SiteHeader`) and **`site-footer`** (`SiteFooter`, plus `ThemeFontControls` in `site-footer/components/theme-font-controls`) render on every route from the root layout (`src/app/layout.tsx`) — never duplicated per page. Each is styled with a co-located CSS Module (`styles.module.css`, `@apply` under `@reference "tailwindcss"` + `globals.css`) rather than inline utility classes, per this file's own "Multi-file components" convention above.
- **Theme:** dark navy is the default; toggling adds/removes the `.light` class on `<html>` (the opt-in variant Story 1.2 already defined in `globals.css`), persisted to `localStorage`. The footer's utility pill itself is a fixed light (`cream`/`navy`) badge regardless of theme, by design — it doesn't invert with the toggle.
- **Font size:** the "A+"/"A-" controls adjust a `--font-scale` CSS custom property (clamped 0.85–1.3, `src/lib/theme-script.ts`) multiplied into `html`'s base `font-size`, so all of Tailwind's `rem`-based sizing scales with it — also persisted to `localStorage`.
- **No flash on load:** a small inline `<script>` in `<head>` (`THEME_INIT_SCRIPT`) reads both `localStorage` keys and applies them before first paint. `ThemeFontControls` seeds its React state with lazy `useState` initializers reading the same keys, per the [Next.js guide on preventing a flash before hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) — the two always agree, so no `useEffect`-driven re-sync is needed. A second script, `CONTROLS_SYNC_SCRIPT`, is rendered inside `ThemeFontControls` itself (after its buttons, each given a stable `id`) to patch `disabled`/`aria-pressed`/`aria-label` for returning visitors with a saved non-default preference — those attributes aren't touched by `THEME_INIT_SCRIPT` (which runs in `<head>`, before the buttons exist), so without this second patch a returning visitor would hit a real hydration mismatch.

### Landing Page Hero & Disc Rings (Story 2.1)

- **`src/app/landing/components/landing-hero`** (`LandingHero`) is rendered by the `/` route (`src/app/page.tsx`) — the site's homepage. It's colocated under `app/landing/` per this file's own routing convention even though the routable `page.tsx` stays at the app root.
- **Disc artwork:** built from three Figma-exported SVG groups — `public/assets/disc-ring-{blue-tile,floral,stone}.svg` (the design's "Mask group 1/2/3" layers) — rather than the flat `DISC.png` composite, for cleaner vector-masked edges. Each export is tightly cropped to its own bounding box with no positional metadata, so `landing-hero/index.tsx`'s `DISC_GROUPS` placement (`x`/`y`/`width`/`height`, expressed as percentages of the shared 1379x1393 canvas) was recovered by pixel-aligning each export against the full `DISC.png` render. These three groups are the design's texture clusters, not full concentric rings — Story 2.2 (independent per-ring rotation) will likely need its own re-slicing across these groups rather than reusing `DISC_GROUPS` directly. The original Figma exports (including an alternate, richer `Frame 141.svg` full-disc composition that wasn't used here) are kept at the repo root rather than deleted.
- **Legibility scrim:** a soft radial gradient behind the text stack (`LandingHero_content::before`, driven by the theme `--background` variable) keeps the headline/subtext/CTA readable over the ring pattern at every breakpoint — most necessary on narrow mobile widths, where the disc's empty center is smaller than the text block. It's theme-aware and sized off the content box itself, not a fixed per-breakpoint value.
- **CTA button:** renders as a styled, non-navigating `<button>` — wiring it to the List page (and its filled/outline hover states) is Story 2.4's scope, and the `/list` route has no page yet (Epic 3).

### Artifact Thumbnail Component (Story 3.1)

- **`src/app/list/components/artifact-thumbnail`** (`ArtifactThumbnail`) is the shared building block for the List page's Grid (Story 3.2) and List (Story 3.3) views — both view-modes of the single `/list` route (switched via Story 3.4's React state, not separate routes), which is why it's colocated under `app/list/` rather than `src/components/` per this file's own "page-specific vs. shared" convention.
- **Props:** `artifact: Artifact`, `variant: 'grid' | 'list'`, plus optional `onClick(id)` (a side-effect hook that can't cancel navigation), `priority` (threaded to `next/image` for above-the-fold instances), and `className`.
- **Grid variant** is a single `next/link` to `/detail/[id]` wrapping a 400×280 (10:7) image + title caption — corrected from an initially-assumed square image during Story 3.2's Figma fidelity pass; see that story's Implementation Summary. **List variant** renders a square image/title plus a real, independently-focusable "Explore Story" link, with an additional invisible full-row "stretched link" sibling (`aria-hidden`, `tabIndex={-1}`) so the whole row is clickable too — without nesting an `<a>` inside an `<a>` (invalid HTML) and without giving keyboard/screen-reader users two competing links per row.
- **Loading/error state:** a CSS checkerboard skeleton (matching the Figma `Thumbnail.png` export) shows while the image loads, and stays up on load error. All 12 mock artifacts now have a real thumbnail image in `public/images/artifacts/<id>/thumbnail.jpg` (optimized JPEGs, ~15-59KB each, converted from designer-provided 400×280 PNGs — see `_bmad-output/implementation-artifacts/story-3-2-build-grid-view-layout.md`), so the skeleton now only briefly shows during load rather than staying up permanently. The `media` (detail-page carousel) array is now partially backed too (same conversion approach as the thumbnails — resized/compressed JPEGs from designer-provided crops): `1.jpg` for all 12 artifacts, plus `2.jpg` for 7 of them. The remaining `2.jpg`/`3.jpg` slots and every `audioUrl` remain unbacked (see `_bmad-output/implementation-artifacts/deferred-work.md`).
- **`/detail/[id]` renders the full Epic 5 layout** (`DetailPageContent`, Stories 5.1/5.2 — see the Detail Page section below) rather than Story 3.5's original placeholder. An unknown id still falls through to the site's own chrome-complete `not-found.tsx`.

### List Page — Grid & List Views (Stories 3.2/3.3)

- **`src/app/list/page.tsx`** is the List page route — previously non-existent, so the landing page's "Enter Exhibition" CTA 404'd until this story landed. It renders **`ArtifactGrid`** (`src/app/list/components/artifact-grid`) by default, matching `Gallery.png`'s primary desktop mockup.
- **`ArtifactGrid` (Story 3.2):** a dense, oversized canvas of `ArtifactThumbnail` (`variant="grid"`) cards, laid out as rows (`ArtifactGridRow`, cycling a `[5, 4, 3]` items-per-row pattern — sums to exactly the 12-artifact mock dataset, Story 1.5, with every artifact appearing once) rather than a uniform CSS Grid — matching a Figma dev-mode export of the actual "Gallery" frame, whose rows are genuinely different widths. Each row pans horizontally **independently** via click-and-drag (mouse) or touch swipe, driven by `useDragPan` (`src/app/list/components/artifact-grid/use-drag-pan.ts`) — `overflow: hidden` with a manually transformed track, not native `overflow-x` scroll, so there's no scrollbar at all (rather than one hidden via CSS) and the track can stay centered without losing reach to its own left-hand overflow (a native scroll container can't reach negative `scrollLeft`). The canvas's vertical overflow is just the page's native scroll, same mechanism the List view uses. The grid variant's thumbnail image is 400×280 (a 10:7 rectangle, not square) with a 16px radius and a 22px/18px Playfair Display caption at desktop — both scoped to `ArtifactThumbnail`'s `.ArtifactThumbnail_grid` rules (Story 3.1) so the List variant's own square thumbnail is unaffected. Cards fade/slide in as they scroll into view, and fade/slide out before navigating to a Detail page (see Animation Strategy below).
- **`ArtifactList` (Story 3.3):** `src/app/list/components/artifact-list` — a vertical stack of `ArtifactThumbnail` (`variant="list"`) rows with native page scroll (no drag/pan, per this story's own Technical Notes), with the same scroll-reveal and exit-animation treatment as the Grid view. Fully built and manually verified, but not yet wired into the route — rendering it conditionally alongside `ArtifactGrid` is Story 3.4's charter (the `ViewMode` client-state pill toggle).
- **`ListEmptyState`** (`src/app/list/components/list-empty-state`) is the shared "no artifacts" fallback both views render when the array is empty — distinct from Story 4.3's later filtered-empty-state (no results for a category).
- **`ListBackground`** (`src/app/list/components/list-background`) is a decorative, fixed-position backdrop built from a vector Figma export (`public/assets/list-background-arcs.svg` — three arc/swoosh shapes) that already bakes in its own cream tint and low opacity, so it's rendered as-is with no CSS recoloring — distinct from the landing page's warm, naturally-colored disc rings (`LandingHeroDisc`). Sized mobile-first, matching `LandingHeroDisc`'s own scale-up-with-breakpoint convention.
- See `_bmad-output/implementation-artifacts/deferred-work.md` for known, accepted gaps.

### List Page — Interaction, Filtering & Mobile (Epic 4)

- **`ListPageContent`** (`src/app/list/components/list-page-content`) owns the List page's `ViewMode` (Story 3.4) and category-`filter` state as sibling `useState`s, rendering **`CategoryFilter`** (`src/app/list/components/category-filter`, Story 4.2) and the `ViewSwitcher` pill above whichever view is active. The active view remounts on either state changing (`key={viewMode}-{category}`), crossfading via a reduced-motion-gated `fadeIn`.
- **Drag/pan (Story 4.1):** each `ArtifactGridRow` pans independently via `useDragPan` — a manually transformed track, not native scroll. `useDragPan` supports two physics via its `infinite` option, threaded down from `ListPageContent` as `category === ALL_OBJECTS_FILTER`: the unfiltered "All Objects" grid drags genuinely infinitely — the row tiles 7 back-to-back copies of its own artifacts, and the hook wraps the drag offset seamlessly through them (imperceptibly, since the content repeats exactly every tile) so there's always more to drag in either direction regardless of monitor size, verified up to 5120px (5K) viewport widths — while any category filter instead renders exactly one real copy of its (possibly very few) artifacts with the original rubber-band-bounds-and-spring-back behavior, since tiling a couple of artifacts to fill an "infinite" canvas would read as an obvious, broken-looking loop rather than a large collection. A fast release keeps coasting via a lightweight momentum tween in both modes instead of stopping dead. A cursor-following `DragBadge` (mouse/pen only) shows an idle "Drag" badge on hover and an active hand-icon while dragging, per the Figma `drag icon.png` export. In infinite mode, only one of the 7 tiled copies is a real, keyboard/screen-reader-reachable set of links (the rest are `aria-hidden` + removed from the tab order) — every copy stays fully mouse/touch-clickable regardless.
- **Category filtering (Story 4.2):** `ARTIFACT_CATEGORIES` (`"All Objects"` + the 7 real types, `src/lib/data-utils.ts`) renders as a pill bar; selecting one re-filters `artifacts` via `filterArtifactsByType` and remounts the active view so each row's drag-pan offset doesn't carry over onto now-narrower content.
- **Filtered empty state (Story 4.3):** if the active category filters the dataset to zero artifacts, **`ListFilteredEmptyState`** (`src/app/list/components/list-filtered-empty-state`) renders in place of whichever view is active — naming the category, suggesting a different one, and offering a "View all objects" action that clears the filter. Distinct from `ListEmptyState` (Stories 3.2/3.3), which still covers only the unrelated "the underlying artifact array itself is empty" case.
- **State persistence across views and navigation (Story 4.4):** `viewMode`/`category` living as siblings already means toggling Grid⇄List keeps the active filter for free. Both are also synced to `sessionStorage`, so leaving the List page entirely (e.g. into a Detail page and back via "Back to Gallery") restores the same view/filter instead of reverting to the Grid/All-Objects default. Restoration happens in a `useEffect` (not a lazy `useState` initializer) so the server-rendered/first-client-render output always matches the default and hydration never mismatches. An explicit Grid⇄List toggle also resets the page's scroll position to the top, since the two layouts don't share a scroll position that means the same thing.
- **Touch/mobile optimization (Story 4.5):** Pointer Events already cover mouse, touch, and pen through `useDragPan`'s one code path (no separate touch handlers needed), with `touch-pan-y` on each row letting native vertical page scroll pass through while horizontal drags are captured by the pointer handlers. This pass added: a 44px-minimum touch target on `CategoryFilter`'s pill buttons (previously ~36px); `touch-action: manipulation` + a transparent tap-highlight on the filter bar and `ViewSwitcher` for snappier, flash-free taps; a subtle `opacity` dip on a row while dragging (visible feedback for touch, not just the mouse-only grab/grabbing cursor — `opacity`, not `filter`, so it doesn't add per-frame compositing cost to the same drag's continuous `transform` writes); and a best-effort `navigator.vibrate` haptic tick when a drag engages, feature-detected so it's a no-op on iOS Safari.
- See `_bmad-output/implementation-artifacts/deferred-work.md` for known, accepted gaps from this epic (e.g. duplicated `prefers-reduced-motion` checks and CTA-button styles across unrelated components, not yet extracted into shared helpers).

### Detail Page — Layout & Media Carousel (Epic 5, Stories 5.1/5.2, stretch scope)

- **`DetailPageContent`** (`src/app/detail/components/detail-page-content`) is rendered by `src/app/detail/[id]/page.tsx` and supersedes Story 3.5's `DetailPlaceholder` stopgap. A two-column CSS Grid on desktop (media left, text right) collapses to a single column (media stacked above text) below the `lg` breakpoint, matching the Mshatta Façade detail mock. Content order follows the story's own AC: title → divider → "Contributed by [Name]" → divider → italicized pull-quote → audio player → factual description paragraph → the contributor's personal/migration narrative paragraph. The entire contributor block is conditionally rendered (`artifact.contributor && (...)`) so an artifact without one still renders cleanly — not reachable with the current 12-artifact dataset (all have a contributor), but the type keeps the field optional.
- **`DetailToolbar`** (`src/app/detail/components/detail-toolbar`): "All Objects" (a plain link back to `/list` — no query-param round trip, since Story 4.4's `sessionStorage` restore already covers "return to the same filter/view" for any full unmount, a Detail page visit included) and "Next story" (the next artifact in the mock dataset's own order, wrapping around at the end, via `getNextArtifact` in `src/lib/data-utils.ts` — reuses `ExploreStoryArrowIcon`, already the site's "advance to the next thing" affordance from `ArtifactThumbnail`'s own "Explore Story" link).
- **`MediaCarousel`** (`src/app/detail/components/media-carousel`, Story 5.2): a single active slide inside an `overflow: hidden` frame, advanced via a CSS `transform`-driven track. Four independent ways to change slides — the "More Images" button (bottom-right, per the mock's downward-chevron treatment), clickable dot indicators (also the current-slide indicator), `ArrowLeft`/`ArrowRight` keys while focused, and touch swipe — all wrapping at both ends. Single-item media (e.g. the Bamboo Pen) hides the "More Images" button and dots entirely rather than showing controls with nothing to advance to. A failed image load (see the unbacked-assets note above) hides behind the frame's own background instead of a broken-image icon, matching `ArtifactThumbnail`'s existing `onError` convention.
- **`AudioPlayer`** (`src/app/detail/components/audio-player`): a deliberately minimal stand-in for Story 5.3's own fuller scope, built because Story 5.1's own AC requires an audio player to appear in the layout regardless. Native HTML5 `<audio>`, a play/pause toggle, a real seekable `<input type="range">` progress bar, and `m:ss / m:ss` elapsed/total labels. `audioUrl: null` renders a visually-present but disabled state rather than being omitted. The mock's exact tick-mark waveform scrubber and mute toggle are Story 5.3's own scope — see `deferred-work.md`.
- See `_bmad-output/implementation-artifacts/deferred-work.md` for the full list of known, accepted gaps from this pass (the Story 5.3 boundary, the still-unbacked media/audio assets, and the "Next story" ignoring an active List page category filter by design).

## 🎬 Animation Strategy

- **GSAP Core:** For timeline-based animations
- **ScrollTrigger:** For scroll-based animations
- **Performance:** GPU acceleration with `will-change` and transforms
- **Cleanup:** Proper GSAP context management for component unmounting
- **Setup:** `gsap`, `ScrollTrigger`, and the `useGSAP` hook (`@gsap/react`) are registered once in `src/lib/gsap-utils.ts` — always import them from there, not directly from `gsap`/`@gsap/react`
- **`useScrollReveal(scope, selector)`** (`src/lib/gsap-utils.ts`): a shared hook for revealing many similar elements as they scroll into view (fade + slide-up via `ScrollTrigger.batch()`) — used by `ArtifactGrid`/`ArtifactList` (Stories 3.2/3.3) to reveal artifact thumbnails, per `docs/gsap-performance.md`'s "Batching many similar triggers" guidance. Reach for this instead of a one-off `ScrollTrigger` setup whenever revealing a list/grid of repeated elements.
- **`useExitFadeNavigation(scope, revealSelector)`** (`src/lib/gsap-utils.ts`): the List page's equivalent of `LandingHero`'s own click-triggered exit animation — intercepts a click on any `<a href="/detail/...">` inside `scope`, fades/slides matching elements out, then navigates once settled. Must be wired to a container's `onClickCapture`, not `onClick` — `next/link` attaches its own `onClick` directly to the anchor and navigates immediately unless the event is already `defaultPrevented` by the time that handler runs; a capture-phase listener (root-to-target) runs _before_ the anchor's own listener, so `stopPropagation()` there is what actually stops `next/link` from taking over. A bubble-phase listener on an ancestor fires _after_ the anchor's own (target-to-root order) and is too late.
- **Reference:** See [`docs/gsap-performance.md`](./docs/gsap-performance.md) for the full performance/usage guide, and visit `/gsap-demo` in dev for a working ScrollTrigger example (`src/components/gsap-scroll-demo/index.tsx`)

## 🧪 Development Workflow

1. **Feature Development:** Create components in appropriate directories
2. **Type Safety:** Run `pnpm ts:check` during development
3. **Code Quality:** Run `pnpm lint` and `pnpm format` before commits
4. **Testing:** Use `pnpm check` to run all quality checks
5. **Building:** Test production builds with `pnpm build`

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js
3. Configure build settings:
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

### Other Platforms

Ensure the platform supports:

- Node.js 20+
- pnpm or convert to npm/yarn
- Static site generation or server-side rendering

## 📚 Documentation

- **[EPICS_AND_STORIES.md](./EPICS_AND_STORIES.md)** - Detailed project specifications and user stories
- **[AGENTS.md](./AGENTS.md)** - AI agent development guidelines
- **[docs/gsap-performance.md](./docs/gsap-performance.md)** - GSAP setup, context management, and performance guidelines
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Styling documentation
- **[GSAP Docs](https://greensock.com/docs/)** - Animation documentation

## 🤝 Contributing

1. Follow the existing code structure and conventions
2. Run `pnpm check` before committing
3. Use TypeScript for all new code
4. Follow the component architecture patterns
5. Test animations for performance

## 📝 License

[Specify your license here]

## 🎯 Project Status

- **Current Phase:** Development
- **Deadline:** July 15, 2026
- **Priority:** Landing Page & List Page (Required), Details Page (Optional/Stretch)
- **Details Page:** Stories 5.1 (layout) and 5.2 (media carousel) done; 5.3-5.8 (audio player fidelity, zoom, download, comment, migration journey, responsive polish) remain stretch scope
- **Branch:** `docs/add-bmad-stories`

---

**Built with ❤️ using Next.js, Tailwind CSS, and GSAP**
