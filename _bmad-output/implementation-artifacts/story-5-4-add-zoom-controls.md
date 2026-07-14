# Story 5.4: Add Zoom Controls (Zoom In/Out)

**Epic:** Epic 5 - Details Page (Stretch/Optional)
**Status:** Done
**Priority:** Low (Stretch)
**Story Points:** 2

## User Story

**As a** visitor
**I want to** zoom in and out on the artifact media
**So that** I can examine fine details

## Acceptance Criteria

- [x] Zoom controls match Figma design (zoom in/out icons) — implemented as a small
      icon-button pair overlaid on the media frame (top right), using the exported zoom
      in/out icon concept redrawn as inline SVG (`ZoomInIcon`/`ZoomOutIcon`) per this
      project's icon convention. The user later shared the actual Mshatta Façade detail
      mock, which shows a single magnifying-glass affordance in that same top-right
      position (superseding `EPICS_AND_STORIES.md`'s own note that "no captured mock
      places these in a specific layout") — asked directly, and the call was to keep the
      zoom-in/zoom-out pair (matching this AC's own separate "in" and "out" bullets below)
      but restyle to the mock's lighter, subtler button treatment rather than collapse to
      a single toggle
- [x] Zoom in button increases media scale
- [x] Zoom out button decreases media scale
- [x] Zoom is constrained within reasonable limits (e.g., 0.5x to 3x)
- [x] Zoom is smooth and performant (uses CSS transform)
- [x] Zoom state is reset when changing media items
- [x] Zoom controls are accessible (keyboard navigable)

## Technical Notes

- Use CSS transform scale for zoom
- Implement pan when zoomed (optional but good UX)
- Limit zoom range to prevent breaking layout
- Reset zoom on carousel slide change
- Consider pinch-to-zoom on touch devices (stretch feature)

## Implementation Tasks

1. Create ZoomControls component
2. Implement zoom in functionality
3. Implement zoom out functionality
4. Add zoom range constraints
5. Implement smooth zoom with CSS transform
6. Reset zoom on media change
7. Add accessibility features
8. Test zoom functionality

## Dependencies

- Story 5.2: Implement Media Carousel

## Blocked By

- Story 5.2: Implement Media Carousel
- **Epic 1-4 completion required before starting Epic 5**

## Blocking

- Story 5.5: Add Download PDF Action

## Definition of Done

- [x] All acceptance criteria met
- [x] Zoom works smoothly
- [ ] Code committed to repository — left uncommitted/unstaged at the implementer's
      explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Note

This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-14
**Actual Implementation:**

- Added zoom in/out controls directly to `MediaCarousel`
  (`src/app/detail/components/media-carousel`) rather than a separate
  component — that story's own doc comment already confirmed "no zoom
  exists yet" and called this component the natural insertion point,
  since zoom needs to apply per-slide and reset on the same slide-change
  events that component already owns.
- **Zoom mechanics:** plain `zoom` state (`1` default, `MIN_ZOOM = 0.5`,
  `MAX_ZOOM = 3`, `ZOOM_STEP = 0.5`), applied as a CSS `transform: scale(...)`
  on the _active_ slide's `<Image>` only (via its `style`
  prop) — not on `.MediaCarousel_track`, which drives the shared
  horizontal slide-offset for every slide at once. Scaling only the
  active image means the others never shift position, and the outer
  frame's existing `overflow-hidden`/`contain: paint` already clips
  whatever spills past its bounds, so zooming in just reveals more of the
  same image within the existing rounded frame with no new clipping
  logic needed. A `transition: transform 0.2s ease` on the image (paused
  under `prefers-reduced-motion: reduce`, matching every other animation
  in this component) makes each zoom step glide rather than jump.
- **Reset on slide change:** compares `index` against a `zoomResetForIndex`
  bit of state during render (React's documented pattern for "adjusting
  state when a value changes," rather than a `useEffect`, which would
  commit one stale-zoom frame before correcting itself one render later)
  — any of the carousel's four existing navigation paths (More Images,
  dots, arrow keys, swipe) resets zoom back to `1x` for free, without each
  handler needing to remember to do it individually.
- **Icons:** `ZoomInIcon`/`ZoomOutIcon` added to
  `src/components/ui/icons.tsx` (a magnifying glass with a `+`/`-`),
  following the file's existing hand-drawn-SVG convention rather than
  referencing the Figma export PNGs directly — same approach already used
  for every other icon in that file.
- **Placement/visibility:** top-right overlay (bottom-left/right are
  already the dots/"More Images" controls). Renders unconditionally —
  unlike "More Images"/dots (gated behind `hasMultiple`), zoom is useful
  even for a single-image artifact (e.g. Bamboo Pen), so it isn't hidden
  for that case.
- **Follow-up (same day):** the user shared the actual Mshatta Façade
  detail mock, showing a single, lighter/subtler magnifying-glass button
  in this exact top-right position (contradicting this story's earlier
  assumption that no captured mock placed one). Asked directly whether to
  collapse to a single toggle or keep the in/out pair — the call was to
  keep both buttons (matching this story's own separate "zoom in
  button"/"zoom out button" AC bullets) but restyle to match: initially a
  lighter `bg-black/45` (was `/60`), a slightly larger `h-9 w-9` button,
  and a thinner `strokeWidth="1.5"` (was `1.75`) on both icons.
- **Follow-up 2 (same day):** the user then pointed out the button
  background still didn't match — a second, wider screenshot of the same
  mock (this time showing "More Images" too) made clear both overlays are
  actually a light **cream** pill with **navy** icon/text
  (`bg-cream`/`text-navy`, the same Tailwind theme-color utilities the
  audio player's own mock-matching pass already established), not a dark
  scrim at any opacity. Recolored `.MediaCarousel_zoomButton` and
  `.MediaCarousel_more` to that fixed cream-on-photo treatment (dropping
  the now-unneeded `backdrop-blur-sm`, since a solid cream fill doesn't
  need it) — the dots indicator (unboxed in either screenshot) was left
  white, since nothing suggested it should change too.
- **Boundary behavior:** the zoom-in/zoom-out buttons use the native
  `disabled` attribute at each end of the range (confirmed via Playwright:
  from `1x`, exactly 4 zoom-in clicks reach the `3x` ceiling and disable
  further zoom-in; from there, 5 zoom-out clicks reach the `0.5x` floor
  and disable further zoom-out) — accessible for free via native button
  semantics, no extra ARIA needed.
- Verified via Playwright (headless Chromium) against `mshatta-facade`:
  zoom in/out both scale and clip correctly within the frame, boundaries
  disable the right button at each end with no overshoot, zoom resets to
  `1x` (and both buttons re-enable) after advancing to the next image via
  "More Images," and the overlay still renders and works on `bamboo-pen`
  (single media item, no "More Images"/dots). `pnpm lint`, `pnpm build`,
  and `prettier --check` all pass clean.

**Deferred (see `deferred-work.md`):** pan-while-zoomed and pinch-to-zoom
on touch are both explicitly called out as optional/stretch in this
story's own Technical Notes and are not implemented — zooming in currently
just re-centers on the same point (`transform-origin` center) rather than
letting the visitor drag the zoomed image around.
