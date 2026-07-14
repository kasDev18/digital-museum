---
baseline_commit: f5e8ecfea79ba4bb95b2d821c23ecf9e2fd08dcb
---

# Story 2.2: Implement Background Disc Animation

**Epic:** Epic 2 - Landing Page  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** visitor  
**I want to** see a subtle, continuous animation of the background disc graphic  
**So that** the landing page feels dynamic and engaging

## Acceptance Criteria
- [x] Disc/orb graphic animates continuously in a smooth loop
- [x] Animation treatment: slow rotation (parallax-on-scroll not implemented — see Implementation Notes)
- [x] Animation runs automatically on page load
- [x] Animation is performant (uses transform/opacity, not layout-triggering properties)
- [x] Animation resolves gracefully without jank
- [x] Animation does not interfere with page performance or scrolling

## Technical Notes
- Use GSAP for the animation (timeline or tween)
- Consider: slow rotation (360° over 20-30s), scale pulsing, or parallax on scroll
- Use CSS transforms for GPU acceleration
- Ensure animation cleanup on component unmount

## Implementation Tasks
1. [x] Import GSAP and configure animation context
2. [x] Create GSAP timeline for disc animation
3. [x] Implement slow rotation animation (360° over 20-30s)
4. [x] ~~Add optional parallax effect on scroll~~ — skipped, see Implementation Notes
5. [x] Ensure animation uses GPU-accelerated properties
6. [x] Implement cleanup on component unmount
7. [x] Test animation performance
8. [x] Verify animation doesn't interfere with scrolling

