# Story 2.3: Add Scroll-Based Content Animations

**Epic:** Epic 2 - Landing Page  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** visitor  
**I want to** see content elements animate in as I scroll down the page  
**So that** the experience feels polished and engaging

## Acceptance Criteria
- [ ] Headline animates in when entering viewport (fade/slide-in)
- [ ] Subtext animates in after headline (staggered timing)
- [ ] CTA button animates in after subtext (staggered timing)
- [ ] Animations use GSAP ScrollTrigger for viewport detection
- [ ] Each element animates only once (no re-trigger flicker)
- [ ] Animations do not block clicking/tapping the CTA at any point
- [ ] Animation timing feels natural and not sluggish

## Technical Notes
- Use GSAP ScrollTrigger for scroll-based animations
- Implement stagger effect for sequential element entrance
- Set `once: true` on ScrollTrigger to prevent re-triggering
- Use transform-based animations for performance
- Test that CTA remains clickable during animation

## Implementation Tasks
1. Import GSAP ScrollTrigger
2. Configure ScrollTrigger for headline animation
3. Configure ScrollTrigger for subtext animation with stagger
4. Configure ScrollTrigger for CTA button animation with stagger
5. Set `once: true` to prevent re-triggering
6. Use transform-based animations (fade/slide-in)
7. Test that CTA remains clickable during animations
8. Verify animation timing feels natural

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
- [ ] All acceptance criteria met
- [ ] Animations trigger correctly on scroll
- [ ] CTA remains clickable during animations
- [ ] Code committed to repository
- [ ] No console errors or warnings
