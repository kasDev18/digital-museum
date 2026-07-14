# Story 1.4: Establish Project Folder Structure

**Epic:** Epic 1 - Project Setup  
**Status:** Done  
**Priority:** High  
**Story Points:** 1

## User Story
**As a** developer  
**I want to** create a logical, scalable folder structure  
**So that** the codebase remains organized and maintainable as it grows

## Acceptance Criteria
- [x] Component structure: `/components` with subdirectories by feature/page
- [x] Data layer: `/data` or `/lib` for mock data and data utilities
- [x] Assets: `/public` folder organized by type (images, fonts, etc.)
- [x] Utilities: `/lib` or `/utils` for shared helper functions
- [x] Types: `/types` for TypeScript interfaces and types
- [x] README documents the folder structure and conventions

## Technical Notes
```
/app
  /layout.tsx
  /page.tsx
  /landing
  /list
  /detail
/components
  /landing
  /list
  /detail
  /ui (shared components)
/data
  /mock-data.ts
/lib
  /gsap-utils.ts
  /data-utils.ts
/types
  /artifact.ts
/public
  /images
  /assets
```

## Implementation Tasks
1. Create component directory structure with feature subdirectories
2. Create data layer directory structure
3. Organize public assets folder by type
4. Create utilities directory for shared functions
5. Create types directory for TypeScript interfaces
6. Document folder structure in README

## Dependencies
- Story 1.1: Initialize Next.js Project with App Router

## Blocked By
- Story 1.1: Initialize Next.js Project with App Router

## Blocking
- Story 1.5: Create Mock Data Layer
- Story 2.1: Build Landing Page Static Layout
- Story 3.1: Create Artifact Thumbnail Component

## Definition of Done
- [x] All acceptance criteria met
- [x] Folder structure is documented in README
- [x] Code committed to repository

## Implementation Summary
**Status:** ✅ Done  
**Implementation Date:** 2026-07-11  
**Actual Implementation:**
- Created `src/app/{landing,list,detail}` route segments, each with a colocated `components/` subfolder for that page's own components (empty pending their respective epics — no `page.tsx` yet, so the route segments aren't publicly routable per Next.js App Router conventions, and a bare `components` folder with no special filename is never routable regardless)
- Created `src/components/{layout,ui}` for components genuinely shared across more than one page (site chrome, generic primitives) — kept in git via `.gitkeep` until Story 1.7/Epic 2+ add real content
- Created `src/data` and `src/types` directories (empty pending Story 1.5's mock data and `Artifact` interface)
- Reorganized `/public` by type: moved the two actively-used create-next-app icons (`next.svg`, `vercel.svg`) into `public/assets/`, updated their references in `src/app/page.tsx`, and removed three unreferenced leftover icons (`globe.svg`, `file.svg`, `window.svg`); `public/images` reserved for artifact photography added in later stories
- Removed the unused, unreferenced `src/app/home` stub route left over from initial scaffolding — it wasn't part of the intended `/landing`, `/list`, `/detail` route structure and nothing linked to it
- Updated root layout metadata (was still the generic "Create Next App" title/description)
- Documented the full structure and conventions (page-specific components colocated in `app/`, `src/components` reserved for cross-page shared components, data/lib split, types, public asset split, `.gitkeep` policy) in the README's Project Structure section
- `/lib` and its two files (`gsap-utils.ts`, `utils.ts`) already existed from Story 1.3 and satisfy the utilities AC as-is

**Deviation from Technical Notes:** the Technical Notes above sketch feature subdirectories directly under `/components` (`components/landing`, `components/list`, `components/detail`). Per direct developer instruction, this was refined to colocate page-specific components inside their route segment (`app/<route>/components/`) instead, reserving the top-level `src/components` for components that are genuinely shared across more than one page. This still satisfies the AC's intent ("subdirectories by feature/page" + "`/ui` shared components") while following Next.js's recommended colocation pattern — see `app/gsap-demo/components/gsap-scroll-demo/` for the first applied example (moved from `components/gsap-scroll-demo` to demonstrate the convention).

**Current Structure:**
```
src/
  app/
    layout.tsx
    page.tsx
    fonts.ts
    globals.css
    landing/
      components/ (.gitkeep)
    list/
      components/ (.gitkeep)
    detail/
      components/ (.gitkeep)
    gsap-demo/
      page.tsx
      components/
        gsap-scroll-demo/
          index.tsx
          styles.module.css
  components/
    layout/ (.gitkeep)
    ui/ (.gitkeep)
  data/ (.gitkeep)
  types/ (.gitkeep)
  lib/
    gsap-utils.ts
    utils.ts
public/
  images/ (.gitkeep)
  assets/
    next.svg
    vercel.svg
```

**Verification:**
- ✅ Component structure: `/components` with subdirectories by feature/page
- ✅ Data layer: `/data` or `/lib` for mock data and data utilities
- ✅ Assets: `/public` folder organized by type (images, fonts, etc.)
- ✅ Utilities: `/lib` or `/utils` for shared helper functions
- ✅ Types: `/types` for TypeScript interfaces and types
- ✅ README documents the folder structure and conventions
- Verified with `pnpm build` (clean), `pnpm ts:check` (clean), and `pnpm lint` (clean)
