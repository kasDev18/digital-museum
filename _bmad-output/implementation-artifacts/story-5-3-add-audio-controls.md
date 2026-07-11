# Story 5.3: Add Audio Controls (Play/Pause/Listen)

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Not Started  
**Priority:** Low (Stretch)  
**Story Points:** 2

## User Story
**As a** visitor  
**I want to** listen to audio commentary or sound associated with the artifact  
**So that** I can have an auditory experience of the artifact

## Acceptance Criteria
- [ ] Audio control component matches Figma design (play/pause/listen icons)
- [ ] Play/pause button toggles audio playback
- [ ] Audio progress is indicated (progress bar or time display)
- [ ] Component is visually present even if audioUrl is null (stubbed)
- [ ] If audioUrl is null, button shows disabled or placeholder state
- [ ] Audio controls are accessible (keyboard navigable, proper ARIA labels)
- [ ] Audio playback is smooth and does not block UI

## Technical Notes
- Use HTML5 Audio API or a library
- Match Figma design for controls (play, pause, listen icons)
- Handle missing audio gracefully (disabled state or hidden)
- Consider custom audio player for consistent styling
- Ensure audio doesn't autoplay (user interaction required)

## Implementation Tasks
1. Create AudioControls component
2. Implement play/pause functionality
3. Add audio progress indicator
4. Handle missing audioUrl gracefully
5. Match Figma design for controls
6. Add accessibility features
7. Test audio playback
8. Ensure smooth UI during audio playback

## Dependencies
- Story 5.1: Build Detail Page Layout

## Blocked By
- Story 5.1: Build Detail Page Layout
- **Epic 1-4 completion required before starting Epic 5**

## Blocking
- Story 5.4: Add Zoom Controls (Zoom In/Out)

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Audio controls work smoothly
- [ ] Handles missing audio gracefully
- [ ] Code committed to repository
- [ ] No console errors or warnings

## Note
This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.
