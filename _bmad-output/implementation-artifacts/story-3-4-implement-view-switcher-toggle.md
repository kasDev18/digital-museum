# Story 3.4: Implement View Switcher Toggle

**Epic:** Epic 3 - List Page Foundation  
**Status:** Done  
**Priority:** High  
**Story Points:** 2

## User Story
**As a** visitor  
**I want to** toggle between Grid and List views  
**So that** I can choose my preferred browsing experience

## Acceptance Criteria
> Reconciled against the fuller AC set in `EPICS_AND_STORIES.md` (Epic 3 →
> Story 3.4), which supersedes the shorter draft this file originally
> shipped with — same reconciliation Story 3.1 made against its own draft.

- [x] View switcher is a pill-shaped toggle reading "Switch to grid" /
      "Switch to list" with matching icon glyphs, per `view switcher.png`
      (the label swaps to describe the _other_ view)
- [x] Toggle switches between Grid and List layouts
- [x] Current view mode is visually indicated
- [x] Toggle is accessible (keyboard navigable, proper ARIA labels)
- [x] Toggle has smooth transition between views
- [x] Toggle works across all breakpoints
- [x] View mode state is managed in React state

## Technical Notes
```typescript
type ViewMode = 'grid' | 'list';
```
- Use React state for view mode management
- Implement smooth transition between views (fade or slide)
- Use view switcher icon from Figma assets
- Ensure toggle is touch-friendly on mobile

## Implementation Tasks
1. Create ViewSwitcher component
2. Define ViewMode type and state
3. Implement toggle functionality
4. Add visual indication of current view mode
5. Implement smooth transition between views
6. Add accessibility features (ARIA labels, keyboard navigation)
7. Ensure touch-friendly on mobile
8. Test toggle functionality

## Dependencies
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout

## Blocked By
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout

## Blocking
- Story 4.4: Preserve State Across View Mode Switching

## Definition of Done
- [x] All acceptance criteria met
- [x] Toggle works smoothly between views
- [x] Component is accessible
- [ ] Code committed to repository — left uncommitted/unstaged at the
      implementer's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-12
**Actual Implementation:**

- Built `ViewSwitcher` at `src/app/list/components/view-switcher/`: a
  single `<button>` (not a two-button radio group — only two mutually
  exclusive states, so one toggle covers it with one fewer tab stop),
  matching `view switcher.png`'s own dev-mode export: a gray `#c7c6c5`
  "track" containing a solid cream circle around the *current* mode's
  icon (a static indicator, not itself interactive) alongside the
  *target* mode's icon + a "Switch to {target}" label sitting directly on
  the track. `GridViewIcon`/`ListViewIcon` (added to
  `src/components/ui/icons.tsx`, no prior Figma SVG export existed for
  either) were rebuilt with a native 20x20 viewBox and 1.5px stroke,
  matching the spec's icon glyphs exactly rather than being scaled down
  from this file's usual 40-unit viewBox convention (which would have
  thinned the stroke to sub-1px). The visible label doubles as the
  accessible name (no separate `aria-label`, per WCAG 2.5.3 Label in
  Name), and there's no `aria-pressed` — see Review Findings for why.
- **Design revised twice after initial delivery**, per feedback comparing
  against the Figma reference: first from an in-flow top toolbar with a
  `background-elevated` fill to a `fixed`, centered pill floating above
  `SiteFooter` (the same "floating chrome" treatment as
  `SiteHeader`/`SiteFooter` themselves) with a `bg-cream` fill, since the
  original fill blended into the page's own dark background; then, once
  the exact Figma dev-mode CSS/screenshot was provided, to the current
  gray-track-plus-cream-indicator-circle structure described above,
  replacing the single solid-cream pill.
