# Deferred Work

Findings from code review that are real but not actionable in the story that surfaced them — pre-existing patterns, out-of-scope items, or theoretical edge cases disproportionate to fix now.

## Deferred from: story-4-1 addendum — infinite drag + drag badge (2026-07-13)

- **`ArtifactGridRow`'s `TILE_COUNT = 7` is a fixed constant, not dynamically computed from the actual viewport width.** Verified generous enough for any single real display up to 5120px (5K) — including the narrowest (3-item, so fastest-exhausted) row — with real margin to spare, but an exotic multi-monitor span well beyond that (e.g. three 4K displays combined, ~11500px) could theoretically exceed what 7 tiles cover on that specific row. A fully robust fix would measure the viewport (and re-measure on resize) to compute the exact tile count needed; deferred since it adds real complexity for a display configuration far outside this project's realistic audience, and the fixed constant is trivially bumped later if it ever proves insufficient.

## Deferred from: code review of story-4-3/story-4-4/story-4-5 (2026-07-13)

- **`window.matchMedia('(prefers-reduced-motion: reduce)').matches` is now
  inlined independently in five places** — four pre-existing
  (`src/lib/gsap-utils.ts`'s `useExitFadeNavigation`, `use-drag-pan.ts`'s
  `settle`, and two spots in `landing-hero/index.tsx`) plus this pass's new
  `handleViewModeChange` (`list-page-content/index.tsx`) — with no shared
  `prefersReducedMotion()` helper in `src/lib` for any of them to call.
  Real duplication/drift risk (a future change to the check would need
  finding and updating all five call sites), but extracting a shared
  helper now would touch unrelated landing-page/GSAP-utility code well
  outside this pass's List-page-interaction scope for a purely-preventative
  refactor.
