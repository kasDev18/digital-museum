# Story 1.7: Build Shared Header & Footer Chrome

**Epic:** Epic 1 - Project Setup  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story

**As a** visitor  
**I want to** see consistent branding, navigation, and accessibility controls on every page  
**So that** the site feels like one cohesive exhibition, not three disconnected pages

## Acceptance Criteria

- [x] Shared header shows the "Artifacta" logo mark (the small circular/arc icon, a simplified version of the landing disc motif) plus the "Artifacta" wordmark, present on Landing, List, and Detail pages
- [x] Shared footer shows "Copyright ©2025 Artifacta" (left) and social icons for X/Twitter and YouTube (right), per the footer export
- [x] Footer includes a pill-shaped utility cluster with a dark/light theme toggle (moon icon) and font-size controls ("A+" / "A-")
- [x] Theme toggle switches the whole app between the dark-navy theme and a light variant, persisting the choice (e.g. localStorage)
- [x] Font-size controls scale body text up/down within reasonable bounds, applied globally (e.g. via a root CSS custom property or Tailwind text-scale class on `<html>`)
- [x] Header/footer are built as shared layout components (e.g. in the root or route-group layout) rather than duplicated per page
- [x] Social icon links are functional anchors (can point to placeholder URLs) and open in a new tab

## Technical Notes

- Logo asset: `Logo (1).png` (arc/sunburst icon) — `Logo.png` export is a blank/transparent placeholder, not usable as-is
- Dark navy is the _default_ theme (not an OS-preference opt-in), so Tailwind's built-in `dark:` variant (which targets `prefers-color-scheme`/a `.dark` class) is the wrong mechanism here. Story 1.2 already laid the foundation as an opt-in `.light` class on `<html>` (see `src/app/globals.css`) that overrides the `--background`/`--foreground` tokens — toggle it by adding/removing `.light`, and persist the choice to localStorage
- Font-size scaling can be a simple `--font-scale` CSS variable multiplied into base rem sizing, adjusted by the A+/A- buttons
- Keep this component tree in `/components/layout` (e.g. `SiteHeader`, `SiteFooter`) per the folder structure in Story 1.4

## Implementation Tasks

1. Create shared header component (SiteHeader) with logo and wordmark
2. Create shared footer component (SiteFooter) with copyright and social links
3. Implement theme toggle functionality with localStorage persistence
4. Implement font-size controls with global CSS variable scaling
5. Integrate header/footer into root layout for consistency across pages
6. Add proper accessibility attributes to controls
7. Test theme toggle persistence across page reloads
8. Test font-size scaling within reasonable bounds

## Dependencies

- Story 1.1: Initialize Next.js Project with App Router
- Story 1.2: Configure Tailwind CSS
- Story 1.4: Establish Project Folder Structure

## Blocked By

- Story 1.1: Initialize Next.js Project with App Router
- Story 1.2: Configure Tailwind CSS
- Story 1.4: Establish Project Folder Structure

## Blocking

- Story 2.1: Build Landing Page Static Layout
- Story 3.1: Create Artifact Thumbnail Component
- Story 5.1: Build Detail Page Layout

## Definition of Done

- [x] All acceptance criteria met
- [x] Header/footer components are reusable and shared across pages
- [x] Theme toggle persists across sessions
- [x] Font-size controls work globally
- [x] Code committed to repository
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-11
**Actual Implementation:**

