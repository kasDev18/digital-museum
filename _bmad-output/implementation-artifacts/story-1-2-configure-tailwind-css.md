# Story 1.2: Configure Tailwind CSS

**Epic:** Epic 1 - Project Setup  
**Status:** Done  
**Priority:** High  
**Story Points:** 2

## User Story
**As a** developer  
**I want to** configure Tailwind CSS with custom design tokens  
**So that** I can efficiently match the Figma design specifications

## Acceptance Criteria
- [x] Tailwind CSS is properly installed and configured
- [x] Custom colors and fonts from Figma are defined as Tailwind theme tokens (via CSS `@theme`, the Tailwind v4 equivalent of `tailwind.config.js` — see Implementation Note)
- [x] Google Fonts **Patua One** (display/headings) and **Playfair Display** (body/serif) are loaded via `next/font/google` and mapped to Tailwind font families
- [x] Dark navy background / cream foreground palette (per Figma) is defined as Tailwind theme colors, with tokens for a light-theme variant to support the footer's theme toggle
- [x] Design tokens are extensible for future updates
- [x] Tailwind directives are properly imported in global CSS
- [x] PostCSS configuration is set up correctly

## Technical Notes
- Extract color palette, typography scale, and spacing system from Figma
- Set up custom theme extension in tailwind.config.js
- Configure font families if custom fonts are used in design

## Implementation Tasks
1. Analyze Figma designs for color palette, typography, and spacing
2. Extract design tokens and create custom theme in tailwind.config.js
3. Configure custom colors, fonts, and spacing
4. Ensure Tailwind directives are imported in globals.css
5. Verify PostCSS configuration
6. Test configuration with sample styled components

## Dependencies
- Story 1.1: Initialize Next.js Project with App Router

## Blocked By
- Story 1.1: Initialize Next.js Project with App Router

## Blocking
- Story 2.1: Build Landing Page Static Layout
- Story 3.1: Create Artifact Thumbnail Component

## Definition of Done
- [x] All acceptance criteria met
- [x] Tailwind configuration matches Figma design tokens
- [x] Code committed to repository
- [x] No console errors or warnings

## Implementation Note: no `tailwind.config.js`
This project is on **Tailwind CSS v4**, which replaced the JS config file with a CSS-first `@theme` block (see `node_modules/next/dist/docs` — this Next.js/Tailwind combo has breaking changes vs. older training data). There is no `tailwind.config.js` in this repo, by design. Design tokens are defined in `src/app/globals.css` inside `@theme inline { ... }`, which is the v4-native way to extend Tailwind's theme and is what the rest of the codebase already used for `background`/`foreground`. Acceptance criteria referencing `tailwind.config.js` are satisfied via this file instead.

## Implementation Summary
**Status:** ✅ Done
**Implementation Date:** 2026-07-11
**Actual Implementation:**
- Colors sampled directly from the exported Figma assets (`digital-museum/PAGES.png`, `footer.png`, `CTA.png`) with a pixel-sampling script to get exact hex values rather than guessing:
  - `--navy-900: #253143` (primary dark background)
  - `--navy-800: #2f3c52` (elevated panels/cards)
  - `--cream-100: #efebe5` (foreground text/cards)
  - `--cream-200: #cfc9be` (muted foreground)
- Defined in `src/app/globals.css` as semantic tokens (`--background`, `--background-elevated`, `--foreground`, `--foreground-muted`) that default to the dark navy/cream theme, with a `:root.light` override block providing the light-theme variant for the header/footer toggle (Story 1.7 will implement the actual JS toggle that adds the `.light` class).
- Mapped into Tailwind via `@theme inline`, exposing `bg-background`, `bg-background-elevated`, `text-foreground`, `text-foreground-muted`, plus static `bg-navy` / `bg-cream` utilities.
- Added `src/app/fonts.ts` loading **Patua One** (400, non-variable) and **Playfair Display** (variable) via `next/font/google`, each exposing a CSS variable (`--font-patua-one`, `--font-playfair-display`).
- Wired those variables into Tailwind as `font-display` (Patua One) and `font-serif` (Playfair Display) utility families; `body` defaults to `font-serif` per the "body/serif" design intent.
- Removed the default Geist font wiring in `layout.tsx`/`globals.css` (no longer used) and the OS `prefers-color-scheme` media query (theme is now an explicit toggle, not OS-driven).
- Verified with `pnpm build`: fonts self-host correctly (found `Patua`/`Playfair` `@font-face` rules and `--color-navy`/`--font-display` tokens in the compiled CSS output), `pnpm ts:check` and `pnpm lint` pass clean.

**Verification:**
- ✅ Tailwind CSS is properly installed and configured
- ✅ Design tokens are extensible for future updates
- ✅ Tailwind directives are properly imported in global CSS
- ✅ PostCSS configuration is set up correctly
- ✅ Custom colors and fonts from Figma are defined as Tailwind theme tokens (CSS `@theme`, v4-native equivalent of `tailwind.config.js`)
- ✅ Google Fonts loaded and mapped to Tailwind font families (`font-display`, `font-serif`)
- ✅ Dark navy background / cream foreground palette defined as Tailwind theme colors, with a light-theme variant