### Review Follow-ups (AI)
- [x] [Review][Patch] Whole `LandingHero` needlessly promoted to a Client Component [src/app/landing/components/landing-hero/index.tsx]
- [x] [Review][Patch] No `will-change-transform` on continuously-rotating disc groups, per `docs/gsap-performance.md` [src/app/landing/components/landing-hero/styles.module.css:16]
- [x] [Review][Patch] Rotation durations had no rationale comment vs. the story's "20-30s" example range [src/app/landing/components/landing-hero/components/landing-hero-disc/index.tsx]
- [x] [Review][Patch] Optional parallax-on-scroll and epics.md's "concentric ring" framing were left unaddressed with no documented rationale [Implementation Notes below]
- [x] [Review][Defer] `data-disc-group` index + string-selector scoping assumes a single mounted `LandingHero` instance — deferred, pre-existing pattern (matches `GsapScrollDemo`'s identical string-selector approach from Story 1.3); `LandingHero` has exactly one call site (`src/app/page.tsx`)
- [x] [Review][Defer] `gsap.matchMedia()` + `useGSAP` double-cleanup and remount/StrictMode double-invoke ordering assumption — deferred, pre-existing pattern inherited verbatim from `GsapScrollDemo` (Story 1.3), not newly introduced by this diff
- [x] [Review][Defer] Theoretical reduced-motion preference-change race at unmount — deferred, no defensive pattern used elsewhere in the codebase for this class of race; disproportionate for an ambient hero animation
- [x] [Review][Defer] Out-of-range `transform-origin` + `force3D` combination not verified outside Chromium — deferred, verified via Playwright/Chromium screenshot; full cross-browser QA is Epic 6 Story 6.3's explicit scope
- [x] [Review][Defer] No off-screen/tab-hidden pause for the infinite rotation — deferred, browsers natively throttle rAF-driven ticks (GSAP's ticker) when the tab is hidden, and the hero is above the fold at load
- [x] [Review][Defer] No unit test for `originOf()` — deferred, project has no test framework configured anywhere (confirmed via `package.json`); adding one is a larger decision out of scope for this story

## Implementation Notes

- `src/app/landing/components/landing-hero/components/landing-hero-disc/index.tsx` (new, client component `LandingHeroDisc`) owns the disc rendering and animation; `landing-hero/index.tsx` stays a server component, so the headline/subtext/CTA keep server-rendering instead of shipping as client-rendered content for the sake of a decorative background animation (a self-review finding — see Review Findings below). The headline/subtext/CTA's own fade-in (added in a later pass, see below) uses the same technique: a thin client wrapper (`LandingHeroContentReveal`) takes them as `children` rather than rendering them itself, so they remain part of the server-rendered markup.
- **Texture clusters rotated around a shared center, not re-sliced into rings:** Story 2.1's Implementation Notes flagged that the disc's 3 `DISC_GROUPS` are texture clusters (arcs of one material each), not full concentric rings, and that reusing them 1:1 wouldn't deliver "independent ring speeds" without re-slicing the assets. Re-slicing was out of scope given the deadline, so instead each existing group's `transform-origin` is computed (`originOf()`) as the shared disc-canvas center expressed as a percentage of that group's own bounding box (can fall outside 0–100%, which is valid CSS) — so all three clusters orbit the same center point rather than each spinning around its own off-center middle.
- **Current rotation is uniform, not per-cluster differentiated:** all three groups share one rotation speed/direction (`gsap.to({ rotation: 360, duration: 36, ease: 'none', repeat: -1 })`), so the assembled disc turns as a single piece rather than each cluster spinning independently at its own speed/direction. This satisfies the groomed story AC ("animates continuously in a smooth loop") but only partially realizes EPICS_AND_STORIES.md's "creative differentiation: rings rotate at different speeds/opposing directions" bullet — flagging this explicitly (an earlier pass in this story did implement differentiated per-group durations/directions — 32s cw / 26s ccw / 20s cw — before later iteration simplified back to a single uniform rotation). A future pass could reintroduce per-group `rotationDuration`/`rotationDirection` values on top of the current fly-in/shadow effects if the differentiated look is wanted back.
- Rotation is driven by `useGSAP` + `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, matching the pattern already established by `GsapScrollDemo` (Story 1.3) and documented in `docs/gsap-performance.md` — users with reduced-motion enabled see the disc in its static end state, no rotation.
- Only `rotation` (via `gsap.to(..., { rotation, force3D: true })`) is animated — a GPU/compositor-only transform, no layout-triggering properties. `will-change-transform` was added to `.LandingHero_discGroup` since, unlike the fire-once entrance animation in `GsapScrollDemo`, this rotation runs continuously (`repeat: -1`) for the component's whole mounted lifetime.
- **Parallax-on-scroll not implemented:** the groomed story's AC lists it as optional ("slow rotation with optional parallax on scroll") and Task 4 as an implementation task; given the 4-day deadline and that the fly-in + shadow + continuous rotation already deliver the story's "dynamic and engaging" intent, parallax was consciously scoped out rather than added on top. Noting this explicitly (rather than leaving the task silently unchecked) per self-review.
- Verified via a headless-Chromium script (Playwright): the fly-in, shadow fade-in, and continuous rotation all run in the correct order (confirmed via `getComputedStyle(...)` sampled at multiple points in time), the full sequence is fully suppressed under `prefers-reduced-motion: reduce` (only the shadow still applies, instantly) with no motion (`transform: none`, unchanged over time), no horizontal overflow or console/page errors at 1440×900, 375×812, `pnpm ts:check`/`pnpm lint` clean, and the headline text (`Objects, Voices`) is present in the raw server-rendered HTML (`curl localhost:8084`) confirming the client-boundary refactor didn't regress SSR of the hero copy.
- Self-review pass (adversarial + edge-case + acceptance-criteria layers) surfaced the client-component-boundary and missing-`will-change` findings above, both fixed before this story was marked done; remaining findings were deferred as pre-existing patterns already established elsewhere in the codebase (see Review Follow-ups above) or genuinely out of this story's scope (no test framework exists in this repo yet; full cross-browser QA is Epic 6's job).
- **Follow-up pass — entrance fly-in + drop-shadow:** each cluster now flies in from a random offset/rotation on mount (`gsap.fromTo`, staggered by `index * 0.5s`) before settling into its continuous rotation, and a soft `drop-shadow` (not `box-shadow`, so it follows each arc's silhouette rather than its rectangular bounding box) fades in shortly after rotation begins. The shadow's alpha is a CSS custom property (`--disc-shadow-opacity`, set in `styles.module.css`) so GSAP can tween it independently of the transform-based tweens; it's gated on its own `gsap.matchMedia()` pair (`prefers-reduced-motion: no-preference` vs `reduce`) so reduced-motion users still get the shadow (a static visual, not motion) applied instantly via `gsap.set` instead of the fly-in/rotation.
- **Final-review fixes:** the review pass that added the follow-up above also caught and fixed two correctness issues before merge: (1) the continuous rotation tween had drifted to `ease: 'power2.out'`, which — combined with `repeat: -1` — mathematically decelerates to a near-stop at the end of every cycle before snapping back to full speed at the next, a verifiable violation of this story's "smooth loop"/"no jank" ACs; changed to `ease: 'none'` (constant angular speed, standard practice for infinite CSS-transform loops). (2) the shadow's fade-in delay had drifted to start *before* the rotation tween's own `delay: 2`, contradicting its own adjacent code comment ("fades in once the rotation... has kicked in"); adjusted so the shadow's delay is always > 2. Also removed two now-dead `DISC_GROUPS` fields (`opacity`/`scale`) that nothing read (the entrance tween hardcodes its own values) and simplified three GSAP function-value props (`x`/`y`/`rotation: i => gsap.utils.random(...)`) to plain `gsap.utils.random(...)` calls, since each `gsap.fromTo` here targets exactly one element — the per-index function form only matters for multi-element stagger tweens, which this isn't.
- **Headline/subtext/CTA fade-in:** `LandingHeroContentReveal` (new, client component) wraps the existing `.LandingHero_content` block — hidden via `autoAlpha: 0` set immediately on mount (not via CSS, so there's no permanently-invisible state if JS fails to load — same "hide immediately in JS, not in CSS" pattern `docs/gsap-performance.md` documents for `GsapScrollDemo`), then faded to `autoAlpha: 1` over 1.2s with `ease: 'power2.out'`. No delay, so it completes well before `LandingHeroDisc`'s own rotation tween starts (`delay: 2`) — the headline is fully visible before the disc visibly begins spinning. Gated behind the same single-condition `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` pattern as the disc: under reduced motion the hide-then-reveal callback never runs at all, so the content simply renders at its default visible state, no flash or permanent hiding.
- **Note for Story 2.3 (Add Scroll-Based Content Animations):** the headline/subtext/CTA now already have a load-time fade-in (above). Story 2.3's AC calls for headline/subtext/CTA entrance animations too (staggered, `ScrollTrigger`-based, `once: true`) — since the hero is entirely above the fold, a `ScrollTrigger` wouldn't have room to trigger from off-screen the way it does for below-the-fold content. Story 2.3's implementer should decide whether to replace `LandingHeroContentReveal`'s current single fade with the staggered per-element version Story 2.3 describes, or treat 2.3's AC as already satisfied by this load-time reveal for above-the-fold content specifically.

## Dependencies
- Story 1.3: Install and Configure GSAP
- Story 2.1: Build Landing Page Static Layout

## Blocked By
- Story 1.3: Install and Configure GSAP
- Story 2.1: Build Landing Page Static Layout

## Blocking
- Story 2.3: Add Scroll-Based Content Animations

## Definition of Done
- [x] All acceptance criteria met
- [x] Animation runs smoothly at 60fps (GPU-only `rotation` transform; verified no jank/overflow via headless-browser check)
- [ ] Code committed to repository (staged intentionally left for the user to review/commit, per this session's instructions)
- [x] No console errors or warnings
- [x] Animation cleanup works correctly (`useGSAP` scope + `mm.revert()` on unmount)

## File List
- `src/app/landing/components/landing-hero/index.tsx` (modified — back to a server component, delegates disc rendering to `LandingHeroDisc` and wraps the headline/subtext/CTA in `LandingHeroContentReveal`)
- `src/app/landing/components/landing-hero/styles.module.css` (modified — added `will-change-transform` and a `--disc-shadow-opacity`-driven `drop-shadow` filter to `.LandingHero_discGroup`)
- `src/app/landing/components/landing-hero/components/landing-hero-disc/index.tsx` (new — client component owning the disc's fly-in, shadow fade-in, and continuous rotation animations)
- `src/app/landing/components/landing-hero/components/landing-hero-content-reveal/index.tsx` (new — client component owning the headline/subtext/CTA's fade-in)

## Change Log
- 2026-07-12: Implemented Story 2.2 (GSAP disc rotation animation); self-review (adversarial + edge-case + acceptance-criteria layers) found and fixed 3 patch items (client-component boundary, missing `will-change-transform`, undocumented rotation-duration rationale) and documented 1 scope decision (parallax-on-scroll skipped); 6 findings deferred as pre-existing patterns or out of scope — see `deferred-work.md`.
- 2026-07-12: Added entrance fly-in and drop-shadow fade-in on top of the rotation. Final review before merge caught and fixed: an `ease: 'power2.out'` regression on the infinite rotation tween (violated the smooth-loop/no-jank ACs — changed to `ease: 'none'`), a shadow-fade delay that started before the rotation it was meant to follow, and removed dead unused data fields.
- 2026-07-12: Refactor/docs-alignment pass (no behavior change): extracted the duplicated shadow-opacity magic number into a `DISC_SHADOW_OPACITY` constant, and corrected stale comments/docs (this story's Implementation Notes, PR description, and `EPICS_AND_STORIES.md`'s correction note) that still described a differentiated per-cluster rotation speed/direction which a later iteration had simplified back to one uniform rotation for all three groups — see the note above on partial "creative differentiation" AC coverage.
- 2026-07-12: Added `LandingHeroContentReveal` — the headline/subtext/CTA now fade in from hidden on load, completing before the disc's continuous rotation kicks in, following the same server/client boundary and JS-driven-hide conventions established for the disc.