- Added `src/components/ui/icons.tsx`: `XIcon`, `YoutubeIcon`, `ArtifactaWordmark`, `CopyrightMark`, `MoonIcon`, `DecreaseFontIcon`, `IncreaseFontIcon` — all real Figma exports provided mid-review (see below), no hand-drawn icons left in the final version — kept here (not in `layout/`) per the README's convention that `ui/` holds shared, page-agnostic primitives.
- Added `public/assets/logo-mark.svg` (the real Figma logo export) and `src/components/layout/site-header/index.tsx` (`SiteHeader`): logo mark (`next/image`, decorative `alt=""`) + `ArtifactaWordmark` (decorative), centered as a unit in the header, + a `sr-only` "Artifacta" span for the link's accessible name.
- Added `src/components/layout/site-footer/index.tsx` (`SiteFooter`): `CopyrightMark` (decorative, paired with a `sr-only` "Copyright ©2025 Artifacta" span — far left) and a right-hand group containing the X/YouTube social links (`target="_blank"` + `rel="noopener noreferrer"`) followed by the theme/font-size pill — matching the provided PSD reference (copyright left; social icons and the pill sit together on the right, in that left-to-right order, rather than the pill preceding the social icons).
- Added `src/components/layout/site-footer/components/theme-font-controls/index.tsx` (`ThemeFontControls`, client component): the theme toggle (`MoonIcon` — AC calls for a single static moon icon, not a sun/moon swap, so no separate light-mode icon) and font-size buttons in "A+" then "A-" order (`IncreaseFontIcon`/`DecreaseFontIcon`, matching the PSD), replacing literal "A-"/"A+" text. The pill is a fixed light `bg-cream` badge with fixed `text-navy` icons — deliberately _not_ theme-adaptive — since the PSD reference shows it as a constant light control cluster against either theme, not something that inverts with the toggle; buttons are 44px with 28px icons (bumped up twice from an initial 28px/16px pass per follow-up feedback that the controls read too small). State is seeded with lazy `useState(() => ...)` initializers reading the same `localStorage` keys the pre-hydration bootstrap script already applied to the DOM — the pattern Next.js's own guide prescribes for this exact problem (`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`, "Syncing with React state"), so React's first client render already agrees with the DOM without an effect-driven re-sync.
- **Styling architecture note:** `SiteHeader`, `SiteFooter`, and `ThemeFontControls` were restructured mid-review from inline Tailwind utility classes to co-located CSS Modules (`styles.module.css` per component, `@reference "tailwindcss"` + `@reference '<path>/globals.css'` + `@apply`), matching the pattern already established by `app/gsap-demo/components/gsap-scroll-demo` from Story 1.3 — every class was translated 1:1 (no visual changes from the refactor itself), and `ThemeFontControls` moved from a flat `site-footer/theme-font-controls.tsx` file into its own `site-footer/components/theme-font-controls/` folder (index.tsx + styles.module.css), consistent with the "folder + index.tsx + co-located CSS module" convention the README documents for multi-file components.
- Added `src/types/theme.ts`: the `Theme` type, per the README's convention that shared interfaces live in `types/`, not `lib/`.
- Added `src/lib/theme-script.ts`: shared constants (`THEME_STORAGE_KEY`, `FONT_SCALE_*`, `LIGHT_THEME_CLASS`), `clampFontScale` (clamps to bounds _and_ rounds to 2 decimals — repeatedly adding the 0.15 step accumulates IEEE-754 float error, e.g. `1 + 0.15×3 === 1.2999999999999998`, which would make the `>= FONT_SCALE_MAX` disabled-button check miss the true boundary by one click), `THEME_INIT_SCRIPT` (the `<head>` pre-hydration bootstrap script), and `CONTROLS_SYNC_SCRIPT` + three button-ID constants (see below).
- Updated `src/app/globals.css`: added the `--font-scale: 1` custom property to `:root` and `html { font-size: calc(16px * var(--font-scale)); }` — matches the Technical Notes' own suggested mechanism ("a simple `--font-scale` CSS variable multiplied into base rem sizing"), so every Tailwind `rem`-based size scales with it globally, not just prose.
- Updated `src/app/layout.tsx`: adds a `<head>` with the blocking inline bootstrap `<script>` (via `dangerouslySetInnerHTML`, `THEME_INIT_SCRIPT`), matching the Next.js flash-prevention guide's own root-layout example exactly (script in `<head>`, `suppressHydrationWarning` on `<html>`); `<body>` renders `SiteHeader`, then `{children}` inside a plain `<div className="flex flex-1 flex-col">` (not `<main>` — the existing pages already render their own `<main>`, so wrapping in another one would nest two `<main>` landmarks per document, an invalid-HTML/screen-reader-landmark bug a self-review pass caught), then `SiteFooter`.
- Removed the now-obsolete `src/components/layout/.gitkeep` and `src/components/ui/.gitkeep` placeholders now that both directories have real content (same pattern Story 1.5 used for `data/`/`types/`).
- **Hydration-mismatch fix (found via live dev-server testing, not `curl`):** a returning visitor with a saved _non-default_ theme/font-scale triggered a real React hydration warning — SSR always renders `disabled`/`aria-pressed`/`aria-label` assuming the default (no `window` on the server), but the client's lazy initializer computes the true stored value during hydration, so the two disagree for anyone who'd already changed a preference. `THEME_INIT_SCRIPT` couldn't fix this itself (it runs in `<head>`, before these buttons exist). Added `CONTROLS_SYNC_SCRIPT`, rendered as `ThemeFontControls`'s own last child (after the three buttons, each given a stable `id`), which reads the same `localStorage` keys and patches `aria-pressed`/`aria-label`/`disabled` via `getElementById` before hydration's comparison runs — extending the exact same "patch the DOM before React hydrates" mechanism `THEME_INIT_SCRIPT` already used, just relocated to run after the specific elements it needs exist. Rejected `suppressHydrationWarning` as the fix here: it would've left the wrong `disabled` state stuck (e.g. a maxed-out font size still showing an enabled "increase" button) until the user's next interaction elsewhere, since clicking an already-at-limit button clamps to the same value and React skips re-rendering on an unchanged primitive — a real, if narrow, correctness bug, not just console noise.
- Verified with `pnpm ts:check`, `pnpm lint`, `pnpm build` (all clean), and by inspecting the server-rendered HTML (`curl localhost:8084`) to confirm the bootstrap scripts, IDs, and header/footer/control markup (aria attributes, `target="_blank"`/`rel="noopener noreferrer"` on social links) render as expected. No headless browser was available in this environment to click-test the toggle/font-size interactions live — the hydration-mismatch bug above was in fact caught by the user running `pnpm dev` locally and sharing the terminal output, since it only manifests with a real `localStorage` value that `curl` can't simulate.
- **Self-review pass** (8 independent finder angles — correctness, removed-behavior, cross-file, reuse, simplification, efficiency, altitude, CLAUDE.md/Next-docs conventions — each candidate independently verified): the first implementation used a hand-rolled `useSyncExternalStore` pub-sub store instead of the simpler pattern Next's own docs prescribe, wrapped `{children}` in a second, nested `<main>`, placed the bootstrap script in `<body>` instead of `<head>`, located the `Theme` type outside `src/types/`, had the font-scale float-drift/disabled-boundary issue described above, and (as a UX-polish suggestion, not a defect) flagged the static moon-only toggle icon as potentially confusing once switched to light mode — that last point was addressed differently once real assets arrived: rather than add a hand-drawn sun icon, the real Figma export is used as a single static icon, matching the AC's literal "moon icon" (not a two-state swap) requirement. All other findings were fixed before commit; see the PR description for the full findings list.

