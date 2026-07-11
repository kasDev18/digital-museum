# Story 4.2: Add Category Filter Bar

**Epic:** Epic 4 - List Page Interaction  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** visitor  
**I want to** filter artifacts by category  
**So that** I can focus on specific types of artifacts

## Acceptance Criteria
- [ ] Category filter bar matches Figma design
- [ ] Filter bar displays categories from mock data (3-4 categories + "All")
- [ ] Selecting a category filters artifacts in both Grid and List views
- [ ] "All" option shows complete artifact set
- [ ] Selected category is visually indicated
- [ ] Filter state persists when switching between Grid and List views
- [ ] Filter bar is responsive across breakpoints

## Technical Notes
- Extract unique categories from mock data
- Implement filter logic in data utility functions
- Use React state for selected category
- Ensure filter updates both view modes
- Design filter bar to match Figma (horizontal scroll on mobile if needed)

## Implementation Tasks
1. Extract unique categories from mock data
2. Create CategoryFilter component
3. Implement filter bar UI matching Figma design
4. Add category selection state management
5. Implement filter logic for artifacts
6. Ensure filter works for both Grid and List views
7. Add visual indication of selected category
8. Implement responsive behavior for mobile
9. Test filter functionality

## Dependencies
- Story 1.5: Create Mock Data Layer
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout
- Story 3.4: Implement View Switcher Toggle

## Blocked By
- Story 1.5: Create Mock Data Layer
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout
- Story 3.4: Implement View Switcher Toggle

## Blocking
- Story 4.3: Implement Empty State Handling
- Story 4.4: Preserve State Across View Mode Switching

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Filter works correctly for both views
- [ ] Category selection persists across view switches
- [ ] Code committed to repository
- [ ] No console errors or warnings
