# Story 5.1: Build Detail Page Layout

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Done  
**Priority:** Low (Stretch)  
**Story Points:** 3

## User Story

**As a** visitor  
**I want to** see a detailed view of an artifact with all its information  
**So that** I can learn about the artifact in depth

## Acceptance Criteria

- [x] Detail page layout matches Figma specifications — top bar with
      "All Objects" back-link (left) and "Next story" (right); two-column
      desktop layout (media left, text right), per the Mshatta Façade
      detail mock
- [x] Page displays artifact title, description, and metadata — title,
      divider, "Contributed by [Name]" byline, divider, italicized
      pull-quote, audio player slot, factual description paragraph, and
      the contributor's personal/migration narrative paragraph, in that
      order per the master spec's own acceptance criteria
- [x] Primary media area is prominently displayed — `MediaCarousel`
      (Story 5.2), left column on desktop / stacked above text on mobile
- [x] Layout is responsive across breakpoints
- [x] Page handles missing optional fields gracefully (no crash) — no
      contributor, no audio, no media all fall back cleanly (see
      Implementation Summary)
- [x] Navigation back to List page is available
- [x] Back navigation preserves previous filter/view mode if feasible —
      already covered by Story 4.4's `sessionStorage` restore; "All
      Objects" is a plain link to `/list`, no query-param plumbing needed

## Technical Notes

- Use dynamic route `/detail/[id]`
- Fetch artifact data by ID from mock data
- Handle missing data with conditional rendering
- Implement back button with proper routing
- Consider URL state for preserving filter/view mode

## Implementation Tasks

1. Create detail page route structure `/detail/[id]`
2. Fetch artifact data by ID from mock data
3. Implement layout with title, description, and metadata
4. Create primary media area
5. Add back navigation button
6. Implement conditional rendering for missing fields
7. Add responsive behavior
8. Test with various artifact data scenarios

## Dependencies

- Story 1.5: Create Mock Data Layer
- Story 3.5: Wire Thumbnail Navigation to Detail Page

## Blocked By

- Story 1.5: Create Mock Data Layer
- Story 3.5: Wire Thumbnail Navigation to Detail Page
- **Epic 1-4 completion required before starting Epic 5**

## Blocking

- Story 5.2: Implement Media Carousel

## Definition of Done

- [x] All acceptance criteria met
- [x] Layout matches Figma specifications
- [x] Handles missing data gracefully
- [ ] Code committed to repository — left uncommitted/unstaged at the
      implementer's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Note

This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-13
**Actual Implementation:**

- Epics 1-4 (required scope) and Epic 6 QA are all separately tracked as
  complete/pending in `sprint-status.yaml`; this pass picks up Epic 5 as
  stretch scope per this story's own Note.
