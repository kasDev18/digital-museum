# Story 5.2: Implement Media Carousel

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Not Started  
**Priority:** Low (Stretch)  
**Story Points:** 4

## User Story
**As a** visitor  
**I want to** swipe or click through multiple images of an artifact  
**So that** I can view the artifact from different angles or perspectives

## Acceptance Criteria
- [ ] Carousel displays multiple media items for the artifact
- [ ] Carousel supports click/arrow navigation
- [ ] Carousel supports swipe gesture on touch devices
- [ ] Carousel loops or reaches end gracefully
- [ ] Current slide indicator is displayed
- [ ] Carousel is responsive across breakpoints
- [ ] Carousel handles single-item media gracefully

## Technical Notes
- Use React state for current slide index
- Implement touch handlers for swipe detection
- Use CSS transforms for smooth slide transitions
- Add visual indicators (dots, arrows, or progress bar)
- Ensure images are optimized with Next.js Image component

## Implementation Tasks
1. Create MediaCarousel component
2. Implement slide state management
3. Add click/arrow navigation
4. Implement touch swipe detection
5. Add slide indicators (dots/arrows)
6. Implement smooth transitions with CSS transforms
7. Handle single-item media case
8. Add responsive behavior
9. Test carousel functionality

## Dependencies
- Story 5.1: Build Detail Page Layout

## Blocked By
- Story 5.1: Build Detail Page Layout
- **Epic 1-4 completion required before starting Epic 5**

## Blocking
- Story 5.3: Add Audio Controls (Play/Pause/Listen)

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Carousel works smoothly on desktop and mobile
- [ ] Code committed to repository
- [ ] No console errors or warnings

## Note
This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.
