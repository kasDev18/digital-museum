# Story 1.7: Build Shared Header & Footer Chrome

**Epic:** Epic 1 - Project Setup  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** visitor  
**I want to** see consistent branding, navigation, and accessibility controls on every page  
**So that** the site feels like one cohesive exhibition, not three disconnected pages

## Acceptance Criteria
- [ ] Shared header shows the "Artifacta" logo mark (the small circular/arc icon, a simplified version of the landing disc motif) plus the "Artifacta" wordmark, present on Landing, List, and Detail pages
- [ ] Shared footer shows "Copyright ©2025 Artifacta" (left) and social icons for X/Twitter and YouTube (right), per the footer export
- [ ] Footer includes a pill-shaped utility cluster with a dark/light theme toggle (moon icon) and font-size controls ("A+" / "A-")
- [ ] Theme toggle switches the whole app between the dark-navy theme and a light variant, persisting the choice (e.g. localStorage)
- [ ] Font-size controls scale body text up/down within reasonable bounds, applied globally (e.g. via a root CSS custom property or Tailwind text-scale class on `<html>`)
- [ ] Header/footer are built as shared layout components (e.g. in the root or route-group layout) rather than duplicated per page
- [ ] Social icon links are functional anchors (can point to placeholder URLs) and open in a new tab

## Technical Notes
- Logo asset: `Logo (1).png` (arc/sunburst icon) — `Logo.png` export is a blank/transparent placeholder, not usable as-is
- Implement theme toggle via a `class="dark"` strategy on `<html>` + Tailwind `dark:` variants, or a small ThemeProvider context
- Font-size scaling can be a simple `--font-scale` CSS variable multiplied into base rem sizing, adjusted by the A+/A- buttons
- Keep this component tree in `/components/layout` (e.g. `SiteHeader`, `SiteFooter`) per the folder structure in Story 1.4

## Implementation Tasks
1. Create shared header component (SiteHeader) with logo and wordmark
2. Create shared footer component (SiteFooter) with copyright and social links
3. Implement theme toggle functionality with localStorage persistence
4. Implement font-size controls with global CSS variable scaling
5. Integrate header/footer into root layout for consistency across pages
6. Add proper accessibility attributes to controls
7. Test theme toggle persistence across page reloads
8. Test font-size scaling within reasonable bounds

## Dependencies
- Story 1.1: Initialize Next.js Project with App Router
- Story 1.2: Configure Tailwind CSS
- Story 1.4: Establish Project Folder Structure

## Blocked By
- Story 1.1: Initialize Next.js Project with App Router
- Story 1.2: Configure Tailwind CSS
- Story 1.4: Establish Project Folder Structure

## Blocking
- Story 2.1: Build Landing Page Static Layout
- Story 3.1: Create Artifact Thumbnail Component
- Story 5.1: Build Detail Page Layout

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Header/footer components are reusable and shared across pages
- [ ] Theme toggle persists across sessions
- [ ] Font-size controls work globally
- [ ] Code committed to repository
- [ ] No console errors or warnings

## Implementation Summary
**Status:** ❌ Not Started  
**Implementation Date:** N/A  
**Actual Implementation:**
- No shared header component created
- No shared footer component created
- No theme toggle functionality implemented
- No font-size controls implemented
- Logo assets not yet integrated

**Verification:**
- ❌ Shared header shows the "Artifacta" logo mark plus wordmark
- ❌ Shared footer shows copyright and social icons
- ❌ Footer includes theme toggle and font-size controls
- ❌ Theme toggle switches between dark/light themes with persistence
- ❌ Font-size controls scale body text globally
- ❌ Header/footer are built as shared layout components
- ❌ Social icon links are functional anchors