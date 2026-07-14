# Story 3.1: Create Artifact Thumbnail Component

**Epic:** Epic 3 - List Page Foundation  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** developer  
**I want to** create a reusable Artifact Thumbnail component  
**So that** artifact displays are consistent across Grid and List views

## Acceptance Criteria
> Reconciled against the fuller AC set in `EPICS_AND_STORIES.md` (Epic 3 →
> Story 3.1), which supersedes the shorter draft this file originally
> shipped with — see the Implementation Summary below.

- [x] Grid variant: square thumbnail image with the artifact title captioned below (per `Gallery.png`/`THUMBNAILS.png`)
- [x] List variant: thumbnail image + title on the left, an "Explore Story" text link with a circular arrow icon on the right (per `Link.png`), separated by a divider rule between rows
- [x] A loading/skeleton state (checkerboard placeholder per `Thumbnail.png`) displays while the image loads
- [x] Component accepts artifact data as props (id, title, thumbnail, type)
- [x] Component is clickable (whole row/card, plus the explicit "Explore Story" link in list view) and routes to Detail page
- [x] Component has hover states matching Figma design
- [x] Component is responsive across breakpoints
- [x] Component uses mock data from shared data layer
- [x] No hardcoded content in component

## Technical Notes
```typescript
interface ArtifactThumbnailProps {
  artifact: Artifact;
  variant: 'grid' | 'list';
  onClick?: (id: string) => void;
}
```
- Use Next.js Image component for optimized images, with `placeholder="blur"` or a custom skeleton to match the loading state export
- Implement proper image aspect ratios from Figma
- Add hover effects (scale, shadow, or overlay)

## Implementation Tasks
1. Create ArtifactThumbnail component file
2. Define TypeScript interface for component props
3. Implement component layout with image and title
4. Add hover states matching Figma design
5. Make component clickable with onClick handler
6. Integrate with mock data layer
7. Implement responsive behavior
8. Test component in isolation

## Dependencies
- Story 1.5: Create Mock Data Layer
- Story 1.4: Establish Project Folder Structure

## Blocked By
- Story 1.5: Create Mock Data Layer
- Story 1.4: Establish Project Folder Structure

## Blocking
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout
- Story 3.5: Wire Thumbnail Navigation to Detail Page

## Definition of Done
- [x] All acceptance criteria met
- [x] Component is reusable and data-driven
- [x] Code committed to repository
- [x] No console errors or warnings
- [x] TypeScript types are properly defined

## Implementation Summary
**Status:** ✅ Done
**Implementation Date:** 2026-07-12
**Actual Implementation:**
- Built `ArtifactThumbnail` at `src/app/list/components/artifact-thumbnail/` — page-scoped rather than in `src/components/`, since Grid and List (Stories 3.2/3.3) are two view-modes of the single List page (switched via Story 3.4's React state), not separate routes, matching the folder convention documented in Story 1.4.
- **Grid variant**: the whole card is a single `next/link` to `/detail/[id]`, containing a square image (checkerboard skeleton until loaded) and a title caption below.
- **List variant**: image + title on the left, a real, independently-focusable "Explore Story" `next/link` + arrow icon on the right, and — since the card/row needs to be clickable *as well as* that explicit link (an AC this file's original draft under-specified relative to `EPICS_AND_STORIES.md`) — an additional invisible, full-row "stretched link" sibling (`aria-hidden`, `tabIndex={-1}`) handles clicks anywhere else in the row. This avoids nesting an `<a>` inside an `<a>` (invalid HTML) while still giving keyboard/screen-reader users exactly one meaningful link per row.
- Added `ExploreStoryArrowIcon` to `src/components/ui/icons.tsx` (circle + arrow, matching `Link.png`; no Figma SVG export existed for this glyph).
- Checkerboard skeleton (CSS `linear-gradient` checker, matching `Thumbnail.png`) shows while the image loads and stays up on load error — the mock dataset's `thumbnail` paths aren't backed by real files in `public/images` yet (a pre-existing gap from Story 1.5, out of scope here).
- Hover states: grid card gets an image scale + drop shadow on hover; list row gets a background tint, with the "Explore Story" text/icon shifting color and translating slightly. Mirrored `:focus-visible` states so keyboard users get the same affordances (see Review Findings).
- Verified via a temporary local-only preview route (`src/app/dev-preview/...`, created for QA and deleted before finalizing — not part of this change set) rendering all 12 mock artifacts in both variants, plus Playwright checks (headless Chromium) for: hover/focus visual states, keyboard tab order landing on exactly the "Explore Story" link per list row, mouse clicks anywhere in a row correctly navigating to `/detail/[id]`, and no console/page errors besides the expected 400s from the still-missing mock image files.
- No automated test suite exists in this repo (confirmed via `package.json`), consistent with how prior stories were verified.

### Review Findings

- [x] [Review][Patch] "Explore Story" was only a decorative span, not a separately clickable/focusable target in list view [src/app/list/components/artifact-thumbnail/index.tsx] — fixed via the stretched-link pattern described above.
- [x] [Review][Patch] Hover-only affordances (image scale, shadow, explore text/icon) had no keyboard-focus equivalent [styles.module.css] — added matching `:focus-visible` rules.
- [x] [Review][Patch] A failed image load could show the browser's native broken-image glyph bleeding through the translucent skeleton [styles.module.css] — the `<img>` is now hidden (`opacity-0`) on error.
- [x] [Review][Patch] `onLoad` isn't guaranteed to fire for an already browser-cached image [index.tsx] — added a mount-time `img.complete` check as a fallback.
- [x] [Review][Patch] List variant's `sizes="80px"` didn't match its actual 64px mobile render size [index.tsx] — made responsive (`(max-width: 640px) 64px, 80px`).
- [x] [Review][Patch] No `priority` prop for Stories 3.2/3.3 to mark above-the-fold thumbnails for LCP [index.tsx] — added an optional `priority?: boolean` prop threaded to `next/image`.
- [x] [Review][Patch] Image `alt` duplicated the adjacent visible title caption (redundant screen-reader announcement) and was fragile if `title` were ever empty [index.tsx] — set `alt=""` since the caption already serves as the description.
- [x] [Review][Patch] `onClick` prop semantics (fires alongside navigation, can't cancel it) were undocumented [index.tsx] — documented via a doc comment.
- [x] [Review][Defer] Clicking any thumbnail currently lands on Next's bare, unstyled not-found page (no site header/footer) until Story 3.5 builds `/detail/[id]` out — deferred, pre-existing/out-of-scope; see `deferred-work.md`.
- Dismissed as noise: `artifact.thumbnail`/`artifact.id` being empty or containing URL-reserved characters (both are developer-authored data-layer values, never user input, and can't occur with the current mock dataset — not worth defensive code per this project's "don't validate what can't happen" convention).