**Resolved deviation from Technical Notes:** the Technical Notes call for a `Logo (1).png` asset that didn't exist anywhere in the repository at implementation time (confirmed via a repo-wide search). Initially shipped an inline SVG arc-mark approximation as a documented placeholder; the real Figma export (an SVG, not the referenced PNG) was provided mid-review and swapped in as `public/assets/logo-mark.svg` — `SiteHeader` now renders it via `next/image` instead of the placeholder, and the placeholder component was deleted.

**Real Figma assets swapped in (provided mid-review):** seven more exports were supplied in total —

- `Artifacta.svg` (wordmark logotype), `Copyright ©2025 Artifacta.svg` (copyright lockup), `Calque_1.svg` (YouTube icon), `Frame 93.svg` (X icon) — all hardcoded `fill`/`stroke` to `white` or `#EFEBE5` (cream).
- `Frame 19.svg`/`Frame 20.svg` (the A-/A+ font-size icons) and `Frame 22.svg` (the moon/theme-toggle icon) — hardcoded `stroke="#253143"` (navy) instead.

Both sets are single-theme-only colors — the cream/white set would vanish against the light theme's cream background, the navy set would vanish against the dark theme's navy background. Externally-referenced SVGs (`<img>`/`next/image`) can't inherit the page's `currentColor` either way, so instead of `<Image>` all seven were inlined as React components (`XIcon`, `YoutubeIcon`, `ArtifactaWordmark`, `CopyrightMark`, `MoonIcon`, `DecreaseFontIcon`, `IncreaseFontIcon` in `icons.tsx`) with the hardcoded colors replaced by `currentColor` — they now flip color automatically with the rest of the theme, from a single source of truth instead of two disagreeing hardcoded palettes. The wordmark/copyright SVGs are vector text standing in for real content, so each is marked `aria-hidden` and paired with a `sr-only` text twin carrying the actual string, rather than relying on the image alone for the accessible name. All seven raw export files were deleted from the repo root once their path data was captured in `icons.tsx`; `public/assets/logo-mark.svg` (the one genuinely multi-tone brand mark, not meant to invert per theme) is the only asset kept as a referenced file rather than inlined.

**Icon/asset optimization pass:** ran all 8 SVGs (7 inlined icons + `logo-mark.svg`) through `svgo --multipass`. Results: `logo-mark.svg` 4.3KB → 3.2KB (-27%); the inlined icons in `icons.tsx` collectively 50KB → 28KB (-44%) — the wordmark/copyright text lockups account for most of that, since svgo's `convertPathData` collapses long runs of near-collinear/near-circular Bézier segments (the original Figma export style) into shorter relative commands and native arc (`a`/`A`) syntax, plus trims float precision. One svgo default-preset regression required a manual fix: for `YoutubeIcon`, svgo's defs-cleanup removed the `<clipPath>` definition but left the `<g clip-path="url(#a)">` reference dangling. Checked the clip rect's dimensions (21.16×14.81) against the viewBox (22×15) and the path's own bounds — the clip was already a no-op (the path never extended past it) — so the fix was to drop the leftover group/clip-path wrapper entirely rather than trust a broken reference. Re-verified all 8 optimized assets render identically via `curl`-inspected server HTML before and after.

**Known limitation (out of scope for this story):** `src/app/page.tsx` is still the `create-next-app` scaffold placeholder — its `dark:` Tailwind classes follow `prefers-color-scheme`, not this story's `.light`-class theme toggle, so toggling the theme has no visible effect on that placeholder content. Story 2.1 (Build Landing Page Static Layout) replaces this file entirely, at which point its markup will use the same `--background`/`--foreground` tokens the header/footer already do.

**Verification:**

- ✅ Shared header shows the "Artifacta" logo mark plus wordmark
- ✅ Shared footer shows copyright and social icons
- ✅ Footer includes theme toggle and font-size controls
- ✅ Theme toggle switches between dark/light themes with persistence (`localStorage`, applied pre-hydration)
- ✅ Font-size controls scale body text globally (`--font-scale` custom property, clamped 0.85–1.3)
- ✅ Header/footer are built as shared layout components (root `layout.tsx`, not duplicated per page)
- ✅ Social icon links are functional anchors, open in a new tab
