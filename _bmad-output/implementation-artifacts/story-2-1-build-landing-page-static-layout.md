# Story 2.1: Build Landing Page Static Layout

**Epic:** Epic 2 - Landing Page  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story

**As a** visitor  
**I want to** see a beautifully designed landing page matching the Figma specifications  
**So that** I get a strong first impression of the digital museum experience

## Acceptance Criteria

- [x] Hero section with headline, subtext, and CTA button matches Figma spacing and typography
- [x] Logo placement matches Figma specifications (Story 1.7 shared header, unchanged)
- [x] Footer matches Figma design and content (Story 1.7 shared footer, unchanged)
- [x] Background disc/orb graphic is positioned correctly
- [x] All text content is responsive and readable across breakpoints
- [x] Colors, fonts, and spacing match Figma within reasonable pixel tolerance
- [x] Layout is fully responsive (desktop, tablet, mobile)

## Technical Notes

- Use Tailwind classes for layout and styling
- Reference Figma for exact spacing, typography, and color values
- Implement responsive breakpoints: desktop (default), tablet (md), mobile (sm)
- Ensure high fidelity at desktop breakpoint as primary target

## Implementation Tasks

1. [x] Create landing page route structure in /app
2. [x] Build hero section with headline, subtext, and CTA button
3. [x] Position logo according to Figma specifications (unchanged, Story 1.7)
4. [x] Create footer matching Figma design (unchanged, Story 1.7)
5. [x] Position background disc/orb graphic
6. [x] Implement responsive breakpoints for all elements
7. [x] Verify fidelity against Figma design
8. [x] Test responsiveness across desktop, tablet, and mobile

## Implementation Notes

- `src/app/page.tsx` (the `/` route) now renders `LandingHero`, colocated at
  `src/app/landing/components/landing-hero/` per the project's page-specific
  component convention.
- The disc uses three Figma-exported SVG groups (`public/assets/disc-ring-
{blue-tile,floral,stone}.svg`, sourced from the design's "Mask group 1/2/3"
  layers) rather than the flat `DISC.png` composite — the design's original
  vector masks give cleaner edges than a raster crop would. Each export is
  tightly cropped to its own content with no positional metadata, so their
  placement (`x`/`y`/`width`/`height` in `landing-hero/index.tsx`) was
  recovered by brute-force pixel-aligning each export against the full
  `DISC.png` render, then expressed as percentages of that shared 1379x1393
  canvas so they scale with the responsive disc container. Each group is
  `position: absolute` within the disc wrapper via inline percentage styles
  (values that specific, derived from image alignment, don't fit the
  project's Tailwind-only CSS Module convention).
- Note for Story 2.2: these three groups are the design's texture clusters
  (a group of 3 arcs per material/pattern), not full concentric rings — a
  "ring" spanning all clusters at one radius (as Story 2.2's independent
  rotation speeds imply) would need re-slicing across these three groups,
  not a 1:1 reuse of this story's `DISC_GROUPS`.
- A soft radial scrim (`::before` on the content stack, using the theme
  `--background` variable) sits between the disc and the text so the headline/
  subtext/CTA stay legible over the ring artwork at every breakpoint,
  including narrow mobile widths where the disc's empty center is smaller
  than the text block. It's theme-aware (adapts to the light variant
  automatically) and sized off the content box itself rather than a fixed
  breakpoint value.
- The CTA renders as a styled `<button type="button">` (not yet a `Link`) —
  navigation wiring and hover/focus states are explicitly Story 2.4's scope,
  and the `/list` route doesn't have a page yet (Epic 3).
- **Font-family correction:** the user copied the actual CSS out of Figma's
  inspect panel for the hero's "intro TXT" auto-layout, which showed the
  headline and subtext both set in Playfair Display (57px/62px line-height
  and 17px/28px), with the CTA label in Patua One (15px/18px, regular
  weight) — the reverse of this story's original "Patua One headline /
  Playfair Display subtext" assumption (also corrected in
  `EPICS_AND_STORIES.md`). Rebuilt `LandingHero_headline`/`_subtext`/`_cta`
  to the exact spec values, and split `LandingHero_content` into a nested
  `_titleBlock` (25px gap, 384px max-width) + CTA (30px gap from the title
  block) to match Figma's own nested auto-layout groups instead of one flat
  6-gap stack.
