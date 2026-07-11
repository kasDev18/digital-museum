# Story 5.6: Add Comment Affordance

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Not Started  
**Priority:** Low (Stretch)  
**Story Points:** 2

## User Story
**As a** visitor  
**I want to** see or add comments about the artifact  
**So that** I can engage with other visitors' perspectives

## Acceptance Criteria
- [ ] Comment component matches Figma design
- [ ] Comment section displays existing comments (mock data)
- [ ] Comment input allows adding new comments
- [ ] Comments are visually distinct and readable
- [ ] If comments are not implemented, button shows stubbed state
- [ ] Comment functionality is clearly stubbed if not fully implemented
- [ ] Component degrades gracefully if comment data is missing

## Technical Notes
- This can be a UI stub if full comment system is out of scope
- Mock comment data in artifact object
- Simple form for adding comments (may not persist)
- Match Figma design for comment section
- Consider this as a visual placeholder if backend is out of scope

## Implementation Tasks
1. Create CommentSection component
2. Display existing comments from mock data
3. Create comment input form
4. Handle comment submission (may not persist)
5. Match Figma design
6. Handle missing comment data gracefully
7. Decide on stub vs. full implementation based on time
8. Test comment functionality

## Dependencies
- Story 5.1: Build Detail Page Layout

## Blocked By
- Story 5.1: Build Detail Page Layout
- **Epic 1-4 completion required before starting Epic 5**

## Blocking
- Story 5.7: Add Location Widget

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Comment section works as stub or full implementation
- [ ] Handles missing data gracefully
- [ ] Code committed to repository
- [ ] No console errors or warnings

## Note
This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.
