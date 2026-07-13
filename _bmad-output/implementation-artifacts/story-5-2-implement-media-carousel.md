# Story 5.2: Implement Media Carousel

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Done  
**Priority:** Low (Stretch)  
**Story Points:** 4

## User Story
**As a** visitor  
**I want to** swipe or click through multiple images of an artifact  
**So that** I can view the artifact from different angles or perspectives

## Acceptance Criteria
- [x] Carousel displays multiple media items for the artifact
- [x] Carousel supports click/arrow navigation — the "More Images" button
      (per the detail mock) plus clickable dot indicators; see
      Implementation Summary for why dedicated on-image arrow buttons
      weren't added on top of these
- [x] Carousel supports swipe gesture on touch devices
- [x] Carousel loops or reaches end gracefully — wraps at both ends
- [x] Current slide position is indicated — dot indicators
- [x] Carousel is responsive across breakpoints
- [x] Carousel handles single-item media gracefully — hides "More Images"/
      dots entirely when there's nothing to advance to

## Technical Notes
- Use React state for current slide index
- Implement touch handlers for swipe detection
- Use CSS transforms for smooth slide transitions
- Add visual indicators (dots, arrows, or progress bar)
- Ensure images are optimized with Next.js Image component

## Implementation Tasks
1. Create MediaCarousel component
2. Implement slide state management
3. Add click/arrow navigation
4. Implement touch swipe detection
5. Add slide indicators (dots/arrows)
6. Implement smooth transitions with CSS transforms
7. Handle single-item media case
8. Add responsive behavior
9. Test carousel functionality

## Dependencies
- Story 5.1: Build Detail Page Layout

## Blocked By
- Story 5.1: Build Detail Page Layout
- **Epic 1-4 completion required before starting Epic 5**

## Blocking
- Story 5.3: Add Audio Controls (Play/Pause/Listen)

## Definition of Done
- [x] All acceptance criteria met
- [x] Carousel works smoothly on desktop and mobile
- [ ] Code committed to repository — left uncommitted/unstaged at the
      implementer's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Note
This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-13
**Actual Implementation:**

- Built `MediaCarousel` (`src/app/detail/components/media-carousel`): a
  single active slide inside an `overflow: hidden` frame, advanced via a
  CSS `transform`-driven track (`translateX(-${index * 100}%)`, per this
  story's own Technical Notes) rather than swapping the rendered
  `<Image>`'s `src` directly.
- **Four independent ways to change slides**, covering the "isn't a 'More
  Images'-only interaction on desktop" AC: the "More Images" button
  (bottom-right, per the detail mock and its downward-chevron treatment —
  new `ChevronDownIcon`, `src/components/ui/icons.tsx`), the dot
  indicators (`role="tab"`, click any dot to jump directly — doubles as
  the current-slide indicator), `ArrowLeft`/`ArrowRight` while the frame
  has focus (`tabIndex={0}` + `role="group"`), and a touch swipe
  (`onTouchStart`/`onTouchEnd`, 40px minimum travel before it counts as a
  slide change rather than incidental jitter). All four wrap at either end
  via the same `goTo` modulo helper.
- **Deliberately no dedicated left/right arrow-button overlay on the
  image itself.** The captured detail mock only shows the single "More
  Images" affordance; the "click/arrow navigation" AC is read as "clicking
  something" (the dots, which the mock's own mock doesn't show either but
  are a near-universal carousel convention) plus "arrow-*key*
  navigation" (keyboard), not as requiring a second, mock-absent pair of
  on-image buttons that would duplicate what "More Images" and the dots
  already cover. Backward navigation is still fully available via
  `ArrowLeft`, swipe, and clicking an earlier dot.
- **Single-item and missing-media handling:** `hasMultiple = media.length
  > 1` gates the "More Images" button and dot row entirely — verified
  against the Bamboo Pen (the one mock artifact with exactly one media
  image). `DetailPageContent` falls back to `[artifact.thumbnail]` for the
  theoretical case of an empty `media` array; `MediaCarousel` itself also
  returns `null` for that case as a second, independent guard.
- **Missing asset resilience:** the `media` images referenced by
  `src/data/mock-data.ts` aren't backed by real files yet beyond each
  artifact's own `thumbnail.jpg` (a pre-existing, already-documented gap —
  see `deferred-work.md`) — this is the first story to actually render
  them. Added an `onError`-driven hide (per slide index, so one failed
  image doesn't affect the others) matching `ArtifactThumbnail`'s own
  established convention, so a missing image degrades to the frame's
  plain `bg-background-elevated` backdrop instead of the browser's broken-
  image icon.
- Verified via Playwright (headless Chromium): Mshatta Façade (3 media
  images) — 3 dots render, clicking "More Images" advances from slide 1 to
  slide 2 (confirmed via the active dot's `aria-label`); Bamboo Pen (1
  media image) — zero dots, no "More Images" button rendered. No console
  errors from this component's own code.

**Deferred (see `deferred-work.md`):** the `media` assets themselves
remain unbacked by real files (pre-existing gap, not newly introduced by
this story).

### Review Findings

An 8-angle adversarial code review ran against Stories 5.1/5.2 together
(see `deferred-work.md`'s "Code review pass" entry for the full list).
Two findings landed in this story specifically:

- [x] [Review][Fix] The touch handlers (`onTouchStart`/`onTouchEnd`) were
      attached to the outer carousel container, which also contains the
      "More Images" and dot buttons as real descendants — since touch
      events bubble, a tap-with-drag on either button could fire both the
      button's own `onClick` and the swipe handler, advancing two slides
      for one tap. Fixed with a `closest('button')` guard so a touch that
      starts on a button is never treated as a swipe.
- [x] [Review][Cleanup] `goTo`/`goToNext`/`goToPrev` were wrapped in
      `useCallback` with no memoized consumer to benefit from it, and
      `goToNext`/`goToPrev` read `index` from a closure. Simplified to
      plain functions using the functional `setIndex(current => ...)`
      form — removes three unnecessary hooks and any stale-closure risk.

One candidate finding was **refuted** rather than accepted: a reviewing
agent suspected `index`/`erroredIndices` state could persist stale across
a client-side "Next story" navigation to a different artifact (no
`key={artifact.id}` on `MediaCarousel`). Verified directly with
Playwright instead of assumed — this Next.js 16.2.10 install fully
remounts the page subtree on a dynamic-segment change (`cacheComponents`
off), confirmed by advancing to slide 2 on one artifact, navigating via
"Next story," and observing the new artifact's carousel start cleanly at
slide 1.