- **Three near-identical hand-written CTA-button utility strings now exist**
  (`LandingHero_cta`, `not-found.module.css`'s cream/navy link, and this
  pass's new `ListFilteredEmptyState_action`) — same `rounded-full` pill,
  `hover:scale-[1.04]`/`active:scale-[0.97]`, theme-aware fill shape, no
  shared class or component between them. Three occurrences is the
  conventional "extract it" threshold; deferred since two of the three
  predate this pass and doing the extraction properly means editing the
  landing page and the site-wide `not-found` page, not just List-page code.
- **`readSessionStorage`/`writeSessionStorage` (`list-page-content/index.tsx`)
  re-implement, for `sessionStorage`, the same try/catch-wrapped
  best-effort storage pattern already hand-written for `localStorage` in
  `theme-font-controls/index.tsx`** (Story 1.7) — no shared
  storage-safety helper exists in `src/lib` for either to call. Real, but
  this is the List page's first and only use of persisted UI state; a
  shared `usePersistedState`/safe-storage helper is worth extracting the
  next time a third feature needs this, not preemptively for two.
- **`ListFilteredEmptyState` (Story 4.3) duplicates `ListEmptyState`'s core
  shell** (a `min-h-[40vh]` flex-centered box with a muted serif message) in
  a second, separate component and CSS module, with no shared base
  primitive between the two "nothing to show" states. `ListEmptyState`'s
  own doc comment already anticipated this split as deliberate rather than
  an oversight (see story-3.2/3.3's entry below), but if a third empty-state
  variant is ever needed, that's the point to generalize both into one.
- **A drag started by a second finger on the same row while the first
  finger's drag is still in progress re-triggers the Story 4.5 haptic
  (`navigator.vibrate(8)` in `use-drag-pan.ts`)** — `useDragPan`'s
  `drag.current` is a single ref replaced wholesale on each `pointerdown`,
  so a genuine two-finger drag on one row (not a realistic gesture for this
  UI, but not prevented either) would double-fire the haptic tick for what
  a user perceives as one continuous interaction. Harmless (a redundant
  buzz, not a functional break) and disproportionate to add multi-touch
  bookkeeping for.

## Deferred from: code review of story-4-1/story-4-2 (2026-07-13)

- ~~**`ListEmptyState`'s "No artifacts to display right now." copy is misleading once a category filter can legitimately return zero results.**~~ **Resolved by story-4-3 (2026-07-13):** a new `ListFilteredEmptyState` component now covers this exact case — it names the active category, suggests a different one, and offers a "View all objects" action, rendered by `ListPageContent` in place of whichever view is active once the filter narrows the dataset to zero. `ListEmptyState` itself is untouched and still covers only the original "underlying artifact array is empty" case. Originally: that copy (and component) predated Story 4.2 and was written for the "underlying artifact array itself is empty" case; with the category filter wired up, an empty `filteredArtifacts` array rendered the same generic message instead of one that named the active filter — not reachable with the 12-item mock dataset (all 7 categories have at least one match), but a real gap once any category could legitimately return zero results.
- **`CategoryFilter`'s fixed `top-20`/`sm:top-24` position + track height, and `ArtifactGridRow_first`/`ArtifactList`'s `pt-16 lg:pt-20` top-clearance padding, are tied together only by cross-referencing prose comments across three separate CSS Module files, not a shared constant.** A future tweak to any one of CategoryFilter's own offset, padding, or font size would desync the other two files' clearance with no build-time check — cards could start rendering underneath the fixed filter bar. A `--category-filter-clearance` CSS custom property (set once, consumed via `calc()` in both content files) would make the relationship mechanically enforced instead of comment-enforced; deferred since it touches three files for a purely-preventative fix with no current visible bug.

## Deferred from: code review of story-3-2/story-3-3 (2026-07-12)

- ~~**The Grid view's widest row may fit entirely within very large (2560px+/ultrawide) desktop monitors, at which point there's nothing left to pan.**~~ **Resolved by story-4-1's addendum (2026-07-13):** `ArtifactGridRow` now tiles 7 back-to-back copies of its own artifacts and `useDragPan` wraps the drag offset seamlessly through them, making the drag genuinely infinite rather than a wide-but-finite canvas — there's always more content in either direction regardless of monitor size. Verified via Playwright at 3440px and 5120px (5K) viewport widths, dragging the narrowest (3-item) row up to 5000px in one continuous gesture: no gap or seam at any point. Originally: the canvas was independently-sized flex rows built from the real 12-artifact dataset (`ROW_SIZES = [5, 4, 3]`), whose widest row (5 items) was exactly 2560px at the 400px desktop card size — a wide enough monitor could fit that row entirely, at which point the old clamped-bounds range collapsed to zero and dragging did nothing.
- ~~**`ArtifactList` (Story 3.3) is fully built and manually verified but not yet reachable from the running app.**~~ **Resolved by story-3-4 (2026-07-12):** `ListPageContent`'s `ViewSwitcher` pill now renders `ArtifactList` conditionally alongside `ArtifactGrid`. Originally: `src/app/list/page.tsx` rendered only `ArtifactGrid` (Story 3.2); an interim `?view=list` searchParam was tried during that pass to make both reachable pre-3.4, then deliberately removed as unnecessary public route surface for a placeholder (see story-3-2's Review Findings) — same call Story 3.1 made in deleting its own dev-only preview route before finalizing.
- **Card width (`45vw`/`30vw`/`400px`) is duplicated between `ArtifactThumbnail_grid`'s own width (`artifact-thumbnail/styles.module.css`) and its `next/image` `sizes` prop (`artifact-thumbnail/index.tsx`), tied together only by comments, not a shared constant.** A future breakpoint tweak to one without the other would desync the requested image resolution from the actual rendered box size. Real, but fixing it properly means introducing a small shared breakpoint-width module — disproportionate to this pair of stories alone.

## Deferred from: code review of story-2.4 (2026-07-12)

- ~~**Clicking the landing page CTA currently 404s to Next's bare, unstyled not-found page.**~~ **Resolved by story-3-2/3-3 (2026-07-12):** `src/app/list/page.tsx` now exists and renders the Grid view with full site chrome. Originally: `LandingHero`'s "Enter Exhibition" `<Link>` pointed at `/list`, but that route didn't exist yet — Next's default not-found page rendered instead, with no site header/footer chrome.
- **`LandingHeroContentReveal`'s reveal targets are collected via `gsap.utils.toArray('[data-hero-reveal]', container.current)` and silently no-op if an element is missing.** If a future edit to `LandingHero` renames, typos, or drops a `data-hero-reveal` attribute, that element simply never gets hidden/revealed (renders at its default state, no fade/slide-in) — no error or warning surfaces, since this repo has no test framework configured (see the equivalent note under story-2.2 below for `originOf()`). Theoretical; matches the same "no defensive runtime guard" pattern already accepted elsewhere in this codebase.

## Deferred from: code review of story-3-1 (2026-07-12)

- ~~**Clicking any thumbnail currently 404s to Next's bare, unstyled not-found page.**~~ **Resolved by story-3-5 (2026-07-12):** `src/app/detail/[id]/page.tsx` now exists (a real placeholder Detail page, not the full Epic 5 layout) and `src/app/not-found.tsx` gives invalid ids the site's own header/footer chrome instead of Next's bare default. Originally: `ArtifactThumbnail` linked every card/row to `/detail/[id]`, but that route didn't exist yet.

## Deferred from: code review of story-3-4/story-3-5 (2026-07-12)

- **A dev-mode-only "Encountered a script tag while rendering React component" console warning fires whenever `notFound()` renders (or any URL hits an unmatched route), in `pnpm dev` only.** Root-caused to an interaction between this Next.js 16.2.10 build's `notFound()`/unmatched-route rendering path and the root layout's pre-existing inline `<script dangerouslySetInnerHTML>` bootstrap (Story 1.7's `THEME_INIT_SCRIPT`, `layout.tsx`) — reproduced even with Next's bare built-in 404 (i.e. it predates `app/not-found.tsx` and isn't specific to this story's own code), and confirmed **absent** in a `pnpm build && pnpm start` production run (React strips this class of dev-only warning in production). That script is deliberately a raw inline tag — it must run synchronously before hydration to prevent a theme flash, so `next/script` isn't a substitute — and touching it is out of scope for a Story 3.5-sized change just to silence a dev-only warning with no production impact. Real, low-severity, and worth a look if a future story ever revisits Story 1.7's FOUC-prevention approach.
- ~~**The Grid/List `ViewMode` chosen via Story 3.4's `ViewSwitcher` resets to Grid whenever a visitor leaves the List page and comes back**~~ **Resolved by story-4-4 (2026-07-13):** `viewMode` and `category` are now both persisted to `sessionStorage` (restored in a mount effect, written on every change), so navigating to a Detail page and back via "Back to Gallery" restores the same view/filter instead of reverting to the Grid/All-Objects default — verified via Playwright: filtered to "Wearable," switched to List view, navigated into a Detail page and back, and both the view mode and category were still restored correctly. Originally: `ListPageContent`'s `useState<ViewMode>` wasn't persisted anywhere, so a fresh mount of `/list` always started from the default.

## Deferred from: code review of story-2.2 (2026-07-12)

- **`data-disc-group` index + string-selector scoping assumes a single mounted `LandingHero` instance.** `LandingHeroDisc` targets its animated groups via `gsap.to('[data-disc-group="${index}"]', ...)`, scoped only through `useGSAP`'s `{ scope: container }`. If `LandingHero` were ever mounted twice on the same page, both instances' `data-disc-group="0"` elements could be targeted by one tween set (or vice versa). Matches the identical string-selector pattern already established in `GsapScrollDemo` (Story 1.3); `LandingHero` currently has exactly one call site (`src/app/page.tsx`).
- **`gsap.matchMedia()` + `useGSAP` double-cleanup and remount/StrictMode double-invoke ordering.** `mm.revert()` is called explicitly in addition to `useGSAP`'s own automatic context revert on unmount; correctness during React's dev-mode mount→unmount→mount double-invoke depends on `mm.revert()` synchronously tearing down the prior tweens before the second setup runs. This is the exact pattern already shipped in `GsapScrollDemo` (Story 1.3), not a new risk introduced by Story 2.2.
- **Reduced-motion preference-change race at unmount.** If the OS-level `prefers-reduced-motion` setting flips at the same instant the component unmounts, the native media-query change event and React's unmount cleanup are unordered relative to each other. Theoretical; no defensive pattern (e.g. an `isMounted` guard) is used for this class of race anywhere else in the codebase.
- **Out-of-range `transform-origin` + `force3D` combination not verified outside Chromium.** Two of the three groups compute a `transform-origin` outside the 0–100% range (valid CSS), combined with `force3D: true`. Verified working via a Playwright/Chromium screenshot; full cross-browser compatibility QA is Epic 6 Story 6.3's explicit scope, not this story's.
- **No off-screen/tab-hidden pause for the infinite disc rotation.** The three tweens run `repeat: -1` indefinitely with no `ScrollTrigger`/visibility gating to pause them when scrolled out of view or when the tab is backgrounded. Browsers natively throttle rAF-driven ticks (which GSAP's ticker uses) when the tab is hidden, and the hero section is above the fold at page load, so the practical impact is low.
- **No unit test for `originOf()`.** A pure, easily-testable function with no test coverage. The project has no test framework configured anywhere (confirmed via `package.json` — no Jest/Vitest/Playwright-test dependency); introducing one is a larger infrastructure decision out of scope for a single animation story.
