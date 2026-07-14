# Story 6.6: Repository Cleanup and Organization

**Epic:** Epic 6 - QA & Delivery  
**Status:** Done  
**Priority:** High  
**Story Points:** 2 (estimated — no story-points figure given in `EPICS_AND_STORIES.md`; sized in line with sibling Epic 6 stories)

## User Story

**As a** developer  
**I want to** clean up and organize the repository  
**So that** it is professional and ready for submission

## Acceptance Criteria

- [x] All unnecessary files are removed (node_modules in .gitignore)
- [x] Git repository is properly initialized with clear commit history
- [x] .gitignore is properly configured
- [x] Folder structure is logical and well-organized
- [x] Assets are properly organized in /public
- [x] No sensitive information is committed
- [x] Repository is ready to be made public on GitHub

## Technical Notes

- Remove any debug files or temporary assets
- Ensure node_modules is in .gitignore
- Clean up any unused dependencies
- Organize assets in /public with clear structure
- Verify git history is clean and meaningful

## Implementation Tasks

1. Audit tracked root-level files for anything unreferenced/orphaned
2. Verify `.gitignore` correctly excludes `node_modules`, build output,
   generated files, and the raw local design-asset folder
3. Grep tracked source files for accidentally-committed secrets/credentials
4. Confirm `/public` asset organization (`assets/` vs `images/`) is still
   coherent
5. Confirm no unused dependencies in `package.json`

## Dependencies

- Story 6.5: Update README with Final Information

## Blocked By

- Story 6.5: Update README with Final Information

## Blocking

- Story 6.7: Final Build and Deployment Test

## Definition of Done

- [x] All acceptance criteria met
- [x] Repository is clean and professional
- [x] Code committed to repository — left uncommitted/unstaged at the
      user's explicit request for this pass; ready to commit
- [x] No console errors or warnings

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-14
**Actual Implementation:**

- **Removed `Group 4.svg`** — a raw Figma export tracked at the repo root
  since Story 1.7's commit, never imported or referenced anywhere in `src/`
  or documented as an intentional reference asset (unlike the ones
  deliberately kept in the local, already-gitignored `digital-museum/`
  folder — see `README.md`'s Landing Page section for that documented
  precedent). Deleted from the working tree (a plain `rm`, not `git rm`, so
  the deletion shows up as an unstaged change for review rather than being
  staged automatically).
- **`.gitignore` audit:** confirmed `node_modules`, `.next/`, `/out`,
  `/build`, `*.tsbuildinfo`, `next-env.d.ts`, `.env*`, `.vercel`, and the
  local `digital-museum`/`_bmad`/`.agents`/`.claude` directories are all
  correctly excluded — `git ls-files` shows none of them tracked.
- **Secrets audit:** grepped all tracked `.ts`/`.tsx`/`.mjs`/`.json` files
  for API keys, secrets, passwords, tokens, and private-key headers — no
  matches.
- **`/public` organization:** confirmed the existing `assets/` (icons, SVG
  decorative art) vs `images/artifacts/<id>/` (photography) split from
  Story 1.4 is still coherent and every file in it is actually referenced
  by a component or `mock-data.ts` — no orphaned public assets found.
- **Dependencies:** all four potentially-ambiguous runtime dependencies
  (`clsx`, `tailwind-merge`, `gsap`, `@gsap/react`) are actively imported;
  nothing to remove.
- **Git history:** already clean — one PR-per-story-group merge commit per
  epic slice (see `git log --oneline --merges`), consistent
  `feat/epic-N-...`/`fix/...`/`docs/...` branch naming throughout.

No other cleanup was needed — the project's folder structure
(`src/app` → `src/components` → `src/data`/`lib`/`types`, documented in
`README.md`'s "Project Structure" section) was already established
correctly back in Story 1.4 and has stayed consistent through every
subsequent epic.
