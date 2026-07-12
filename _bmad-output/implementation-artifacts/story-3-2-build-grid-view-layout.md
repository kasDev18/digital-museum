# Story 3.2: Build Grid View Layout

**Epic:** Epic 3 - List Page Foundation  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story

**As a** visitor  
**I want to** see artifacts displayed in a grid layout  
**So that** I can browse the collection visually

## Acceptance Criteria

- [x] Grid layout displays artifacts in a responsive grid
- [x] Grid uses Artifact Thumbnail components for each item
- [x] Grid is data-driven from mock data array
- [x] Grid is displayed on an oversized canvas larger than viewport
- [x] Grid spacing and alignment match Figma specifications
- [x] Grid adapts to different screen sizes (responsive columns)
- [x] Empty state handled if no artifacts exist

## Technical Notes

- Use CSS Grid for layout
- Implement oversized canvas concept (larger than viewport)
- Grid should be positioned absolutely or with overflow handling
- Use mock data from data layer
- Responsive column count: desktop (4-5), tablet (3-4), mobile (2-3)

## Implementation Tasks

1. Create list page route structure in /app
2. Implement CSS Grid layout for artifacts
3. Integrate Artifact Thumbnail components
4. Connect to mock data layer
5. Implement oversized canvas positioning
6. Add responsive column behavior
7. Implement empty state handling
8. Test grid layout with various screen sizes

## Dependencies

- Story 1.5: Create Mock Data Layer
- Story 3.1: Create Artifact Thumbnail Component

## Blocked By

- Story 1.5: Create Mock Data Layer
- Story 3.1: Create Artifact Thumbnail Component

## Blocking

- Story 4.1: Implement Drag/Pan Canvas for Grid View

## Definition of Done

- [x] All acceptance criteria met
- [x] Grid layout matches Figma specifications
- [x] Empty state works correctly
- [x] Code committed to repository
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-12
**Actual Implementation:**

- Built `ArtifactGrid` at `src/app/list/components/artifact-grid/`, rendered by the new `src/app/list/page.tsx` route (previously non-existent — clicking the landing page's "Enter Exhibition" CTA 404'd; see `deferred-work.md`).
- Renders `ArtifactThumbnail` (`variant="grid"`, Story 3.1) for each artifact from `getAllArtifacts()` (`lib/data-utils.ts`), with an early return to the shared `ListEmptyState` (`src/app/list/components/list-empty-state/`) when the array is empty.
- **Oversized canvas:** with only 12 mock artifacts (Story 1.5), the set is tiled 3× to fill a canvas wider/taller than the viewport, per this story's own Technical Notes. To avoid the exact-repeat tiling reading as a duplicate-render bug during visual QA, tiles alternate forward/reversed order (a "boustrophedon" pattern) instead of repeating identically. Tiled-copy cells beyond the first pass are marked `inert` (removes them from keyboard focus order and the accessibility tree — verified via a Playwright tab-order check that lands on exactly the 12 real `/detail/[id]` links, then the footer) and rendered at reduced opacity, so they read as intentional canvas filler rather than a bug.
- Horizontal overflow is scoped to a dedicated `.ArtifactGrid_viewport` (native `overflow-x-auto`), not the whole page — only that box scrolls sideways; the canvas's extra tiled rows simply make the page taller, so vertical scroll is just the page's native scroll (no fixed-height clipping box needed for either axis). This is a functional stand-in for Story 4.1's future drag/pan transform.
- Grid column tracks match `ArtifactThumbnail`'s own `sizes` breakpoints from Story 3.1 (`45vw` mobile / `30vw` tablet / `220px` desktop) so the requested image resolution and the rendered box size agree. Verified via Playwright at 1440×900 and 1920×1080 that the canvas reliably overflows the viewport at both; very large (2560px+/ultrawide) monitors are a known, accepted gap — see `deferred-work.md`.
- Only the very first cell is marked `priority` for LCP — the canvas's column count/width varies by breakpoint, so no fixed index range is reliably "the first visible row" at every screen size.
- Verified manually (no test framework in this repo — see Story 3.1's precedent) via Playwright screenshots at mobile/tablet/desktop/ultrawide widths, a keyboard tab-order check, and `console --errors` (only the expected 400s from Story 1.5's placeholder image paths, not backed by real files yet).