- **Click animation added on the switcher itself** (2026-07-13), on top of
  the swap animation described below: the indicator's icon and the
  action segment (icon + label) each pop in (scale 0.6→1 + fade,
  `prefers-reduced-motion`-gated) every time they swap content, staggered
  60ms apart so the current-mode indicator settles first and the
  next-action label catches up a beat behind, rather than everything
  popping in at once. Neither needs an explicit trigger for the
  indicator's icon (`CurrentIcon` is a different component each toggle, so
  React already remounts it) — only `.ViewSwitcher_action` needs an
  explicit `key={viewMode}`, since a `<span>` whose *text content* changes
  doesn't remount on its own. Plus a `hover:scale-[1.02]`/`active:scale-[0.96]`
  tactile press, matching `LandingHero_cta`'s own hover/active scale
  convention. Verified the pop is correctly disabled (opacity already 1
  within 50ms of the click) under `prefers-reduced-motion: reduce`, and
  that repeated toggling still swaps the view correctly across several
  clicks in a row.
- `ViewMode` (`'grid' | 'list'`) is exported from `view-switcher/index.tsx`
  and owned by a new client component, `ListPageContent`
  (`src/app/list/components/list-page-content/`), which holds the
  `useState<ViewMode>` and conditionally renders `ArtifactGrid` (Story 3.2)
  or `ArtifactList` (Story 3.3). `page.tsx` stays a Server Component for
  the `getAllArtifacts()` fetch and now renders `ListPageContent` instead
  of `ArtifactGrid` directly.
- Switching views remounts the newly-selected one (`key={viewMode}` on the
  wrapper), which replays its existing `useScrollReveal` entrance animation
  (Story 3.2/3.3) from scratch, and the wrapper itself crossfades via a
  `prefers-reduced-motion`-gated CSS `fadeIn` keyframe (opacity + a 16px
  slide) — a plain CSS transition rather than a GSAP tween, since it's a
  simple one-shot mount animation with no drag/scroll coordination needed
  (GSAP is reserved in this codebase for the scroll-triggered/exit-fade
  cases that actually need it).
- Verified via Playwright (headless Chromium, no test framework in this
  repo — same precedent as every prior Epic 3 story) against both `pnpm
  dev` and a `pnpm build && pnpm start` production build: toggling flips
  the label/icon state correctly in both directions and swaps the
  rendered view (12 `Explore Story` links in List mode, 12
  `/detail/[id]` grid cards in Grid mode); Tab lands on the switcher as
  the second stop (after the header logo, confirmed via a direct
  Tab-Tab-Enter check, not just an aria-attribute proxy) and `Enter`
  activates it exactly like a click; a bounding-box check confirms the
  pill's screen position is byte-identical before and after scrolling
  1200px (genuinely `fixed`, not just visually similar) and its rendered
  width (186px) matches the Figma spec's own outer-track width exactly;
  screenshots taken at 1440px/1920px/390px in both the dark and light
  theme confirm the gray track and cream indicator circle both stay
  legible over varying artifact imagery and touch-friendly (52px min
  height) at every size.

### Review Findings

- [x] [Review][Patch] `aria-pressed={!isGrid}` paired badly with this
      button's own changing label — the label always names the *target*
      view ("Switch to grid"/"Switch to list"), not a stable state, so
      `aria-pressed` ended up announcing e.g. "Switch to grid, pressed"
      while already in Grid view, which doesn't track the WAI-ARIA APG
      toggle-button pattern (stable label + `aria-pressed`) it was meant
      to follow — fixed by dropping `aria-pressed` entirely; the label
      change alone already conveys the switch (same "label always names
      the next action" shape as a play/pause button), and current mode is
      conveyed visually via the active/muted icon styling.
- [x] [Review][Patch] `ArtifactGridRow_first`'s existing `pt-14 lg:pt-36`
      top clearance (Story 3.2, reserved as a placeholder for the site
      header _and_ the not-yet-built category filter bar, Story 4.2) has
      no equivalent in `ArtifactList` (Story 3.3) — invisible before this
      story (the route only ever rendered Grid), but toggling between the
      two now visibly jumps the content vertically by that reserved
      amount. Fixed by adding matching `pt-14 lg:pt-36` to
      `ArtifactList`'s own container so both views start at the same
      position beneath the toolbar; not a redesign of Story 3.2's
      placeholder reservation itself, which stays as-is pending Story 4.2.
