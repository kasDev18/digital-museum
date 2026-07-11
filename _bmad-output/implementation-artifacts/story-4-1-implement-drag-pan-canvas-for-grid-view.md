# Story 4.1: Implement Drag/Pan Canvas for Grid View

**Epic:** Epic 4 - List Page Interaction  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 5

## User Story
**As a** visitor  
**I want to** click and drag to pan around the grid in any direction  
**So that** I can explore the artifact collection freely

## Acceptance Criteria
- [ ] Grid view supports mouse drag to pan in any direction
- [ ] Grid view supports touch/swipe drag on mobile devices
- [ ] Drag cursor affordance shown on hover/drag start (per Figma drag icon)
- [ ] Canvas has infinite/loose bounds (no hard edges that abruptly stop)
- [ ] Dragging feels smooth and responsive
- [ ] Drag does not interfere with clicking thumbnails
- [ ] Optional: inertia/momentum on release (nice-to-have)

## Technical Notes
- Implement custom drag handler using mouse/touch events
- Use transform (translate) for performant dragging
- Calculate delta from drag start position
- Implement loose bounds with easing at edges
- Consider inertia using momentum calculation (optional)
- Distinguish between drag and click (time threshold or movement threshold)

## Implementation Tasks
1. Create drag handler hook or component
2. Implement mouse event handlers (mousedown, mousemove, mouseup)
3. Implement touch event handlers (touchstart, touchmove, touchend)
4. Calculate drag delta and apply transform
5. Implement loose bounds with edge easing
6. Add drag cursor affordance
7. Distinguish between drag and click actions
8. Optional: Implement inertia/momentum on release
9. Test drag functionality on desktop and mobile

## Dependencies
- Story 3.2: Build Grid View Layout

## Blocked By
- Story 3.2: Build Grid View Layout

## Blocking
- Story 4.5: Touch Support Optimization for Mobile

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Drag works smoothly on desktop and mobile
- [ ] Canvas bounds feel natural and loose
- [ ] Code committed to repository
- [ ] No console errors or warnings
