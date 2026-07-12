# Story 3.3: Build List View Layout

**Epic:** Epic 3 - List Page Foundation  
**Status:** In Progress  
**Priority:** High  
**Story Points:** 2

## User Story

**As a** visitor  
**I want to** see artifacts displayed in a vertical list layout  
**So that** I can browse the collection textually

## Acceptance Criteria

- [x] List layout displays artifacts in a vertical scrollable list
- [x] List uses Artifact Thumbnail components (adapted for list view)
- [x] List is data-driven from mock data array
- [x] List spacing and alignment match Figma specifications
- [x] List is vertically scrollable with native scroll behavior
- [x] List adapts to different screen sizes
- [x] Empty state handled if no artifacts exist

## Technical Notes

- Use flexbox or CSS Grid for vertical list layout
- Standard scrollable container (no drag/pan behavior in list mode)
- Adapt Thumbnail component for list view (possibly horizontal layout)
- Ensure smooth scrolling performance

## Implementation Tasks

1. Create list view layout component
2. Adapt Artifact Thumbnail component for list view
3. Implement vertical scrollable container
4. Connect to mock data layer
5. Implement responsive behavior
6. Add empty state handling
7. Test list layout with various screen sizes
8. Verify smooth scrolling performance

## Dependencies

- Story 1.5: Create Mock Data Layer
- Story 3.1: Create Artifact Thumbnail Component

## Blocked By

- Story 1.5: Create Mock Data Layer
- Story 3.1: Create Artifact Thumbnail Component

## Blocking

- Story 3.4: Implement View Switcher Toggle

## Definition of Done

- [x] All acceptance criteria met
- [x] List layout matches Figma specifications
- [x] Empty state works correctly
- [x] Code committed to repository
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-12
**Actual Implementation:**

- Built `ArtifactList` at `src/app/list/components/artifact-list/`: a `<ul>` of `ArtifactThumbnail` (`variant="list"`, Story 3.1) rows, each with its own divider rule (`ArtifactThumbnail_list`'s `border-b`, already built in Story 3.1) and a data-driven `getAllArtifacts()` source, with the same shared `ListEmptyState` fallback used by `ArtifactGrid` (Story 3.2) when the array is empty.
- No overflow container or drag/pan logic — the list scrolls with the page's own native scroll, per this story's "standard scrollable container" Technical Note; this is the same native-scroll mechanism the Grid view's _vertical_ dimension relies on (only Grid's horizontal axis gets its own scoped `overflow-x` box, since only it needs to be "oversized").
- The first row's thumbnail is marked `priority` (it's reliably above-the-fold in a single-column vertical list, unlike Grid's breakpoint-dependent layout).
- **Not yet wired into the `/list` route** — `page.tsx` renders `ArtifactGrid` by default (matching `Gallery.png`'s primary desktop mockup); this component was verified by temporarily rendering it from `page.tsx` during development (screenshots at mobile/tablet/desktop, a Playwright keyboard-navigation check confirming exactly one focusable "Explore Story" link per row, and an empty-state check), then reverted. It's ready for Story 3.4 to render conditionally via its `ViewMode` client state and pill toggle.
- Verified manually (no test framework in this repo — see Story 3.1's precedent): Playwright screenshots across breakpoints, `console --errors` (only Story 1.5's expected placeholder-image 400s), and a keyboard tab-order check.

### Review Findings

- [x] [Review][Patch] Page-level top/bottom padding shared with the Grid view (`src/app/list/styles.module.css`) shrank footer clearance while growing header clearance at the `sm:` breakpoint — fixed to grow both together; see Story 3.2's Review Findings for the same fix (this file's clearance is shared, not duplicated, across both views).
- Dismissed as noise: duplicating the 3-line empty-array guard between `ArtifactGrid` and `ArtifactList` (flagged in review) was kept as-is rather than hoisted to a shared call site — once Story 3.4 conditionally renders one or the other from client state, each view needs to independently handle an empty array regardless of which one is mounted, so the guard belongs on each component, not upstream.

## Scroll Reveal Added (2026-07-12)

`ArtifactList` is now a Client Component using the shared `useScrollReveal` hook (`src/lib/gsap-utils.ts`, added alongside this change — see Story 3.2's own entry for the same date for the fuller writeup, since both views share the one hook). Each row fades/slides in via `ScrollTrigger.batch()` as it scrolls into view, respecting `prefers-reduced-motion`. Verified by temporarily swapping `ArtifactList` back into `page.tsx` (same manual-check-then-revert precedent already established for this not-yet-wired-in component) — screenshots at rest and mid-scroll confirm rows fade/slide in correctly, then reverted `page.tsx` to Grid.

## Exit Animation Added (2026-07-12)

`ArtifactList` also uses the new `useExitFadeNavigation` hook (see Story 3.2's own entry for the same date — the correctness pitfall documented there, `onClick` vs `onClickCapture`, applies identically here). Wired to the `<ul>`'s `onClickCapture`. Verified for both of a List row's overlapping link targets (the "Explore Story" link and its stretched full-row sibling, Story 3.1) via a temporary swap into `page.tsx` — both correctly trigger the fade-out-then-navigate sequence, confirmed via URL polling at 200ms intervals rather than a single end-state check.
