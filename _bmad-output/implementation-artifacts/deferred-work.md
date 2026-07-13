# Deferred Work

Findings from code review that are real but not actionable in the story that surfaced them — pre-existing patterns, out-of-scope items, or theoretical edge cases disproportionate to fix now.

## Resolved: `media` images backfilled for all 12 artifacts (2026-07-14)

The user supplied two batches of real photos, both exported from a design/
gallery tool with generic or mismatched filenames — e.g. several in the
first batch were named `Beaded_Hooded_Gown_*.png` despite actually
depicting the Vyshyvanka, Lei Po'o, Mbira, Wooden Chest, Tatreez Thobe,
Carnival Mask, Minbar, and Mshatta Façade; the second batch's
`image (N).jpg`/`pattern N.jpg` names carried no identifying information
at all. Each file was identified by its actual visual content (not its
filename), converted to an optimized progressive JPEG matching the
existing `thumbnail.jpg` convention (~14-55KB, center-cropped to the same
400×280/10:7 frame used throughout), and saved as
`public/images/artifacts/<id>/1.jpg` (batch 1, all 12 artifacts) and
`.../2.jpg` (batch 2, 7 artifacts: Minbar, Backgammon Board, Tatreez
Thobe, Lei Po'o, Beaded Gown, Mshatta Façade, Carnival Mask). Both raw
source folders (`images/`, `images2/`, repo root, untracked) were deleted
once their content was extracted, per explicit instruction.

**Still unbacked:** Wooden Chest/Carnival Mask/Mshatta Façade/Tatreez
Thobe's `3.jpg` (4 artifacts declare a 3rd media entry), Vyshyvanka/
Mbira/Jamdani's `2.jpg` (not covered by either supplied batch), and every
`audioUrl` — the bullet below still applies to those. One image from the
second batch (a ceramic/glazed surface with a carved fern-leaf motif) was
**not** assigned to any artifact — it didn't visually match any of the 12
mock artifacts' actual subjects, and forcing a guess seemed worse than
leaving it out; flag if it belongs somewhere.

## Deferred from: post-review visual polish pass on story-5-1/story-5-2 (2026-07-13)

- **`SiteHeader` (Story 1.7, shared across every page) is missing a small
  circular icon shown in the top-left of the header row in every captured
  mock (Landing, List, and Detail) next to the centered "Artifacta"
  wordmark** — visually a speaker/sound icon. Not called out in Story
  1.7's own AC (logo mark + wordmark only) or in any other story's AC
  either, so its intended behavior (a global mute/unmute toggle per
  Story 5.3's own `sound.png` two-state asset, a read-aloud/text-to-speech
  entry point, or a purely decorative brand-mark element) is genuinely
  unclear from the specs alone — flagged to the user directly rather than
  guessed at, since it would mean adding new interactive behavior to a
  shared, already-"done" component used by every page, well outside this
  pass's own Stories 5.1/5.2 scope. Explicitly deferred at the user's
  request pending a decision on what it should actually do.

## Deferred from: story-5-1/story-5-2 — Detail page layout + media carousel (2026-07-13)

- **`AudioPlayer` is a deliberately minimal stand-in for Story 5.3's own
  full scope, not that story pulled forward.** Story 5.1's own AC requires
  an audio player to appear in the content stack, so this pass built one:
  native HTML5 `<audio>`, play/pause toggle, a real seekable `<input
type="range">` progress bar, and `m:ss / m:ss` labels. What it does
  _not_ attempt — and what Story 5.3 still owns — is the mock's exact
  tick-mark waveform scrubber visualization (a decorative, evenly-spaced-
  ticks CSS treatment per that story's own Technical Notes, not real
  waveform analysis) and the mute/unmute speaker toggle. Both are real,
  scoped, and deferred rather than accidentally missed.
- **The `media` (and `audioUrl`) assets referenced by
  `src/data/mock-data.ts` remain partially unbacked by real files** — a
  pre-existing, already-documented gap (see `README.md`'s Artifact
  Thumbnail Component section); this pass is the first to actually load/
  play against them, so it's the first to visibly exercise it. `media[0]`
  (`1.jpg`) is now backed for all 12 artifacts (see the entry above), but
  `2.jpg`/`3.jpg` (9 of the 12 artifacts declare more than one media
  entry) still 404 (a `next/image` optimizer 400, specifically), and
  pressing play on any artifact with a non-null `audioUrl` throws a
  `NotSupportedError` in the console once the browser discovers the
  source doesn't resolve.
  `MediaCarousel` hides a failed slide behind its own
  `bg-background-elevated` backdrop instead of a broken-image icon (an
  `onError`-driven per-slide hide, matching `ArtifactThumbnail`'s existing
  convention). `AudioPlayer` derives `isPlaying` from the `<audio>`
  element's own `play`/`pause` events (see the code-review pass below) —
  a rejected `play()` correctly leaves the toggle showing "Play" — but
  still has no explicit visual "audio failed to load" state (an error
  icon/message); it just silently stays in the same state a visitor
  hadn't pressed play at all. Actually backfilling these assets (or
  building a real waveform/error state around their absence) is outside a
  two-story-sized pass.