- Replaced Story 3.5's `DetailPlaceholder` (`src/app/detail/components/
detail-placeholder`, deleted) with **`DetailPageContent`**
  (`src/app/detail/components/detail-page-content`) — that component's own
  doc comment explicitly anticipated being superseded once Epic 5 landed,
  rather than left in place as a permanent stopgap.
- New **`DetailToolbar`** (`src/app/detail/components/detail-toolbar`): a
  bordered pill-shaped bar with "All Objects" (left, `BackArrowIcon`) and
  "Next story" (right, reusing `ExploreStoryArrowIcon` — already the
  site's own "advance to the next thing" affordance from `ArtifactThumbnail`'s
  list-variant "Explore Story" link, so no new icon was needed for this).
  "Next story" resolves via a new `getNextArtifact(currentId)`
  (`src/lib/data-utils.ts`) — always the next artifact in the full mock
  dataset's own order, wrapping to the first after the last, regardless of
  any List page category filter, per this story's own Technical Notes
  ("next artifact ID in the mock data array, wrapping around at the end").
- **Back navigation preservation** turned out to need no new work: Story
  4.4 already persists `ListPageContent`'s `viewMode`/`category` to
  `sessionStorage` and restores them on mount, which is exactly the "full
  unmount, then remount" transition a Detail page visit produces. "All
  Objects" is a plain `<Link href="/list">` — no query-param round trip
  was added, since one would just duplicate state Story 4.4 already
  round-trips through `sessionStorage`.
- **Layout** (`DetailPageContent`): a CSS Grid, single column (media above
  text) by default, switching to a `[1.1fr_1fr]` two-column split at the
  `lg` breakpoint — matching the Mshatta Façade mock's desktop layout and
  the "media stacks above text on mobile" AC. Content order follows the
  master spec's own AC list precisely: title → divider → "Contributed by
  [Name]" → divider → italicized pull-quote → audio player slot → factual
  description paragraph → contributor's personal/migration narrative
  paragraph.
- **Graceful missing-data handling:** the entire contributor block (byline
  - its divider + quote) is wrapped in `artifact.contributor && (...)`, so
    an artifact with no contributor renders the title/divider/audio
    player/description and nothing else in that slot — not reachable with
    the current 12-artifact mock dataset (every artifact has a contributor),
    but the `Artifact` type still leaves `contributor` optional and this
    page never assumes it's present. `artifact.contributor?.story` is a
    second, independent guard for the personal-narrative paragraph
    specifically. `AudioPlayer` (Story 5.2/5.3 boundary below) renders a
    disabled state for `audioUrl: null` rather than being omitted.
- **Audio player scope call:** this story's own AC requires "the audio
  player (Story 5.3)" to appear in the content stack even though Story 5.3
  itself wasn't in scope for this pass. Built a minimal but fully working
  `AudioPlayer` (`src/app/detail/components/audio-player`) — native HTML5
  `<audio>`, a play/pause toggle, a real seekable `<input type="range">`
  progress bar, and `m:ss / m:ss` elapsed/total labels — so the layout
  never ships a dead placeholder in that slot. The mock's exact tick-mark
  waveform scrubber and mute toggle are left for Story 5.3 itself; see
  `deferred-work.md` for the precise boundary.
- Verified via Playwright (headless Chromium, no test framework in this
  repo) across three representative artifacts: Mshatta Façade (3 media
  images, audio, full contributor block), Bamboo Pen (single media item),
  and Carnival Mask (no audio) — plus a 1440px desktop and a 390px mobile
  viewport, and an unknown id still resolving to the site's own
  `not-found.tsx` (404). No console errors from this story's own code (see
  `deferred-work.md` for the two categories of pre-existing, unrelated
  console noise this pass newly exercises for the first time).

**Deferred (see `deferred-work.md`):** Story 5.3's full audio player
fidelity (waveform-tick scrubber, mute toggle); the `media` (and
`audioUrl`) assets referenced by `src/data/mock-data.ts` beyond each
artifact's own `thumbnail.jpg` remain unbacked by real files — a
pre-existing, already-documented gap that this story is the first to
actually load/play against.

### Review Findings

An 8-angle adversarial code review ran against Stories 5.1/5.2 together
before this shipped (see `deferred-work.md`'s "Code review pass" entry
for the full list). Two findings landed in this story specifically:

- [x] [Review][Fix] `AudioPlayer.handleToggle` set `isPlaying` optimistically
      right after calling `audio.play()`, before the returned promise
      resolved/rejected. Every mock artifact's `audioUrl` currently 404s
      (see above), so `play()` always rejects with a `NotSupportedError` —
      confirmed via Playwright that the toggle button got stuck showing
      "Pause" forever with no audio actually playing. Fixed by deriving
      `isPlaying` from the `<audio>` element's own `play`/`pause` events
      instead.
- [x] [Review][Cleanup] `AudioPlayer`'s `audioUrl: null` disabled state and
      its normal playing state were two hand-duplicated JSX branches —
      merged into one render with a `disabled` boolean threaded through,
      so Story 5.3's waveform/mute additions only need to touch one branch
      going forward.

Two candidate findings from the review were **refuted** by an empirical
Playwright test rather than accepted: a reviewing agent suspected
`AudioPlayer`'s state (and separately, `MediaCarousel`'s) could persist
stale across a client-side "Next story" navigation to a different
artifact (no `key={artifact.id}` on either component). Verified directly
instead of assumed — this Next.js 16.2.10 install has `cacheComponents`
off, so the page subtree fully remounts on a dynamic-segment change;
advancing the carousel and starting playback on one artifact, then
navigating to another, showed both reset cleanly with no stale state.
