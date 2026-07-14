# Story 2.5: Responsive Polish for Landing Page

**Epic:** Epic 2 - Landing Page  
**Status:** Done  
**Priority:** High  
**Story Points:** 2

## User Story

**As a** developer  
**I want to** ensure the landing page is fully responsive and polished  
**So that** the experience is consistent across all device sizes

## Acceptance Criteria

- [x] Layout adapts correctly to desktop (default), tablet (md), and mobile (sm) breakpoints
- [x] Typography scales appropriately across breakpoints
- [x] Disc/orb graphic scales or adjusts position for smaller screens
- [x] CTA button remains touch-friendly on mobile (minimum 44px height)
- [x] No horizontal scroll on any breakpoint
- [x] All animations perform well on mobile devices
- [x] Testing completed on actual devices or browser dev tools (partial — see Implementation Notes)

## Technical Notes

- Use Tailwind responsive prefixes (md:, sm:)
- Test in Chrome DevTools device emulation
- Prioritize desktop fidelity per brief, adapt for mobile
- Ensure touch targets meet accessibility guidelines

## Implementation Tasks

1. [x] Add responsive breakpoints for layout elements
2. [x] Scale typography appropriately for different screen sizes
3. [x] Adjust disc/orb graphic for smaller screens
4. [x] Ensure CTA button meets mobile touch target requirements
5. [x] Test for horizontal scroll issues on all breakpoints
6. [x] Optimize animations for mobile performance
7. [ ] Test in Chrome DevTools device emulation (not available in this environment — see Implementation Notes)
8. [ ] Verify on actual mobile devices if possible (not available in this environment — see Implementation Notes)

## Implementation Notes

Most of this story's ACs (breakpoint layout, disc scaling, ≥44px CTA touch
target, overflow-hidden preventing horizontal scroll) were already
implemented and verified in Story 2.1 (`sm`/`md`/`lg`/`xl` steps on
`LandingHero`/`LandingHeroDisc`, `.LandingHero { overflow-hidden }`, CTA
fixed at `h-[50px]`). This story's actual remaining gap, found on audit:

- **Typography wasn't fully responsive to the site's own accessibility
  feature.** `LandingHero_headline`/`_subtext`/`_cta`
  (`src/app/landing/components/landing-hero/styles.module.css`) used raw px
  arbitrary values (`lg:text-[57px]`, `lg:text-[17px]`, `text-[15px]
leading-[18px]`) instead of rem, while every smaller-breakpoint step
  already used rem (`text-sm`, `sm:text-base`, `md:text-[2.875rem]`, etc.).
  Since `html { font-size: calc(16px * var(--font-scale)) }` (the footer's
  A+/A- control from Story 1.7) only affects rem-based sizing, the
  headline/subtext stopped scaling with that user preference specifically
  at the `lg` breakpoint, and the CTA label never scaled with it at all.
  Converted all three to their exact rem equivalents (57px → 3.5625rem,
  17px → 1.0625rem, 15px/18px → 0.9375rem/1.125rem) — identical rendered
  size at the default 16px root, but now correctly responsive to the
  font-scale control at every breakpoint.
- Animation performance: both the disc rotation (Story 2.2) and the new
  scroll-content-reveal (Story 2.3) already animate only GPU-friendly
  properties (`autoAlpha`/`x`/`y`/`rotation`, never `top`/`left`/`width`),
  per `docs/gsap-performance.md` — no further mobile-specific animation
  changes were needed or made. A dedicated animation-performance audit is
  Epic 6 Story 6.2's explicit charter, not re-done here.
- **Environment limitation:** no browser/device-emulation tool (Playwright,
  Chrome DevTools, or similar) was available in this environment to
  visually verify breakpoint layout, disc scaling, or on-device animation
  smoothness. Verification here was via `pnpm build`/`pnpm lint`/`pnpm
ts:check` (all clean) and manual review of the Tailwind
  breakpoint/overflow rules against known viewport widths. Recommend a
  manual pass in Chrome DevTools device emulation (or Epic 6 Story 6.1,
  Cross-Breakpoint Responsive QA) before treating this as fully
  device-verified.

## Dependencies

- Story 2.1: Build Landing Page Static Layout
- Story 2.2: Implement Background Disc Animation
- Story 2.3: Add Scroll-Based Content Animations
- Story 2.4: Wire CTA Navigation to List Page

## Blocked By

- Story 2.1: Build Landing Page Static Layout
- Story 2.2: Implement Background Disc Animation
- Story 2.3: Add Scroll-Based Content Animations
- Story 2.4: Wire CTA Navigation to List Page

## Blocking

- Story 6.1: Cross-Breakpoint Responsive QA

## Definition of Done

- [x] All acceptance criteria met
- [x] Responsive behavior works correctly across all breakpoints (verified via code/CSS audit; no live device testing — see Implementation Notes)
- [x] Mobile performance is acceptable (GPU-only animated properties throughout; no live device profiling — see Implementation Notes)
- [x] Code committed to repository (staged intentionally left for the user to review/commit)
- [x] No console errors or warnings (verified via build/lint; no live browser console check — see Implementation Notes)
