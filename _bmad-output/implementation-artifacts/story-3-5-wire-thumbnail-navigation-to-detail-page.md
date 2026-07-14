# Story 3.5: Wire Thumbnail Navigation to Detail Page

**Epic:** Epic 3 - List Page Foundation  
**Status:** Done  
**Priority:** High  
**Story Points:** 2

## User Story
**As a** visitor  
**I want to** click an artifact thumbnail and navigate to its detail page  
**So that** I can explore individual artifacts in depth

## Acceptance Criteria
> Reconciled against the fuller AC set in `EPICS_AND_STORIES.md` (Epic 3 →
> Story 3.5), which supersedes the shorter draft this file originally
> shipped with — same reconciliation Story 3.1 made against its own draft.

- [x] Clicking a thumbnail (grid view) or the "Explore Story" link (list
      view) navigates to the Detail page with the artifact ID
- [x] Navigation uses Next.js dynamic routing (e.g., `/detail/[id]`)
- [x] If Detail page is not built, navigates to placeholder or shows alert
- [x] Navigation passes artifact data or ID to Detail page
- [x] Navigation is smooth and instant (client-side routing)
- [x] Back navigation from Detail page returns to List page

## Technical Notes
- Use Next.js Link component with dynamic route
- Route structure: `/detail/[id]` or similar
- Pass artifact ID via URL params or router state
- Implement fallback if Detail page is not built (placeholder route)

## Implementation Tasks
1. Update ArtifactThumbnail component with Link wrapper
2. Implement dynamic routing to detail page
3. Pass artifact ID via URL params
4. Create detail page route structure (even if placeholder)
5. Implement fallback if detail page is not fully built
6. Test navigation from thumbnail to detail page
7. Test back navigation from detail to list
8. Verify smooth client-side routing

## Dependencies
- Story 3.1: Create Artifact Thumbnail Component
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout

## Blocked By
- Story 3.1: Create Artifact Thumbnail Component
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout

## Blocking
- Story 5.1: Build Detail Page Layout (if Epic 5 is implemented)

## Definition of Done
- [x] All acceptance criteria met
- [x] Navigation works correctly
- [x] Fallback works if detail page is not built
- [ ] Code committed to repository — left uncommitted/unstaged at the
      implementer's explicit request for this pass; ready to commit
- [x] No console errors or warnings in a production build (`pnpm build &&
      pnpm start`); one dev-mode-only warning remains in `pnpm dev`,
      confirmed pre-existing and unrelated to this story's code — see
      Review Findings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-12
**Actual Implementation:**

- `ArtifactThumbnail` (Story 3.1) already linked every card/row to
  `/detail/[id]`; this story builds that route out. Added
  `src/app/detail/[id]/page.tsx` (an async Server Component reading the
  dynamic segment via `await params`, per Next 16's `params`-as-Promise
  convention) and `src/app/detail/components/detail-placeholder/`, a real
  (not generic-stand-in) placeholder page rendering the artifact's image,
  type, title, description, and pull-quote — everything the mock data
  layer (Story 1.5) already has, so it's a page Epic 5 can extend with the
  media carousel/audio/zoom/PDF/comment/migration-journey controls rather
  than replace outright.
- An unknown `id` calls `notFound()` rather than rendering nothing. Added
  `src/app/not-found.tsx` (a site-wide 404 that renders inside
  `RootLayout`, so it keeps `SiteHeader`/`SiteFooter` chrome) to replace
  Next's bare built-in 404, which bypasses custom layouts entirely — this
  also resolves the interim gap flagged in `deferred-work.md` from Story
  3.1's review ("Clicking any thumbnail currently 404s to Next's bare,
  unstyled not-found page").
- Back navigation is a plain `next/link` to `/list` on both the Detail
  placeholder and the 404 page — no `router.back()`, since a Detail page
  can be reached by a direct URL/shared link with no List page in the
  session's history to go back to; a fixed destination is correct in both
  cases.
- This route's `<title>` is a per-artifact `generateMetadata` (async,
  reading `params`); `app/not-found.tsx` has its own static `metadata` so
  the invalid-id case gets a real "Artifact Not Found" tab title instead
  of silently inheriting the root layout's default one (confirmed via a
  direct request that it otherwise does) — see the Review Findings below
  for the console-warning investigation this route's metadata approach
  went through before landing here.
