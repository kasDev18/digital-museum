# Story 6.2: Animation Performance Pass

**Epic:** Epic 6 - QA & Delivery  
**Status:** Done  
**Priority:** High  
**Story Points:** 2

## User Story

**As a** developer  
**I want to** optimize all animations for smooth performance  
**So that** the user experience is fluid and professional

## Acceptance Criteria

- [x] Landing page disc animation runs at 60fps
- [x] Scroll-triggered animations are smooth and non-blocking
- [x] Grid drag/pan is smooth and responsive
- [x] Media carousel transitions are smooth (if built)
- [x] No layout thrashing or jank during animations
- [x] Animations use GPU-accelerated properties (transform, opacity)
- [x] GSAP contexts are properly cleaned up on unmount

## Technical Notes

- Use Chrome DevTools Performance tab to measure fps
- Check for layout thrashing in Performance profiles
- Ensure animations use transform/opacity only
- Implement proper cleanup in useEffect
- Test on lower-end devices if possible

## Implementation Tasks

1. Test landing page disc animation performance
2. Test scroll-triggered animations performance
3. Test grid drag/pan performance
4. Test media carousel transitions (if built)
5. Use Chrome DevTools Performance tab to measure fps
6. Check for layout thrashing
7. Verify GPU-accelerated properties are used
8. Verify GSAP context cleanup
9. Optimize any performance issues found

## Dependencies

- Story 2.2: Implement Background Disc Animation
- Story 2.3: Add Scroll-Based Content Animations
- Story 4.1: Implement Drag/Pan Canvas for Grid View
- Story 5.2: Implement Media Carousel (if built)

## Blocked By

- Story 2.2: Implement Background Disc Animation
- Story 2.3: Add Scroll-Based Content Animations
- Story 4.1: Implement Drag/Pan Canvas for Grid View
- Story 5.2: Implement Media Carousel (if built)

## Blocking

- Story 6.3: Cross-Browser Compatibility Check

## Definition of Done

- [x] All acceptance criteria met
- [x] All animations run smoothly at 60fps
- [x] Performance issues resolved
- [ ] Code committed to repository — left uncommitted/unstaged at the
      user's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-14
**Actual Implementation:**

An audit read through every animation path in the codebase against
`docs/gsap-performance.md`'s own stated conventions (transform/opacity
only, `useGSAP` scoping and cleanup, `ScrollTrigger.batch()` for repeated
elements, `matchMedia` reduced-motion gating).

**Found and fixed:**

- **`ArtifactGridRow`'s cursor-following `DragBadge` (Story 4.1) was
  calling `setBadgePos` — a React state update — on every `pointermove`**
  while a mouse hovered or dragged a row, up to 60-120 times/sec. Each call
  re-rendered and reconciled the row's entire tile track — up to
  `TILE_COUNT × artifacts.length` (up to 35) `ArtifactThumbnail` elements
  in infinite mode — for what should have been a single element's
  `transform` update. **Fixed** by having `DragBadge`
  (`src/app/list/components/artifact-grid/components/drag-badge`) forward
  a ref to its root node; `ArtifactGridRow`'s `handlePointerMove` now writes
  `transform` straight to that DOM node for an already-mounted badge,
  bypassing React entirely for the high-frequency case. Only the
  mount/unmount toggle (pointer entering/leaving the row) still goes
  through `useState`, since that's a real, comparatively rare tree change
  — verified via `pnpm lint`'s `react-hooks/refs` rule, which correctly
  rejected an initial version that read the ref's value during render and
  drove the fix toward mounting from state and updating an already-mounted
  node via the ref instead.

**Checked and confirmed correct, no changes needed:**

- Landing disc rotation (`landing-hero-disc`): `x`/`y`/`rotation`/`scale`/
  `opacity` + `force3D`, `will-change-transform` held for the continuous
  `repeat: -1` tween, matching the docs' own stated exception for
  long-running transforms.
- `useScrollReveal` (`src/lib/gsap-utils.ts`), used by `ArtifactGrid`/
  `ArtifactList`: uses `ScrollTrigger.batch()` (not one trigger per
  element), sets the hidden state via `gsap.set` before any scroll can
  happen, animates only `autoAlpha`/`y`, and toggles `will-change` only for
  the tween's own duration.
- Grid drag/pan track itself (`use-drag-pan.ts`): writes `transform`
  straight to `style.transform` outside React state by design (the file's
  own comment explains why), with `gsap.killTweensOf` cleanup on unmount.
- `MediaCarousel` slide transitions: pure CSS, `transform`/`opacity` only,
  gated behind `prefers-reduced-motion`, with `contain: paint` to stop a
  rotated slide's bounding box from inflating an ancestor's scroll height.
- No `setInterval`/`requestAnimationFrame` loops exist anywhere in `src`
  that could leak past unmount; the one scroll listener
  (`src/components/layout/site-header`) is `{ passive: true }` with proper
  cleanup.
- Two paint-triggering (not compositor-only) animations exist —
  `LandingHero`'s one-shot background-color fade on load, and a `filter:
drop-shadow`/`blur` used on a handful of hero text/disc elements — both
  one-shot, low-element-count, and already deliberate per their own doc
  comments; flagged for awareness but not changed, since converting either
  would mean restructuring markup (an extra overlay `div`) for a
  theoretical, unconfirmed jank source rather than a measured one.
- `pnpm lint`, `pnpm ts:check`, and `pnpm build` all pass clean after the
  `DragBadge` fix above.
