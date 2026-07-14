# Story 4.2: Add Category Filter Bar

**Epic:** Epic 4 - List Page Interaction  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** visitor  
**I want to** filter artifacts by category  
**So that** I can focus on specific types of artifacts

## Acceptance Criteria
- [x] Category filter bar matches Figma design
- [x] Filter bar displays categories from mock data (3-4 categories + "All") —
      the real mock dataset has 7 categories, not 3-4; the filter bar shows
      all 7 plus "All Objects", per `categories bar.png`
- [x] Selecting a category filters artifacts in both Grid and List views
- [x] "All" option shows complete artifact set
- [x] Selected category is visually indicated
- [x] Filter state persists when switching between Grid and List views
- [x] Filter bar is responsive across breakpoints

## Technical Notes
- Extract unique categories from mock data
- Implement filter logic in data utility functions
- Use React state for selected category
- Ensure filter updates both view modes
- Design filter bar to match Figma (horizontal scroll on mobile if needed)

## Implementation Tasks
1. Extract unique categories from mock data
2. Create CategoryFilter component
3. Implement filter bar UI matching Figma design
4. Add category selection state management
5. Implement filter logic for artifacts
6. Ensure filter works for both Grid and List views
7. Add visual indication of selected category
8. Implement responsive behavior for mobile
9. Test filter functionality

## Dependencies
- Story 1.5: Create Mock Data Layer
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout
- Story 3.4: Implement View Switcher Toggle

## Blocked By
- Story 1.5: Create Mock Data Layer
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout
- Story 3.4: Implement View Switcher Toggle

## Blocking
- Story 4.3: Implement Empty State Handling
- Story 4.4: Preserve State Across View Mode Switching

## Definition of Done
- [x] All acceptance criteria met
- [x] Filter works correctly for both views
- [x] Category selection persists across view switches
- [ ] Code committed to repository — left uncommitted/unstaged at the
      implementer's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-13
**Actual Implementation:**

- The data layer for this story was already prepared in an earlier pass
  (`ALL_OBJECTS_FILTER`, `ArtifactTypeFilter`, `ARTIFACT_CATEGORIES` in
  `src/lib/data-utils.ts`, in Figma-board order, "All Objects" first).
  Added `filterArtifactsByType(artifacts, type)` — a pure function taking
  the artifact array as a parameter rather than always reading
  `mockArtifacts` itself, so a client component can re-filter the exact
  props it was server-rendered with instead of reaching back into the data
  module. The pre-existing `getArtifactsByType`/`getArtifactCategories`
  (which read `mockArtifacts` directly) had no remaining callers once
  `ListPageContent` switched to the new function + the `ARTIFACT_CATEGORIES`
  constant directly, so they were removed rather than left as dead exports.
- Built `CategoryFilter` at `src/app/list/components/category-filter/`: a
  gray pill track (the same `#c7c6c5` "Separators" gray as `ViewSwitcher`'s
  own track) holding every category as plain text, with the selected one
  set apart in its own cream pill — per `categories bar.png`'s dev-mode
  export. Horizontal scroll (`overflow-x-auto`, scrollbar hidden) covers
  narrow viewports where all 8 options (7 categories + "All Objects") don't
  fit on one line. Uses `role="group"` + `aria-pressed` per button rather
  than the ARIA `radiogroup` pattern, which expects roving-tabindex
  arrow-key navigation this bar doesn't implement (each button is its own
  plain tab stop) — same "don't claim ARIA semantics the interaction model
  doesn't back up" call `ViewSwitcher` made about the toggle-button pattern.
- Filter state (`category`) lives in `ListPageContent` as a sibling to the
  existing `viewMode` state, not nested inside it — switching Grid⇄List
  never touches `category`, so the selection persists across that toggle
  for free, with no extra plumbing.
- `CategoryFilter` sits in a new fixed position just below `SiteHeader`
  (`top-20`/`sm:top-24`, the same "floating chrome" treatment `SiteHeader`/
  `SiteFooter`/`ViewSwitcher` already use). `ArtifactGridRow_first`'s and
  `ArtifactList`'s existing top-clearance padding — previously a smaller
  placeholder value reserved for this exact, not-yet-built bar — was
  updated to actually clear it (`pt-16 lg:pt-20`).
- Verified via Playwright (headless Chromium, no test framework in this
  repo): the filter bar renders "All Objects" (selected by default) plus
  all 7 categories in the correct order; selecting "Wearable" filters both
  the Grid canvas and the List rows down to exactly the 4 Wearable
  artifacts; the selection survives a Grid→List→Grid round trip; no
  console errors in any of these flows.

### Review Findings

- [x] [Review][Fix] Filtering to a category with fewer/narrower cards left
      a row's *previous* pan offset (from Story 4.1's drag/pan) applied to
      the new, shorter content, since `ArtifactGrid`'s rows are keyed only
      by row index and weren't remounted by a category change — the row
      could render partially or fully outside its own visible bounds until
      manually dragged again. Fixed by keying `ListPageContent`'s active
      view on `${viewMode}-${category}` instead of `viewMode` alone, so a
      category change now remounts the view exactly like a Grid⇄List
      toggle already did — which also has the side benefit of replaying
      the `useScrollReveal` entrance animation for the newly-filtered cards
      instead of leaving them at full opacity with no reveal.
- [x] [Review][Cleanup] `getArtifactsByType`/`getArtifactCategories` (see
      above) were orphaned exports after the switch to
      `filterArtifactsByType`/`ARTIFACT_CATEGORIES` — removed rather than
      left as dead code that a future reader could mistake for the actual
      filtering entrypoint. Updated the one remaining doc comment in
      `src/types/artifact.ts` that referenced the old function name by name.

**Deferred (see `deferred-work.md`):** the shared "no results for this
category" empty state (Story 4.3's explicit scope — not reachable today
since every real category has at least one matching artifact) and a
shared constant tying `CategoryFilter`'s fixed position/height to the
grid/list top-clearance padding that currently only cross-reference each
other via comments.
