# Story 2.4: Wire CTA Navigation to List Page

**Epic:** Epic 2 - Landing Page  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 1

## User Story
**As a** visitor  
**I want to** click the CTA button and navigate to the artifacts list page  
**So that** I can explore the museum collection

## Acceptance Criteria
- [ ] CTA button is a functional Next.js Link component
- [ ] Clicking CTA navigates to the List Page route
- [ ] Navigation is smooth and instant (client-side routing)
- [ ] CTA has appropriate hover states matching Figma
- [ ] CTA is accessible (keyboard navigable, proper ARIA labels)
- [ ] Navigation works across all breakpoints

## Technical Notes
- Use Next.js Link component for client-side routing
- Route path: `/list` or similar
- Ensure hover states match Figma design
- Test navigation on desktop, tablet, and mobile

## Implementation Tasks
1. Import Next.js Link component
2. Wrap CTA button with Link component
3. Set route path to list page
4. Verify hover states match Figma design
5. Add ARIA labels for accessibility
6. Test navigation on desktop, tablet, and mobile
7. Verify smooth client-side routing

## Dependencies
- Story 2.1: Build Landing Page Static Layout
- Story 3.1: Create Artifact Thumbnail Component (for list page route)

## Blocked By
- Story 2.1: Build Landing Page Static Layout

## Blocking
- Story 2.5: Responsive Polish for Landing Page

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Navigation works smoothly
- [ ] CTA is accessible
- [ ] Code committed to repository
- [ ] No console errors or warnings
