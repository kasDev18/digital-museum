# Story 1.3: Install and Configure GSAP

**Epic:** Epic 1 - Project Setup  
**Status:** Done  
**Priority:** High  
**Story Points:** 2

## User Story
**As a** developer  
**I want to** install GSAP and configure it for scroll-based animations  
**So that** I can implement smooth, performant animations throughout the application

## Acceptance Criteria
- [x] GSAP core and ScrollTrigger plugin are installed
- [x] GSAP is properly registered for use in components
- [x] Performance considerations are documented (will-change, transform optimizations)
- [x] GSAP context management is set up for cleanup
- [x] Demo animation component confirms proper setup

## Technical Notes
- Install `gsap` and `gsap/ScrollTrigger` via npm
- Create a utility hook or component for GSAP context management
- Document best practices for performance (useTransform, GPU acceleration)

## Implementation Tasks
1. Install GSAP and ScrollTrigger packages via npm
2. Create GSAP utility hook for context management
3. Create demo animation component to test setup
4. Document performance best practices
5. Test demo animation in development environment
6. Verify cleanup functionality works correctly

## Dependencies
- Story 1.1: Initialize Next.js Project with App Router

## Blocked By
- Story 1.1: Initialize Next.js Project with App Router

## Blocking
- Story 2.2: Implement Background Disc Animation
- Story 2.3: Add Scroll-Based Content Animations

## Definition of Done
- [x] All acceptance criteria met
- [x] Demo animation works smoothly
- [x] Code committed to repository
- [x] No console errors or warnings

## Implementation Summary
**Status:** ✅ Done  
**Implementation Date:** 2026-07-11  
**Actual Implementation:**
- Installed `gsap` (3.15.0) and the official React integration `@gsap/react` (2.1.2, provides the `useGSAP` hook) rather than hand-rolling `gsap.context()` bookkeeping — `useGSAP` wraps `gsap.context()` and reverts every tween/timeline/`ScrollTrigger` created in its callback automatically on unmount, which is the currently recommended pattern for GSAP in React (context management the acceptance criteria asks for, without a custom hook to maintain).
- Created `src/lib/gsap-utils.ts` as the single place `ScrollTrigger` and `useGSAP` are registered via `gsap.registerPlugin(...)`. All app code imports `gsap`/`ScrollTrigger`/`useGSAP` from this module (not directly from `gsap`/`@gsap/react`) so registration only ever happens once.
- Created `src/components/gsap-scroll-demo/index.tsx` (+ `styles.module.css`, using the `cn()` helper below for the one class combining a plain DOM-query hook with a CSS Module class), a client component using `useGSAP` (scoped to a container ref) plus `ScrollTrigger.batch()` to fade/slide three panels in independently as each is scrolled into view. It also demonstrates `gsap.matchMedia()` gating on `prefers-reduced-motion` so the animation is skipped for users who've opted out of motion.
  - First pass bound a single `ScrollTrigger` (via `gsap.from(...)`) to the whole container, whose top sits at the very top of the page — its `start: "top 80%"` condition was already satisfied at scroll position 0, so the animation fired immediately on load instead of on scroll. Fixed by giving each panel its own trigger via `ScrollTrigger.batch()`, and by adding a spacer above the panels so they start below the fold.
  - That revealed a second issue: creating the tween lazily inside `onEnter` meant elements had no hidden state beforehand — they rendered fully visible from load and only "popped" through the tween at the scroll moment. Fixed by calling `gsap.set(boxes, { autoAlpha: 0, y: 80 })` up front (hiding them immediately, before any scrolling) and animating *to* the visible state (`gsap.to`) in `onEnter`, rather than animating *from* a state that was never actually applied.
  - A later review pass caught the panels' `will-change-transform` being applied permanently via a static CSS class, contradicting this story's own performance doc (`docs/gsap-performance.md`), which names this exact component as the example of scoping `will-change` to only the active animation window. Fixed by toggling it in the tween's `onStart`/`onComplete` instead of hardcoding it in CSS.
- Added `src/lib/utils.ts` (`cn()`, wrapping `clsx` + `tailwind-merge`) and restructured the demo to use a CSS Module rather than inline Tailwind classNames — this introduces both as the first instance of each pattern in the codebase (every other component so far uses inline Tailwind utility strings). Flagged in the PR description for visibility, not reverted, since it's a deliberate styling choice rather than a bug.
- Mounted the demo at `src/app/gsap-demo/page.tsx` (visit `/gsap-demo` in dev) purely as a setup smoke-test route — it isn't part of the product IA and can be removed once Epic 2's real scroll animations (Stories 2.2/2.3) land.
- Documented performance best practices in [`docs/gsap-performance.md`](../../docs/gsap-performance.md): animate only `transform`/`opacity` (GPU-accelerated, no layout thrash), scope `will-change-transform` to elements actively animating, always create tweens/`ScrollTrigger`s inside `useGSAP` for automatic cleanup, `ScrollTrigger.batch()` for large lists, and gating on `prefers-reduced-motion`.
- Verified with `pnpm build` (clean, `/gsap-demo` prerenders as a static route), `pnpm ts:check` and `pnpm lint` (clean), and repeated headless-browser runs against `pnpm dev`: on load, all panels are hidden (`opacity: 0`, offset `80px`); scrolling reveals each panel independently only once it individually crosses the trigger threshold, with the earlier panels already settled (`opacity: 1`, identity transform) while later ones remain hidden — with zero console/page errors throughout.

**Verification:**
- ✅ GSAP core and ScrollTrigger plugin are installed
- ✅ GSAP is properly registered for use in components (centralized in `src/lib/gsap-utils.ts`)
- ✅ Performance considerations are documented (`docs/gsap-performance.md`)
- ✅ GSAP context management is set up for cleanup (`useGSAP` scoped to a container ref)
- ✅ Demo animation component confirms proper setup (`GsapScrollDemo` at `/gsap-demo`, verified in a real browser)