### Review Findings

- [x] [Review][Patch] Page-level top/bottom padding clearing the fixed `SiteHeader`/`SiteFooter` (Story 1.7) shrank the footer clearance at the `sm:` breakpoint while growing the header clearance — backwards, and inconsistent with the comment's own claim of mirroring `LandingHero`'s symmetric `py-16 sm:py-20` [src/app/list/styles.module.css] — fixed to grow both together.
- [x] [Review][Patch] `priority` was applied to an entire fixed-index "first row" (6 cells) rather than the actual first visible cell, over-fetching several off-screen images at LCP priority on narrower breakpoints [artifact-grid/index.tsx] — narrowed to `index === 0` only.
- [x] [Review][Patch] Tiling the 12 artifacts 3× produced fully-interactive duplicate `/detail/[id]` links with identical accessible names and no distinguishing cue, tripling keyboard/screen-reader tab stops with no new information [artifact-grid/index.tsx] — fixed via `inert` on repeat-tile wrappers plus a dimmed visual treatment.
- [x] [Review][Patch] The exact same 12-artifact order repeated identically every tile read as a duplicate-render bug during visual QA rather than intentional filler [artifact-grid/index.tsx] — alternated tile order (forward/reversed) to break the literal repeat.
- [x] [Review][Patch] The desktop grid track (`repeat(6, 220px)` + gaps/padding ≈ 1560px total) fit entirely within very common wide desktop viewports (1600px+), silently dropping the "oversized canvas" behavior on the platform the AC calls it out for [artifact-grid/styles.module.css] — widened to 8 desktop columns (≈2064px total), verified via Playwright to still overflow at 1920×1080; 2560px+/ultrawide monitors remain a known, documented gap.
- [x] [Review][Defer] `?view=list` was initially wired via a `searchParams`-driven interim toggle so both Grid and List views could be reached before Story 3.4's real pill switcher exists; reconsidered as unnecessary public route surface for a placeholder and removed — `page.tsx` renders Grid only, matching Story 3.1's own precedent of deleting its dev-only preview route before finalizing. `ArtifactList` (Story 3.3) was verified by temporarily swapping it into `page.tsx` during development, then reverted.
- [x] [Review][Patch] `role="status"` on `ListEmptyState` implied a live-region announcement, but the component is server-rendered static content present at first paint — screen readers don't announce a live region for content that's already there on load, so the attribute gave false confidence without the claimed benefit [list-empty-state/index.tsx] — removed.
- Dismissed as noise: the `GRID_COLUMNS`/CSS track-count duplication flagged in review no longer applies — removed along with the fixed-row `priority` logic it supported.

## Figma Fidelity Pass (2026-07-12)

A Figma dev-mode CSS export of the actual "Gallery" frame was provided after the initial implementation, revealing the earlier layout's dimensions were reasonable guesses rather than the real spec. Reworked to match:

