# Story 5.4: Add Zoom Controls (Zoom In/Out)

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Not Started  
**Priority:** Low (Stretch)  
**Story Points:** 2

## User Story
**As a** visitor  
**I want to** zoom in and out on the artifact media  
**So that** I can examine fine details

## Acceptance Criteria
- [ ] Zoom controls match Figma design (zoom in/out icons)
- [ ] Zoom in button increases media scale
- [ ] Zoom out button decreases media scale
- [ ] Zoom is constrained within reasonable limits (e.g., 0.5x to 3x)
- [ ] Zoom is smooth and performant (uses CSS transform)
- [ ] Zoom state is reset when changing media items
- [ ] Zoom controls are accessible (keyboard navigable)

## Technical Notes
- Use CSS transform scale for zoom
- Implement pan when zoomed (optional but good UX)
- Limit zoom range to prevent breaking layout
- Reset zoom on carousel slide change
- Consider pinch-to-zoom on touch devices (stretch feature)

## Implementation Tasks
1. Create ZoomControls component
2. Implement zoom in functionality
3. Implement zoom out functionality
4. Add zoom range constraints
5. Implement smooth zoom with CSS transform
6. Reset zoom on media change
7. Add accessibility features
8. Test zoom functionality

## Dependencies
- Story 5.2: Implement Media Carousel

## Blocked By
- Story 5.2: Implement Media Carousel
- **Epic 1-4 completion required before starting Epic 5**

## Blocking
- Story 5.5: Add Download PDF Action

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Zoom works smoothly
- [ ] Code committed to repository
- [ ] No console errors or warnings

## Note
This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.
