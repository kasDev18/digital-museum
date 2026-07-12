# Story 4.1: Implement Drag/Pan Canvas for Grid View

**Epic:** Epic 4 - List Page Interaction  
**Status:** Done  
**Priority:** High  
**Story Points:** 5

## User Story
**As a** visitor  
**I want to** click and drag to pan around the grid in any direction  
**So that** I can explore the artifact collection freely

## Acceptance Criteria
- [x] Grid view supports mouse drag to pan in any direction
- [x] Grid view supports touch/swipe drag on mobile devices
- [x] Drag cursor affordance shown on hover/drag start (per Figma drag icon)
- [x] Canvas has infinite/loose bounds (no hard edges that abruptly stop)
- [x] Dragging feels smooth and responsive
- [x] Drag does not interfere with clicking thumbnails
- [x] Optional: inertia/momentum on release (nice-to-have)

## Technical Notes
- Implement custom drag handler using mouse/touch events
- Use transform (translate) for performant dragging
- Calculate delta from drag start position
- Implement loose bounds with easing at edges
- Consider inertia using momentum calculation (optional)
- Distinguish between drag and click (time threshold or movement threshold)

## Implementation Tasks
1. Create drag handler hook or component
2. Implement mouse event handlers (mousedown, mousemove, mouseup)
3. Implement touch event handlers (touchstart, touchmove, touchend)
4. Calculate drag delta and apply transform
5. Implement loose bounds with edge easing
6. Add drag cursor affordance
7. Distinguish between drag and click actions
8. Optional: Implement inertia/momentum on release
9. Test drag functionality on desktop and mobile

## Dependencies
- Story 3.2: Build Grid View Layout

## Blocked By
- Story 3.2: Build Grid View Layout

## Blocking
- Story 4.5: Touch Support Optimization for Mobile

## Definition of Done
- [x] All acceptance criteria met
- [x] Drag works smoothly on desktop and mobile
- [x] Canvas bounds feel natural and loose
- [ ] Code committed to repository — left uncommitted/unstaged at the
      implementer's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-13
**Actual Implementation:**

- Mouse drag, touch-swipe, transform-based panning, and the drag-vs-click
  distinction (`useDragPan`, `src/app/list/components/artifact-grid/use-drag-pan.ts`)
  were already built in an earlier pass (Story 3.2-era work: a manually
  transformed track inside an `overflow: hidden` row, not native
  `overflow-x` scroll, so a centered track's own left-hand overflow stays
  reachable — a native scroll container can't reach that since `scrollLeft`
  can't go negative). This pass closed the two acceptance criteria that
  were still open: the "loose bounds, no hard edges" requirement, and
  (optional) release momentum.
- **Rubber-band bounds**: dragging past either hard edge is now allowed,
  with resistance, via the same easing formula iOS's `UIScrollView` bounce
  uses (`(1 - 1 / ((overshoot * 0.55) / max + 1)) * max`) — overshoot grows
  quickly at first and flattens out toward a 120px cap, so pushing further
  past the edge yields diminishing, never-unbounded visible movement
  instead of either a dead stop or infinite travel.
- **Spring-back on release**: if the pointer lifts while the track is past
  its hard bound (mid rubber-band), it animates back to that bound via a
  GSAP tween (`power2.out`, 0.45s) rather than snapping instantly.
- **Release momentum/inertia** (the story's optional nice-to-have): pointer
  velocity is tracked (lightly smoothed) through the drag, and a fast
  release that ends within bounds keeps coasting — decelerating via a GSAP
  tween projected from that velocity — instead of stopping dead the moment
  the finger lifts. A fast flick that lands exactly on a bound uses the
  same softer spring-back easing as an out-of-bounds release, so hitting
  the wall via momentum doesn't feel more abrupt than hitting it via a
  manual drag-then-release.
- The bounds check needed for both behaviors (`getMaxOffset`, measuring the
  live distance between the track's first/last child rather than
  `track.scrollWidth`, which under-reports a centered track's overflow) is
  now snapshotted once per gesture (at the moment a pointer move crosses
  the drag threshold) instead of re-measured via `getBoundingClientRect` on
  every `pointermove` and again on release — that distance can't change
  mid-gesture, so the repeated measurement was pure wasted layout work.
- Not routed through this codebase's usual `useGSAP`/`contextSafe`
  convention for event-triggered tweens (see `useExitFadeNavigation` in
  `lib/gsap-utils.ts`): `contextSafe` only defers invoking its wrapped
  function until it's actually called, but the React Compiler ESLint rule
  (`react-hooks/refs`) can't see that through an unrecognized third-party
  wrapper, and flagged this hook's own `useRef`-created refs as being read
  "during render". Used a plain `useCallback` plus an explicit
  `useEffect` cleanup (`gsap.killTweensOf`) instead, which gives the same
  "no leaked tween after unmount" guarantee without tripping the rule.
- Verified via Playwright (headless Chromium, no test framework in this
  repo — same precedent as every prior story) against `pnpm dev`: dragging
  a row past its bound shows visible rubber-band resistance and springs
  back to the exact bound on release (confirmed by reading the track's own
  inline `transform` before/during/after the gesture, not just visually);
  a fast flick coasts and decelerates smoothly after release; a plain
  click (zero movement) still navigates to the Detail page, confirming no
  drag/click regression.

### Review Findings

- [x] [Review][Fix] A tap/click landing while a spring-back or momentum
      tween was still coasting permanently froze the track: `onPointerDown`
      unconditionally killed the in-flight tween, but a non-drag pointerup
      returns early without ever calling `settle` again, so the track was
      left wherever the kill happened to catch it (possibly still past its
      bound) with nothing to correct it. Fixed by moving the
      `gsap.killTweensOf` call (and the drag's `startOffset` capture) from
      `onPointerDown` to the moment a real drag is confirmed (crossing the
      4px threshold in `onPointerMove`) — a plain click no longer touches
      the in-flight tween at all, letting it finish settling on its own.
- [x] [Review][Fix] A row's pan offset survived a category-filter change
      (Story 4.2) since `ArtifactGridRow` instances are keyed only by row
      index, not remounted when the underlying artifacts prop changes —
      dragging a row to its bound under "All Objects," then filtering to a
      category with fewer/narrower cards, left the old large offset applied
      to the new, narrower track, rendering it off-screen until the next
      manual drag. Fixed in `ListPageContent` (Story 4.2) by keying the
      active view on `${viewMode}-${category}` instead of `viewMode` alone,
      so a category change now remounts the view the same way a Grid⇄List
      toggle already did.
- [x] [Review][Fix] `getMaxOffset()` was recomputed on every `pointermove`
      and again in `endDrag`, despite the measured distance being invariant
      for the whole gesture — redundant `getBoundingClientRect` layout
      reads on a hot, high-frequency path. Fixed by snapshotting it once
      (in `drag.current.maxOffset`) at the moment a drag is confirmed, and
      reusing that value for the rest of the gesture.
- [x] [Review][Fix] A fast flick landing exactly on a bound used the
      punchier momentum easing (`power3.out`) instead of the softer
      spring-back easing (`power2.out`) used for an explicit
      out-of-bounds release — an inconsistent, slightly more abrupt stop
      for the one case (fast + at the wall) that should feel identical to
      the other (out of bounds + released). Fixed by detecting when the
      momentum branch's projected target got clamped to a bound and using
      the spring-back easing/duration in that case.