- **`MediaCarousel` has no dedicated left/right arrow-button overlay on
  the image itself**, relying instead on the "More Images" button, dot
  indicators, arrow keys, and touch swipe to cover the "click/arrow
  navigation" AC (see that story's own Implementation Summary for the
  full reasoning) — a deliberate mock-fidelity call, not an oversight, but
  worth revisiting if a future design pass adds visible arrows to the
  Figma mock.
- **`getNextArtifact`'s "next" is always the full mock dataset's own
  order, ignoring whatever category filter the visitor arrived from on
  the List page.** Matches this story's own Technical Notes exactly
  ("next artifact ID in the mock data array, wrapping around at the
  end"), but means "Next story" from inside a filtered browsing session
  (e.g. "Wearable" only) can jump to an artifact of a completely different
  category — a real UX wrinkle if Epic 5 continues, not addressed here
  since the spec is explicit that it's the _dataset's_ order, not the
  filtered view's.

### Code review pass (8-angle, 2026-07-13) — fixed vs. deferred

An adversarial multi-angle review (line-by-line, removed-behavior,
cross-file, reuse, simplification, efficiency, altitude, conventions) ran
against this diff before it shipped. Two candidate findings turned out to
be **refuted by an empirical Playwright test** rather than accepted at
face value: this Next.js 16.2.10 install has `cacheComponents` off, so a
client-side "Next story" navigation between two `/detail/[id]` pages
fully remounts the page subtree — verified by advancing the carousel to
slide 2 and starting playback on Mshatta Façade, then navigating to Lei
Po'o, and confirming both the carousel's active dot and the audio
play/pause state reset cleanly rather than carrying over stale values.
That ruled out three plausible-sounding "state leaks across navigation"
candidates the reviewing agents raised for `MediaCarousel`/`AudioPlayer`.

**Fixed as part of this same pass:**

- `AudioPlayer.handleToggle` set `isPlaying = true` optimistically right
  after calling `audio.play()`, without waiting on the returned promise —
  since every mock artifact's `audioUrl` currently 404s (see above), the
  toggle button got stuck showing "Pause" forever with no audio actually
  playing, confirmed via Playwright (`NotSupportedError` in the console,
  button never reverted). Fixed by deriving `isPlaying` purely from the
  `<audio>` element's own `play`/`pause` events instead of setting it in
  the click handler — a rejected `play()` now correctly leaves the button
  showing "Play."
- `AudioPlayer` also had two hand-duplicated JSX branches (the
  `audioUrl: null` disabled state vs. the normal playing state) — flagged
  independently by two review angles (simplification, altitude) as a
  drift risk for Story 5.3 (which has to add the waveform/mute controls
  to both branches, or silently miss one). Merged into one render with a
  `disabled` boolean threaded through, and the `<audio>` element itself
  conditionally rendered only when `audioUrl` is set.
- `MediaCarousel`'s touch handlers were attached to the outer container,
  which also contains the "More Images" and dot buttons — since touch
  events bubble, a tap-with-drag on either button could fire both the
  button's own `onClick` _and_ the swipe handler, advancing two slides for
  one tap. Fixed with a `closest('button')` guard in
  `handleTouchStart`/`handleTouchEnd`.
- `MediaCarousel`'s `goTo`/`goToNext`/`goToPrev` were wrapped in
  `useCallback` with no memoized consumer to benefit from it, and
  `goToNext`/`goToPrev` read `index` from a closure (a `[goTo, index]`
  dependency array that changed identity on every index change anyway).
  Simplified to plain functions using the functional `setIndex(current =>
...)` form, which also removes any theoretical stale-closure risk.
- The deleted `DetailPlaceholder`'s blockquote had a `<cite>` directly
  attributing the quote to its speaker; the rebuilt blockquote in
  `DetailPageContent` dropped it, relying only on the separate
  "Contributed by" line two elements above. Restored as an `sr-only`
  `<cite>` inside the blockquote (self-contained attribution for a
  screen-reader user navigating by element type) without duplicating the
  name visually, since the mock itself doesn't repeat the name under the
  quote.

**Considered and intentionally left alone (see the entries above for
most of these — this list is only the ones a reviewing agent flagged as
a _possible regression_ that turned out to be a deliberate call):**

- Dropping `artifact.type`'s category badge from the rebuilt layout (the
  deleted `DetailPlaceholder` showed it) — the fuller, Figma-cross-checked
  AC list in `EPICS_AND_STORIES.md` (not this story's own terser summary
  file) enumerates the exact content stack with no category label in it,
  matching the captured Mshatta Façade detail mock itself. Documented
  directly in `DetailPageContent`'s own doc comment.