- Verified via Playwright (headless Chromium, no test framework in this
  repo — same precedent as every prior Epic 3 story) against both `pnpm
  dev` and a `pnpm build && pnpm start` production build: List → toggle to
  List view → click "Explore Story" → exit-fade → lands on
  `/detail/wooden-chest` with the correct artifact's image/title/
  description/quote rendered; "Back to Gallery" returns to `/list`;
  `/detail/does-not-exist-xyz` (and other invalid ids) render the new
  site-chrome 404 instead of a bare dead end; `pnpm ts:check`, `pnpm lint`,
  and `pnpm format` all pass on every new/changed file.

### Review Findings

- [x] [Review][Investigated, no code change needed] An initial isolated
      test suggested this route's async `generateMetadata` was the cause
      of a dev-mode-only "Encountered a script tag while rendering React
      component" console warning during client-side navigation into this
      segment, and this file briefly (and incorrectly) documented "fixed
      by using a static `metadata` export instead" — a stale claim caught
      in review, since the code was never actually left on static
      metadata. Repeating the test with **repeated hits to the same
      route** (rather than one-off requests interleaved with file edits,
      which was confusing the result with dev-server recompilation
      timing) showed the warning is deterministically tied to the
      `notFound()`/404 rendering path regardless of metadata strategy —
      reproduced even with Next's bare built-in 404, before
      `app/not-found.tsx` existed. `generateMetadata` was restored (kept
      dynamic; see the Implementation Summary above) since it was never
      the actual cause.
- [x] [Review][Confirmed, not fixed] Visiting **any** unmatched route (or
      an id that calls `notFound()`) logs that same "Encountered a script
      tag..." warning in `pnpm dev` — a pre-existing Next.js 16.2.10
      dev-mode interaction between `notFound()`/unmatched-route rendering
      and the root layout's _pre-existing_ inline `<script>` bootstrap
      (Story 1.7's `THEME_INIT_SCRIPT`, `layout.tsx`, deliberately a raw
      inline tag since it must run before hydration to prevent a theme
      flash — `next/script` isn't a substitute, and touching it is out of
      this story's scope). Not something this story's code introduced,
      and it only ever fires in `pnpm dev` — confirmed **absent** in a
      `pnpm build && pnpm start` production run (React strips this class
      of dev-only warning in production builds) — see `deferred-work.md`.
- [x] [Review][Patch] `generateMetadata`'s `!artifact` branch (a
      "Artifact Not Found — Artifacta" title) was dead code — confirmed
      via a direct request that Next.js renders the root layout's
      _default_ title for a `notFound()`-triggered page, not this
      segment's `generateMetadata` output at all — fixed by giving
      `app/not-found.tsx` its own `metadata` export instead (see
      Implementation Summary); the now-unreachable branch is kept in
      `generateMetadata` (documented with a comment) since the function
      must return valid `Metadata` for both cases regardless.
- [x] [Review][Patch] `NotFound_link`'s cream fill (`bg-cream`, matching
      `LandingHero_cta`'s existing pill-CTA treatment) had no visible edge
      in the light theme, where the page background is also cream — the
      same issue found and fixed on `ViewSwitcher`'s indicator circle
      (Story 3.4) — confirmed via a direct light-theme screenshot of this
      page. Fixed with the identical `border-navy/10` treatment.
      `LandingHero_cta` (pre-existing, Story 2.1, out of this story's
      scope) was checked for the same issue and does **not** have it — its
      cream fill sits against the hero's own radial scrim, not the raw
      page background, which already provides enough contrast.
- Dismissed as noise: the browser's own "Failed to load resource: the
  server responded with a status of 404" log on the not-found page is
  simply Chromium reporting the top-level document's correct 404 HTTP
  status (`notFound()` is documented to return a real 404 for non-streamed
  responses) — expected, not a defect.
- Dismissed as noise: `ArtifactThumbnail`'s stretched full-row link
  (Story 3.1) sits in a lower stacking position than the visible "Explore
  Story" link only in list view, per that story's own z-index comment —
  both links share the identical `href`, and the row's hover styling is
  driven by the parent `:hover` pseudo-class rather than whichever anchor
  the pointer happens to land on, so there's no observable behavior
  difference regardless of which of the two intercepts a given click.
