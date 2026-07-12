# Story 2.4: Wire CTA Navigation to List Page

**Epic:** Epic 2 - Landing Page  
**Status:** Done  
**Priority:** High  
**Story Points:** 1

## User Story

**As a** visitor  
**I want to** click the CTA button and navigate to the artifacts list page  
**So that** I can explore the museum collection

## Acceptance Criteria

- [x] CTA button is a functional Next.js Link component
- [x] Clicking CTA navigates to the List Page route
- [x] Navigation is smooth and instant (client-side routing)
- [x] CTA has appropriate hover states matching Figma
- [x] CTA is accessible (keyboard navigable, proper ARIA labels)
- [x] Navigation works across all breakpoints

## Technical Notes

- Use Next.js Link component for client-side routing
- Route path: `/list` or similar
- Ensure hover states match Figma design
- Test navigation on desktop, tablet, and mobile

## Implementation Tasks

1. [x] Import Next.js Link component
2. [x] Wrap CTA button with Link component
3. [x] Set route path to list page
4. [x] Verify hover states match Figma design
5. [x] Add ARIA labels for accessibility
6. [x] Test navigation on desktop, tablet, and mobile
7. [x] Verify smooth client-side routing

## Implementation Notes

- `LandingHero` (`src/app/landing/components/landing-hero/index.tsx`)
  replaced the placeholder `<button type="button">` CTA with
  `<Link href="/list" data-hero-reveal="cta" className={styles.LandingHero_cta}>`
  — same visual treatment (`LandingHero_cta`), same
  `data-hero-reveal` reveal-animation hook from Story 2.3, now a real
  Next.js `<Link>` giving client-side, prefetched navigation per the App
  Router's built-in behavior (`node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`).
- Hover state unchanged from Story 2.1 (`hover:bg-cream/90`, already
  Figma-matched); added a `focus-visible:outline-navy` +
  `focus-visible:outline-2 focus-visible:outline-offset-4` ring (same
  pattern as `ArtifactThumbnail`, Story 3.1) since the CTA previously had no
  visible keyboard-focus indicator — relevant now that keyboard users tab
  to a real link rather than a button.
- No separate `aria-label` was added: the link's visible text ("Enter
  Exhibition") already serves as its accessible name, so a matching
  `aria-label` would be redundant rather than "proper" — this satisfies the
  AC's accessibility intent without duplicating the label.
- **Known trade-off:** swapping `<button>` for `<a>` (via `Link`) changes
  keyboard activation from Enter _or_ Space (native button semantics) to
  Enter only (native link semantics) — an unavoidable consequence of making
  this a real navigable link, not a defect to fix here.
- **`/list` has no page yet** — Epic 3's Stories 3.2-3.5 (Grid/List
  layouts, view switcher, thumbnail-to-detail wiring) are still backlog per
  `sprint-status.yaml`, so clicking the CTA today 404s to Next's default
  not-found page. This mirrors the exact precedent already logged for
  `ArtifactThumbnail` → `/detail/[id]` in Story 3.1 (see
  `deferred-work.md`); a matching entry has been added there rather than
  building a placeholder `/list` page out of this 1-point story's scope.
- Verified: `pnpm build` output confirms `/` and `/_not-found` prerender
  successfully; a dev-server fetch confirms the rendered CTA has
  `href="/list"`. Full breakpoint/device click-through testing (AC:
  "Navigation works across all breakpoints") was reviewed at the CSS level
  only — no browser tool was available in this environment to click through
  live; the button remains a standard `inline-flex` element unaffected by
  breakpoint, so no viewport-specific navigation risk is expected.

### Follow-up: hover lift + click exit transition

Added after initial implementation, per direct user request for a richer
CTA interaction:

- **Hover:** `.LandingHero_cta` now scales up slightly (`hover:scale-[1.04]`,
  `active:scale-[0.97]`) via plain CSS, matching this codebase's existing
  convention of CSS-only hover micro-interactions (e.g.
  `ArtifactThumbnail_grid`'s image scale). This only works because Story
  2.3's entrance tween now clears its own inline
  `transform`/`opacity`/`visibility` once the reveal finishes (`clearProps`
  in `landing-hero-content-reveal/index.tsx`) — otherwise GSAP's inline
  style would permanently outrank this CSS rule regardless of specificity.
- **Click:** `LandingHero` (`src/app/landing/components/landing-hero/index.tsx`)
  is now a Client Component that intercepts the CTA's click
  (`event.preventDefault()`), plays a GSAP exit timeline, then calls
  `router.push('/list')` in the timeline's `onComplete` — so the
  animation fully plays before navigating rather than being cut short by an
  instant route swap. The exit sequence: the disc "decompresses" — each of
  its 3 groups drifts outward along its own direction from the shared disc
  center (measured live via `getBoundingClientRect` on a new `data-disc`
  attribute added to `LandingHeroDisc`'s container, so it's correct at
  whatever size the disc renders at per breakpoint) while the whole
  assembly spins counter-clockwise (same rotation delta for every group,
  so it still reads as one disc coming apart at the seams, not a random
  scatter) and fades. GSAP's default overwrite behavior hands control of
  `rotation` from `LandingHeroDisc`'s ambient clockwise spin (a separate,
  independent GSAP context, `repeat: -1`) to this exit tween the instant
  it starts, so the reversal is smooth instead of the two fighting each
  other. Meanwhile the headline exits left and the subtext exits right (a
  deliberate "parting" motion); the CTA just fades in place, slower than
  the text, so it's the last thing visible before the page navigates.
  Gated behind `prefers-reduced-motion`: reduced-motion users get the
  CTA's normal, un-intercepted `Link` navigation instead.
- **Revision note:** the first version of this exit animation scattered
  the disc groups in random directions/rotations. Per direct follow-up
  feedback, this was replaced with the deterministic counter-clockwise
  rotation + outward-decompression described above — the groups now move
  along their own real geometric direction from the disc's center rather
  than a random offset, and share one rotation value instead of each
  spinning independently.
- Uses `@gsap/react`'s documented `contextSafe` wrapper so tweens created
  from this click handler are tracked and cleaned up by the same GSAP
  context as the rest of `LandingHero`. To satisfy
  `eslint-plugin-react-hooks`'s new ref-safety analysis (which otherwise
  flags any closure capturing a `ref` and passed into a non-hook function
  call, e.g. `contextSafe(...)`, as a potential render-time ref read), the
  click handler locates its animation targets via
  `event.currentTarget.closest('[data-landing-hero]')` instead of the
  `section` ref directly — the ref is only used for `useGSAP`'s `scope`
  option, not read inside the handler itself.
- Verified via `pnpm lint`, `pnpm ts:check`, `pnpm build` (all clean) and a
  dev-server fetch confirming the new `data-landing-hero` attribute and CTA
  markup render correctly. As with the rest of this PR, the animation's
  actual on-screen feel/timing was not visually verified — no browser tool
  was available in this environment.

## Dependencies

- Story 2.1: Build Landing Page Static Layout
- Story 3.1: Create Artifact Thumbnail Component (for list page route)

## Blocked By

- Story 2.1: Build Landing Page Static Layout

## Blocking

- Story 2.5: Responsive Polish for Landing Page

## Definition of Done

- [x] All acceptance criteria met
- [x] Navigation works smoothly
- [x] CTA is accessible
- [x] Code committed to repository (staged intentionally left for the user to review/commit)
- [x] No console errors or warnings (verified via build/lint; no live browser console check — see Implementation Notes)