- **Cross-engine text-wrap fix:** at the exact 384px/57px spec values,
  "Objects, Voices" measures ~387px in Chromium's Playfair Display metrics —
  3px over the container, enough to wrap onto a 4th line even though Figma's
  own renderer fits it on one line. Added `whitespace-nowrap` to the
  headline (safe here since each of its 3 lines is already forced by an
  explicit `<br/>`, and font-size scales down together with the viewport at
  smaller breakpoints) so this rendering variance can't reintroduce the
  extra line break.
- **Disc-vs-text sizing fix:** the disc's empty center is a fixed ≈44.4% of
  its own width (set by the source ring artwork, not adjustable without
  re-exporting assets). Once the title block was pinned to Figma's exact
  384px width, the previous per-breakpoint disc widths (420/620/820px for
  base/sm/md) produced a hole _narrower_ than the text at those sizes — the
  rings ended up crowding the text instead of framing it, per user-reported
  visual diff against the design. Also fixed the responsive headline/subtext
  font-size steps, which weren't monotonic (subtext peaked at sm/md and
  shrank again at lg). Both `DISC` widths and the text scale are now
  recomputed so every breakpoint keeps at least a ~25px margin between the
  widest text line and the ring edge (verified via exact text-width
  measurement, not eyeballing).
- Removed the unused `create-next-app` starter content from `page.tsx`
  (`next.svg`/`vercel.svg` and their now-orphaned assets in `public/assets/`).
- Verified via Playwright screenshots at 1440×900, 768×1024, and 375×812: no
  horizontal overflow, no console/network errors, all three disc-group SVGs
  and the logo mark load with 200s, dark navy background with cream text
  renders correctly, and text stays legible over the disc at every width.
- The original Figma exports at the repo root (`Frame 141.svg`, the unused
  richer full-disc alternative; `Mask group 1/2/3.svg`, byte-identical
  duplicates of the renamed copies already in `public/assets/`) were removed
  once their content was confirmed safely copied into `public/assets/` under
  clearer names — kept temporarily after the initial copy at the user's
  request, removed on a later explicit cleanup pass in this same session.
  `Group 4.svg` (an unrelated, unreferenced icon at the repo root, purpose
  unknown) was left untouched.
- **Asset optimization:** the three `disc-ring-*.svg` files embed a raster
  photo via a base64 `<image>` (Figma's export format for masked photo
  layers) — originally JPEG, ~916KB combined. Re-encoded each embedded image
  to WebP (quality 80, chosen after a visual before/after comparison showed
  no perceptible difference) and re-embedded it as base64, cutting combined
  size to ~602KB (34% smaller). Note: an external-file version (`<image
xlink:href="file.webp">` instead of inline base64) was tried first and
  would have saved ~50%, but browsers block external subresource fetches
  from an SVG that's itself being used as an `<img>`/`next/image` source
  (a security sandbox restriction on "image-context" SVGs) — that version
  silently rendered the whole disc blank, caught via a Playwright screenshot
  before it shipped. Inline base64 has no extra fetch, so it isn't affected.

## Dependencies

- Story 1.2: Configure Tailwind CSS
- Story 1.4: Establish Project Folder Structure

## Blocked By

- Story 1.2: Configure Tailwind CSS
- Story 1.4: Establish Project Folder Structure

## Blocking

- Story 2.2: Implement Background Disc Animation
- Story 2.3: Add Scroll-Based Content Animations
- Story 2.4: Wire CTA Navigation to List Page

## Definition of Done

- [x] All acceptance criteria met
- [x] Layout matches Figma design at desktop breakpoint
- [x] Responsive behavior works correctly
- [ ] Code committed to repository (staged intentionally left for the user to review/commit)
- [x] No console errors or warnings