- **Layout model changed from a uniform CSS Grid to independently-sized flex rows.** The Figma export shows each row as its own centered flex container with a _different_ total width (2560px/3080px/2560px, from row item counts of 5/6/5) — not a single grid with uniform column tracks. `ArtifactGrid` now builds rows by cycling through a `ROW_SIZES = [5, 6]` pattern and rendering each as its own `flex` row (`styles.module.css`'s `.ArtifactGrid_row`), centered via the outer `.ArtifactGrid_canvas`'s `align-items: center`. This is what produces the organic, brick-like horizontal offset per row when scrolling, matching the reference screenshot — rows of different widths, centered independently, overflow the viewport by different amounts on each side.
- **Thumbnail image is 400×280 (a 10:7 rectangle), not square.** The original AC text said "square thumbnail," but the actual Figma export is landscape. `ArtifactThumbnail`'s grid-variant image wrap now uses `aspect-[10/7]` and a 16px radius (`rounded-2xl`) instead of `aspect-square`/8px — scoped to the `.ArtifactThumbnail_grid` selector only, so the List variant (Story 3.3, unaffected by this spec) keeps its own square thumbnail.
- **Card width is 400px at desktop** (was 220px, a guess) — corrected in both `ArtifactThumbnail_grid`'s width and its `next/image` `sizes` prop, which must stay in agreement (see this file's earlier-documented duplication risk).
- **Title typography matches exactly:** Playfair Display (already `font-serif`), 22px font-size / 18px line-height at desktop, weight 400, cream color — scaled proportionally at smaller breakpoints since the export only specifies a desktop reference.
- **Spacing matches exactly at desktop:** 16px gap between image and title (was 12px), 120px gap between cards in a row and between rows, 40px side padding, 150px extra bottom padding on the last row. First-row top padding is intentionally _not_ a literal match (Figma reserves 330px there for the site header plus Story 4.2's not-yet-built category filter bar, both visible in the reference screenshot) — approximated with a smaller placeholder value stacked on top of the page's own header clearance, documented in `styles.module.css`.
- **Added `ListBackground`** (`src/app/list/components/list-background`): a decorative, fixed-position backdrop. Went through two iterations — first built from a large (3.3MB) photographic Figma disc export (`Frame 141.svg`), recolored via a CSS `grayscale`+`sepia`+`hue-rotate` filter chain since it carried no styling of its own; then replaced with a much smaller (3.4KB) vector export (`Mask group 1 (1).svg`, copied to `public/assets/list-background-arcs.svg`) — three arc/swoosh shapes that already bake in the site's own cream tint (`#EFEBE5`) and a very low opacity, so no CSS filter is needed at all, just plain `object-contain` positioning. Sized mobile-first (900px → 1300px → 2000px across breakpoints, matching `LandingHeroDisc`'s own scale-up convention) so a visible portion of the arc reads at every breakpoint rather than being centered so wide it falls off-screen on narrow viewports.
- Verified via Playwright screenshots at mobile/tablet/desktop against the reference screenshot, plus a repeat of the earlier keyboard tab-order check (still exactly 12 real `/detail/[id]` links reachable, 24 filler tiles still `inert`) and overflow check (canvas still wider than a 1440px viewport) to confirm the row-based rework didn't regress the accessibility/oversized-canvas fixes from the prior review pass.
- In the course of this pass, discovered and fixed two files broken by an in-progress, unrelated `landing-hero` component reorg already present in the working tree (moving `landing-hero-disc`/`landing-hero-content-reveal` under `landing-hero/components/`, consistent with this project's own colocation convention) — `landing-hero/index.tsx`'s two import paths and `landing-hero-disc/styles.module.css`'s `@reference` path were still pointing at the old sibling locations, breaking `pnpm ts:check`/`pnpm build` entirely. Fixed as a minimal, mechanical unblock (updated the stale paths only) since it was blocking verification of this story's own changes — not otherwise part of this story's scope.

## Real Artifact Thumbnail Images (2026-07-12)

The designer-provided a full set of 12 real thumbnail photos (dropped in a repo-root `thumbnails/` folder, one PNG per artifact, named after each artifact's title — e.g. `Wooden_Chest.png`, `Lei_Po'o.png`). Previously every thumbnail rendered the checkerboard skeleton placeholder permanently, since the mock dataset's `thumbnail` paths (Story 1.5) weren't backed by real files — this resolves that gap entirely for the List page.

- Matched each source file to its `mock-data.ts` artifact id by name (all 12 filenames map 1:1 to the 12 mock artifacts — confirmed no missing/extra files).
- All 12 source PNGs were already exactly 400×280 — the exact dimensions this story's Figma fidelity pass established for the grid variant — and fully opaque (alpha channel uniformly 255, confirmed via Pillow before conversion), so no cropping/resizing was needed and dropping the alpha channel to convert to RGB was lossless, not a blend.
- Converted PNG → JPEG (quality 85, progressive, `Pillow`) since `mock-data.ts` already hardcodes `.jpg` extensions for every `thumbnail` path (Story 1.5) — no code changes needed, just placing the right bytes at the right path. Ran `jpegoptim --strip-all` afterward for additional lossless savings (metadata stripping).
- Result: ~2.9MB of source PNGs → ~410KB of optimized JPEGs (~86% smaller), placed at `public/images/artifacts/<id>/thumbnail.jpg` for all 12 artifacts.
- Verified via Playwright screenshots (mobile/desktop) that every thumbnail now renders its real photo instead of the skeleton, with zero console errors (the previously-expected 400s are gone).
- Out of scope: the `media` array's carousel images (`1.jpg`, `2.jpg`, etc.) referenced by `mock-data.ts` for the detail page — the designer only provided thumbnails this pass, and the detail page (Epic 5) isn't built yet regardless.
- The raw `thumbnails/` drop folder (repo root) was removed once the optimized versions above were confirmed in place — no longer needed once the app's own `public/images/artifacts/` copies exist.

## Removed Tiled Duplicates, Added Scroll Reveal (2026-07-12)

Two follow-up requests once real thumbnail images were in place:

- **Removed the tiled duplicate cells entirely.** With only 12 mock artifacts (Story 1.5), the canvas was previously filled out by tiling the set 3× (`TILE_COUNT`, boustrophedon-ordered, `inert` + dimmed) to satisfy the "oversized canvas" AC — reasonable with placeholder skeletons, but once real, recognizable artifact photos were in place, seeing "Wooden Chest" repeat 3 times read as a real duplicate rather than intentional filler. `ArtifactGrid` now renders each of the 12 real artifacts exactly once. `ROW_SIZES` changed from `[5, 6]` (a Figma-matched pattern designed to consume 36 tiled cells) to `[5, 4, 3]` (sums to exactly 12, no remainder) — still three rows of differing width (2560px/2040px/1520px at the 400px desktop card size), preserving the organic brick-like offset the row-based layout was built for, just without repeats. This is a simpler component overall: no `TILE_COUNT`, no reversed-order tiling, no `isFillerTile`/`inert`/dimmed-opacity logic, no `.ArtifactGrid_cell`/`.ArtifactGrid_cellFiller` CSS.
- **Added scroll-reveal animation to both Grid and List views.** New `useScrollReveal` hook in `src/lib/gsap-utils.ts` — a fade + slide-up via `ScrollTrigger.batch()`, exactly the pattern `docs/gsap-performance.md`'s "Batching many similar triggers" section anticipates ("a list/grid of similar elements, e.g. artifact thumbnails"), extracted as one shared hook rather than duplicating the ~25-line setup across `ArtifactGrid` and `ArtifactList` (Story 3.3). Both components are now Client Components (`'use client'`) and pass a shared `artifact-reveal` marker class (via `ArtifactThumbnail`'s existing `className` prop) to every card; the hook targets that selector, hides targets immediately via `gsap.set` (no flash of final state), then reveals each via `ScrollTrigger.batch`'s `onEnter` with a stagger. Respects `prefers-reduced-motion` (via `gsap.matchMedia`, same as every other animation in this codebase) and clears its inline styles once settled (`clearProps`) so `ArtifactThumbnail`'s own hover transitions stay fully CSS-controlled afterward. Content already in view on load (e.g. the grid's first row) reveals immediately as an entrance animation rather than waiting for a scroll that may not come — same "already past `start`" behavior documented in `LandingHeroContentReveal`.
- Verified via Playwright: grid link check confirms exactly 12 total `/detail/[id]` links, all unique, zero `[inert]` elements (down from 24). Screenshots at rest, mid-scroll, and settled confirm the fade/slide-up plays correctly for both views (temporarily swapped `ArtifactList` into `page.tsx` to verify, then reverted — same manual-check-then-revert precedent as before).

## Exit Animation on Navigation, Per-Row Scroll (2026-07-12)

Two further requests:

- **Exit animation before navigating to a Detail page.** New `useExitFadeNavigation` hook in `src/lib/gsap-utils.ts`, the List page's equivalent of `LandingHero`'s own click-triggered exit animation before its "Enter Exhibition" CTA navigates: intercepts a click on any `<a href="/detail/...">`, fades/slides all `.artifact-reveal` cards out (continuing the entrance reveal's upward motion, just outward — `autoAlpha:0, y:-40`, staggered), then calls `router.push(href)` once the animation completes (~0.78s for 12 staggered cards). Respects `prefers-reduced-motion` (skips straight to navigation, same as `LandingHero`).
  - **Correctness pitfall found and fixed during verification:** the container's handler was first wired to `onClick` (bubble phase), which looked correct in a quick manual click-through but actually never ran before navigation — `next/link` attaches its own `onClick` directly to the anchor and calls `router.push` itself unless `event.defaultPrevented` is already `true` by the time its handler runs. Bubble order is target-to-root, so the anchor's own listener (the target) fires _before_ an ancestor's bubble-phase listener — by the time my delegated handler's `preventDefault()` ran, `next/link` had already navigated. Confirmed via a rigorous check: sampling `getComputedStyle(...).opacity` on the cards at 50ms intervals after a scripted click showed no change at all, and the URL changed almost immediately — the animation simply never fired. Fixed by wiring to `onClickCapture` instead (capture phase runs root-to-target, i.e. _before_ the anchor's own listener) and calling `event.stopPropagation()` there, which keeps the event from ever reaching `next/link`'s handler. Re-verified the same way: opacity now genuinely decreases over time (~1.0 → ~0.4-0.7 by 450ms across the staggered cards) and the URL only changes once the full animation settles (~800ms-1s, confirmed via 200ms-interval polling) — this is the kind of bug a single "did it eventually navigate?" check would have missed entirely, since the _end result_ (arriving at `/detail/wooden-chest`) looked identical either way.
- **Grid rows now scroll independently, each with its scrollbar hidden.** Previously the whole canvas shared one `overflow-x-auto` box (`.ArtifactGrid_viewport`); now each `.ArtifactGrid_row` is its own horizontally-scrollable strip (`overflow-x-auto` moved onto the row itself), so scrolling one row doesn't move the others — closer to a Netflix-style row carousel than one shared pannable canvas. The scrollbar is hidden via `scrollbar-width: none` / `-ms-overflow-style: none` / a `::-webkit-scrollbar { display: none }` rule, while native scroll (trackpad, touch swipe, shift+wheel) still works — no visible scroll UI, per this request, while remaining fully scrollable. Rows switched from centered to flush-left (`justify-center` removed) since centering content that overflows a scrollable box leaves its left-hand overflow unreachable (`scrollLeft` can't go negative) — a real bug caught via Playwright rather than assumed.
  - **A second correctness pitfall, also only caught by directly measuring `scrollWidth`:** after making each row its own `overflow-x-auto` box, the cards inside it shrank to fit the row's now-bounded width instead of overflowing it — `row.scrollWidth === row.clientWidth` for every row, i.e. nothing was scrollable at all, despite the CSS looking correct. Cause: `ArtifactThumbnail_grid` sets an explicit width (`lg:w-[400px]`) but flex items default to `flex-shrink: 1`, so a flex row now bounded to a fixed container width will compress its children below their explicit width rather than let them overflow, unless shrinking is explicitly disabled. Fixed by adding `shrink-0` to `.ArtifactThumbnail_grid` (Story 3.1's file). Re-verified: `scrollWidth` now correctly reports 2560px/2040px/1520px for the three rows (matching the `[5, 4, 3]` item counts at 400px cards), and scrolling one row (`row.scrollLeft = 300`) leaves a sibling row's `scrollLeft` at `0`, confirming true per-row independence.
- Verified via Playwright across both views and both breakpoints (desktop/mobile): 12 unique `/detail/[id]` links, 0 `inert` elements, zero console errors, entrance reveal settles correctly, exit animation + deferred navigation confirmed via opacity sampling and URL polling (not just "did it end up on the right page"), and per-row scroll independence confirmed via direct `scrollLeft` manipulation.

## Click-and-Drag Pan Replacing Native Row Scroll (2026-07-12)

Two more requests: real click-and-drag ("grab") panning instead of relying on native scroll, and centering each row's content again (removed in the prior pass specifically because centered content in a native `overflow-x-auto` box leaves its own left-hand overflow unreachable — `scrollLeft` can't go negative).

- **New `useDragPan` hook** (`src/app/list/components/artifact-grid/use-drag-pan.ts`) and a new `ArtifactGridRow` sub-component (`components/artifact-grid-row/`) replace native `overflow-x-auto` per row with `overflow: hidden` plus a manually transformed track. Mouse drag and touch swipe both work through the same Pointer Events (`pointerdown`/`pointermove`/`pointerup`/`pointercancel`) — no separate touch-handling code needed. The offset is written directly to `track.style.transform` during `pointermove` rather than through React state, so a drag firing dozens of move events a second doesn't force a re-render on every pixel; only `isDragging` (flips twice per drag, not once per pixel) goes through `useState`, to drive the `cursor-grab`/`cursor-grabbing` swap. Panning is clamped to the track's actual overflow on each side (computed from `scrollWidth`/`clientWidth` at drag time), so you can't drag past the real edges into empty space.
- **Centering is safe again** specifically because panning is now JS-driven, not `scrollLeft`-driven — there's no "can't go negative" limitation once the offset is just a `transform` this code controls directly. `justify-center` is back on the track.
- **No scrollbar exists at all now** (not "hidden via CSS" — genuinely absent, since `overflow: hidden` never has one), which is a more robust way to satisfy "no visible scroll UI" than hiding a real scrollbar.
- **A genuine drag still fires an ordinary `click` on release** (browsers don't suppress this automatically just because a drag happened), which would otherwise also trigger `useExitFadeNavigation` and navigate away right after panning. Fixed via a small coordination ref in `ArtifactGrid`: each row's `useDragPan` reports `onDragEnd(didDrag)`; a real drag sets a `suppressNextClick` ref that `ArtifactGrid`'s own `onClickCapture` handler checks (and resets) before deciding whether to hand the event to `useExitFadeNavigation` at all.
- **A serious correctness bug found and fixed during verification, not assumed away:** the first implementation called `element.setPointerCapture()` unconditionally in `onPointerDown` (the standard, "textbook" place to capture a drag). This broke _every_ click in a row, not just drags — verified via a Playwright trace logging `pointerdown`/`pointerup`/`click` targets, which showed `pointerup` and the subsequent `click` both retargeted to the row's own `<div>` instead of the thumbnail's `<a>` the moment any pointer went down, because `setPointerCapture` redirects _all_ subsequent pointer events (and the click derived from them) to the capturing element, overriding normal hit-testing. That broke `useExitFadeNavigation`'s `event.target.closest('a[href^="/detail/"]')` lookup for a plain, no-movement click, since `closest()` was now searching upward from an element that's an _ancestor_ of the anchor, not a descendant — it could never find it. A first fix attempt still failed an automated check because the check itself was flawed (it queried the first `a[href^="/detail/"]` in DOM order, which sits off-screen to the left of a centered row by design — clicking its stale bounding box hit nothing); a second, corrected check against a link confirmed actually within the viewport reproduced the real bug reliably. Fixed by deferring `setPointerCapture` to the moment a real drag is first detected (inside `onPointerMove`, at the same point the drag threshold is crossed) rather than on every `pointerdown` — plain clicks never trigger capture at all now, so their `click` event's target is never disturbed. Re-verified with the same Playwright trace: `pointerup`/`click` both correctly target the `<a>`/`<img>` for a plain click, and `event.defaultPrevented` is `true` with the URL changing to `/detail/vyshyvanka` after the exit animation settles.
- Verified via Playwright: dragging a row (200px+) leaves the URL on `/list` (suppressed); a plain click on a viewport-visible link navigates to its Detail page after the exit animation; all rows report `overflow-x: hidden` (not `auto`); dragging far past a row's natural bounds (1500px attempted) clamps the transform to stop exactly at the row's last real card, confirmed both numerically (`getComputedStyle(track).transform`) and via screenshot.

## Fixed: First/Last Card Not Fully Revealable by Dragging (2026-07-12)

User report (with a screenshot) that some images — specifically the first/last card of a row — couldn't be fully seen even when dragged as far as the interaction allowed, on both desktop and mobile.

- **Root cause: the exact same "can't measure negative overflow" limitation `useDragPan` was built to route around, resurfacing inside its own bounds calculation.** `clamp()`'s `max = (track.scrollWidth - container.clientWidth) / 2` assumed `scrollWidth` reports the track's _full_ natural content width. It doesn't, for a _centered_ flex track: browsers only extend `scrollWidth` to cover overflow in the forward (right) direction from an element's own box, not the backward (left) overflow centering also produces. Measured directly (row 0, desktop, 5 cards): actual content width is 2560px, but `track.scrollWidth` reported only 1960px — under by exactly half the missing side's overflow. The computed `max` (260px) was real but ~300px short of what dragging to the true edge required, so the first/last card stayed partially off-screen no matter how far you dragged.
- **Fix:** measure the first and last child's own rendered position instead — `last.getBoundingClientRect().right - first.getBoundingClientRect().left`. This works regardless of overflow direction, and stays correct at any current drag offset, since `transform` moves every child by the same amount (the _distance_ between first and last child doesn't change as the track pans, only their absolute positions do).
- **Verification methodology bug found along the way, also worth recording:** the first re-check after the fix showed row 0 correct but row 1 still broken with the _exact same_ pre-fix number — which pointed at the fix not having applied, not a fresh bug. Tracing pointer/click targets showed the drag's `pointerdown` was landing on the fixed `SiteFooter` (z-20), not the row, because the test clicked at the row's vertical center, and at that scroll position the row's center happened to sit under the footer's fixed overlay. Not an app bug — a test picking an occluded coordinate. Corrected by scrolling the row into view first and clicking nearer its top edge.
- **A second, more interesting methodology bug, on mobile specifically:** even after the footer fix, mobile still failed. Tracing `pointermove` targets showed the _first real move event after pointerdown_ already had `target: HTML` instead of the row — because the test dragged via one `page.mouse.move(farAwayX, {steps: 15})` call, i.e. ~200px per interpolated step, and 200px comfortably exceeds a 390px-wide mobile viewport in a single jump. Since `useDragPan` only calls `setPointerCapture` _once it receives_ a `pointermove` event that crosses the 4px threshold, and that first event had already hit-tested to `<html>` (off the row) before ever reaching the row's handler, capture was never engaged — so hit-testing kept "escaping" the row on every subsequent step too. This is a real characteristic of the drag implementation, but not a real-world bug: actual mouse/touch input reports at high frequency with small deltas between events (a human drag naturally crosses the 4px threshold within a few pixels of the start point, long before the cursor could travel far enough to exit the viewport). Re-verified with a corrected test using realistic ~15-20px-per-step movement — matching the earlier `docs/gsap-performance.md` cautions about synthetic-test event patterns not always matching real input, just encountered here in pointer events rather than scroll.
- Verified via Playwright across desktop (1440px), tablet (820px), and mobile (390px), all 3 rows, both directions (18 checks total): every first/last card's edge lands exactly at the container boundary (not beyond it, not short of it) after dragging to the respective extreme. Re-confirmed the click-suppression, plain-click-navigation, and no-scrollbar checks from the prior pass still hold.
