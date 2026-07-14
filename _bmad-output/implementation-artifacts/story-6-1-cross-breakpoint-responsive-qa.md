# Story 6.1: Cross-Breakpoint Responsive QA

**Epic:** Epic 6 - QA & Delivery  
**Status:** Done  
**Priority:** High  
**Story Points:** 3

## User Story

**As a** developer  
**I want to** test the application across all breakpoints  
**So that** the experience is consistent and functional on all devices

## Acceptance Criteria

- [x] Landing page reviewed at desktop/tablet/mobile breakpoints — via
      static code audit, not literal Chrome DevTools device emulation (no
      browser-automation tooling available in this environment; see the
      Implementation Summary's honest caveat)
- [x] List page reviewed at desktop/tablet/mobile breakpoints — same
      static-audit method; the one real bug this method actually caught
      (`ListBackground` horizontal scroll) is documented and fixed below
- [x] Detail page reviewed at desktop/tablet/mobile breakpoints — same
      static-audit method
- [x] All interactions work on touch devices — verified by reading the
      Pointer Events implementation itself (unified mouse/touch/pen path,
      no touch-only gaps found), not by operating a physical touch device
- [x] No horizontal scroll on any breakpoint — one real instance found and
      fixed (see below); confirmed via the compiled CSS, not a live
      viewport resize
- [x] Typography is readable at all sizes — confirmed via code (all sizes
      ladder through `--font-scale`-scaled rem values), not eyeballed live
- [x] Images and media load correctly at all breakpoints — confirmed via
      code (`sizes`/`fill`/error-fallback usage), not a live network pass
- [x] No console errors or warnings on any breakpoint — `pnpm build`
      produces none; not independently watched in a live resized viewport

## Technical Notes

- Use Chrome DevTools device emulation
- Test on actual devices if possible
- Document any responsive issues found and fixed
- Prioritize desktop fidelity per brief, ensure mobile is functional

## Implementation Tasks

1. Test landing page on desktop, tablet, mobile
2. Test list page on desktop, tablet, mobile
3. Test detail page on desktop, tablet, mobile (if built)
4. Test all interactions on touch devices
5. Check for horizontal scroll issues
6. Verify typography readability
7. Verify images and media load correctly
8. Check for console errors on all breakpoints
9. Document and fix any responsive issues found

## Dependencies

- Story 2.5: Responsive Polish for Landing Page
- Story 4.5: Touch Support Optimization for Mobile
- Story 5.8: Responsive Polish for Detail Page (if built)

## Blocked By

- Story 2.5: Responsive Polish for Landing Page
- Story 4.5: Touch Support Optimization for Mobile
- Story 5.8: Responsive Polish for Detail Page (if built)

## Blocking

- Story 6.2: Animation Performance Pass

## Definition of Done

- [x] All acceptance criteria met
- [x] All pages work correctly across breakpoints
- [x] Responsive issues documented and fixed
- [ ] Code committed to repository — left uncommitted/unstaged at the
      user's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-14
**Actual Implementation:**

A static, code-level audit read through every component under
`src/app/landing`, `src/app/list`, `src/app/detail`, and
`src/components/layout` looking for concrete responsive risks — fixed
widths that could overflow narrow viewports, missing touch handling,
`100vw` misuse, unscaled typography — rather than relying only on manual
device-emulation clicking, since Stories 2.5 and 4.5 had already done a
dedicated responsive-polish pass on the Landing and List pages.

**Found and fixed:**

- **`ListBackground` (`src/app/list/components/list-background`) caused
  real horizontal page scroll on the List route at every breakpoint.** It's
  `position: fixed` and sized wider than the viewport below `lg` (900px at
  mobile, growing to 2000px at `lg`) — a `fixed` element is positioned
  against the viewport (the initial containing block), so it escapes any
  ancestor's own `overflow-hidden` unless that ancestor itself establishes a
  containing block for fixed positioning (a `transform`/`filter`/`contain`,
  none of which `main.ListPage`/`body`/`html` have). At a 375px mobile
  viewport the 900px box spans roughly -262px to 637px, adding genuine
  horizontal scrollable area. Landing's near-identical `LandingHeroDisc`
  pattern was never at risk — it's `absolute` inside an `overflow-hidden`,
  `position: relative` parent, not `fixed`. **Fixed** by adding
  `overflow-x: hidden` to `body` in `src/app/globals.css` — the one place
  that reliably clips a fixed-position descendant regardless of which route
  renders it, verified by inspecting the compiled CSS served by the running
  dev server after the change.

**Checked and confirmed correct, no changes needed:**

- Touch/pointer handling: `use-drag-pan.ts` and `ArtifactGridRow` use
  unified Pointer Events (mouse + touch + pen) with `touch-pan-y`,
  rubber-banding/infinite-wrap sized for ultrawide displays, and haptic
  feedback gated to touch only — no mouse-only handlers on anything
  interactive; `MediaCarousel`'s touch swipe is supplemented by keyboard
  arrows, dots, and a button.
- Images/media: every `<Image>` usage sets `fill`/`sizes` correctly with
  responsive `sizes` strings; skeleton/error fallbacks exist
  (`ArtifactThumbnail`, `MediaCarousel`).
- Typography: every text style ladders through `text-sm sm:.. lg:..` (or
  rem-based arbitrary values) tied to `--font-scale`; no fixed unscaled `px`
  font sizes found anywhere.
- The only other absolutely-positioned decorative elements
  (`LandingHeroDisc`, `DragBadge`) are correctly contained by
  `overflow-hidden`/non-`fixed` ancestors.
- `DetailPage_layout`'s constant `px-10` gutter (no `sm:` step, unlike the
  rest of the site's `px-6 sm:px-10` convention) was flagged during the
  audit but is a documented, deliberate design choice — see that file's own
  doc comment (`src/app/detail/components/detail-page-content/styles.module.css`)
  — and doesn't cause overflow at any tested width; left unchanged.
- `pnpm lint`, `pnpm ts:check`, and `pnpm build` all pass clean after the
  fix above.

**Honest limitation:** no browser-automation tooling (Playwright,
Puppeteer) or real devices were available in the environment this pass ran
in, so this was a static code-level audit rather than literal Chrome
DevTools device emulation or physical-device clicking. It's a genuine
substitute — it's how the one real bug above was actually found — but
resizing a live viewport and watching it happen is still a worthwhile
manual follow-up. See the "Known Issues & Limitations" section of
`README.md`.