- The `next/image` `priority` prop is deprecated in Next.js 16 in favor of
  a new `preload` prop (confirmed against
  `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`).
  `MediaCarousel` uses `priority`, but so do 5 pre-existing components
  (`SiteHeader`, `LandingHeroDisc`, `ArtifactGridRow`, `ArtifactThumbnail`
  — which threads a whole `priority` prop through its own public API —
  and `ArtifactList`). Migrating only the one new usage would leave the
  other five inconsistent; this is a repo-wide migration, not a
  two-story-sized one.
- `getArtifactById` is called once each in `generateMetadata` and the
  page component body (`src/app/detail/[id]/page.tsx`), and
  `getNextArtifact` does its own separate `findIndex` scan — three linear
  scans of the same 12-item array per request. Real, but trivial at this
  dataset size; worth a `cache()`-wrapped lookup or a combined
  `{artifact, nextArtifact}` helper only if the data source ever moves off
  an in-memory array.
- All of a multi-image artifact's `<Image>` slides mount immediately
  (only `priority={i === 0}` differs; the rest default to
  `loading="lazy"`) rather than only mounting the active/adjacent slide —
  negligible today since every mock artifact has 1-3 media images, worth
  revisiting only if artifacts gain substantially larger media sets.
- `MediaCarousel`'s per-slide `onError` hide-on-failure and
  `ArtifactThumbnail`'s own loading-skeleton-plus-hide-on-error are two
  independent implementations of the same idea, with no shared hook
  between them (and `MediaCarousel` has no loading-skeleton half at all,
  just the hide-on-error half) — a `useImageLoadState` extraction is
  reasonable once a third component needs the same pattern, not
  preemptively for two.
- Several small CSS duplications (the `focus-visible` outline treatment
  repeated across `DetailToolbar`/`MediaCarousel`; `AudioPlayer`'s and
  `MediaCarousel`'s own slightly-different hover/active tactile-scale
  numbers, joining `ViewSwitcher`'s and `LandingHero_cta`'s existing,
  already-deferred versions of the same pattern) — matches this file's
  own already-established "three-plus near-identical occurrences is the
  conventional extract threshold" precedent (see the story-4-1 entry
  below); not yet at that threshold to justify a shared class today.

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
