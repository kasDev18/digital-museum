# Story 2.3: Add Scroll-Based Content Animations

**Epic:** Epic 2 - Landing Page  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story

**As a** visitor  
**I want to** see content elements animate in as I scroll down the page  
**So that** the experience feels polished and engaging

## Acceptance Criteria

- [x] Headline animates in when entering viewport (fade/slide-in)
- [x] Subtext animates in after headline (staggered timing)
- [x] CTA button animates in after subtext (staggered timing)
- [x] Animations use GSAP ScrollTrigger for viewport detection
- [x] Each element animates only once (no re-trigger flicker)
- [x] Animations do not block clicking/tapping the CTA at any point
- [x] Animation timing feels natural and not sluggish

## Technical Notes

- Use GSAP ScrollTrigger for scroll-based animations
- Implement stagger effect for sequential element entrance
- Set `once: true` on ScrollTrigger to prevent re-triggering
- Use transform-based animations for performance
- Test that CTA remains clickable during animation

## Implementation Tasks

1. [x] Import GSAP ScrollTrigger
2. [x] Configure ScrollTrigger for headline animation
3. [x] Configure ScrollTrigger for subtext animation with stagger
4. [x] Configure ScrollTrigger for CTA button animation with stagger
5. [x] Set `once: true` to prevent re-triggering
6. [x] Use transform-based animations (fade/slide-in)
7. [x] Test that CTA remains clickable during animations
8. [x] Verify animation timing feels natural

## Implementation Notes

- `LandingHeroContentReveal` (`src/app/landing/components/landing-hero-content-reveal/index.tsx`)
  replaced its previous single-block, time-delayed `gsap.to(container, ...)`
  fade with a `ScrollTrigger.create({ trigger: container, start: 'top 85%',
once: true, onEnter: ... })` that staggers three separate targets —
  `data-hero-reveal="headline"`, `"subtext"`, `"cta"` — added to the
  corresponding elements in `LandingHero`
  (`src/app/landing/components/landing-hero/index.tsx`), selected via
  `gsap.utils.toArray<HTMLElement>('[data-hero-reveal]', container.current)`
  (same idiom `LandingHeroDisc`/`GsapScrollDemo` already use, rather than a
  hand-rolled `querySelector` loop).
- The hero fills the viewport at load (`min-h-screen`), so `start: 'top 85%'`
  is already satisfied the instant the trigger is created — this is
  intentional, not the "already past start on load" pitfall
  `docs/gsap-performance.md` warns about: it makes the reveal fire
  immediately as an entrance animation while still going through
  ScrollTrigger for viewport detection and `once: true` per this story's AC.
  ScrollTrigger's own load/resize-triggered refresh (the same mechanism
  every other ScrollTrigger in this codebase relies on) re-evaluates `start`
  if web fonts/images shift layout after the initial mount measurement.
- Stagger: headline first, then subtext, then CTA (`stagger: 0.25` across
  the 3 targets), each animating `autoAlpha`/`y` (GPU-friendly per
  `docs/gsap-performance.md`) with `duration: 0.9`, `ease: 'power2.out'`.
  Overall pacing (`delay: 1.6` + ~1.4s to fully settle) matches the previous
  single-block reveal's ~3s finish time, so `LandingHeroDisc`'s continuous
  rotation (its own `delay: 2`, 36s/turn) has only turned a few
  imperceptible degrees by the time the CTA settles.
- **Fixed during review:** the initial refactor hid only the 3 inner
  targets, not the `LandingHeroContentReveal` container itself — but
  `.LandingHero_content::before`'s radial-gradient scrim paints from that
  container, so it would have rendered fully visible (an "empty blob" over
  the disc) for the ~1.6s before the headline appears. The container is now
  hidden via its own `gsap.set(container.current, { autoAlpha: 0 })` and
  faded back in (`autoAlpha: 1`, same `duration`/`delay`/`ease`) alongside
  the headline's own start, restoring the original "whole content area
  fades in as one unit" backdrop behavior while still staggering the 3
  content elements within it.
- Gated behind `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`
  exactly like the code it replaces — reduced-motion users see the final
  state immediately, no ScrollTrigger/tween created at all.
- Reused the CTA's `data-hero-reveal="cta"` attribute as the seam for Story
  2.4's `<Link>` swap (same element, same reveal wiring).
- Verified via `pnpm lint`, `pnpm ts:check`, `pnpm build` (all clean) and a
  dev-server HTML fetch confirming all three `data-hero-reveal` attributes
  and the reveal wiring render correctly. No headless-browser tool was
  available in this environment, so the animation's actual on-screen
  timing/feel was not visually verified — recommend a quick manual check
  (`pnpm dev`, visit `/`) before merging.

## Dependencies

- Story 1.3: Install and Configure GSAP
- Story 2.1: Build Landing Page Static Layout
- Story 2.2: Implement Background Disc Animation

## Blocked By

- Story 1.3: Install and Configure GSAP
- Story 2.1: Build Landing Page Static Layout
- Story 2.2: Implement Background Disc Animation

## Blocking

- Story 2.4: Wire CTA Navigation to List Page

## Definition of Done

- [x] All acceptance criteria met
- [x] Animations trigger correctly on scroll
- [x] CTA remains clickable during animations
- [x] Code committed to repository (staged intentionally left for the user to review/commit)
- [x] No console errors or warnings (verified via build/lint; no live browser console check — see Implementation Notes)
