# Story 3.4: Implement View Switcher Toggle

**Epic:** Epic 3 - List Page Foundation  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 2

## User Story
**As a** visitor  
**I want to** toggle between Grid and List views  
**So that** I can choose my preferred browsing experience

## Acceptance Criteria
- [ ] View switcher component matches Figma design (icon-based toggle)
- [ ] Toggle switches between Grid and List layouts
- [ ] Current view mode is visually indicated
- [ ] Toggle is accessible (keyboard navigable, proper ARIA labels)
- [ ] Toggle has smooth transition between views
- [ ] Toggle works across all breakpoints
- [ ] View mode state is managed in React state

## Technical Notes
```typescript
type ViewMode = 'grid' | 'list';
```
- Use React state for view mode management
- Implement smooth transition between views (fade or slide)
- Use view switcher icon from Figma assets
- Ensure toggle is touch-friendly on mobile

## Implementation Tasks
1. Create ViewSwitcher component
2. Define ViewMode type and state
3. Implement toggle functionality
4. Add visual indication of current view mode
5. Implement smooth transition between views
6. Add accessibility features (ARIA labels, keyboard navigation)
7. Ensure touch-friendly on mobile
8. Test toggle functionality

## Dependencies
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout

## Blocked By
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout

## Blocking
- Story 4.4: Preserve State Across View Mode Switching

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Toggle works smoothly between views
- [ ] Component is accessible
- [ ] Code committed to repository
- [ ] No console errors or warnings
