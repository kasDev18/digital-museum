# Story 1.5: Create Mock Data Layer

**Epic:** Epic 1 - Project Setup  
**Status:** Done
**Priority:** High  
**Story Points:** 3

## User Story

**As a** developer  
**I want to** create a JSON-based mock data structure for artifacts  
**So that** content is data-driven and easily maintainable across pages

## Acceptance Criteria

- [x] TypeScript interface defined for Artifact data model
- [x] Mock data file created with the 12 real artifacts from the Figma board: Wooden Chest, Vyshyvanka, Carnival Mask, Beaded Gown, Mshatta Façade, Lei Po'o, Tatreez Thobe, Mbira, Minbar, Bamboo Pen, Backgammon Board, Jamdani
- [x] Data includes all required fields: id, title, type, thumbnail, media, description
- [x] Category (`type`) values are drawn from the real 7-category set: Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable (with "All Objects" handled as a UI-level "no filter" state, not a stored category)
- [x] Contributor fields included: `contributor.name` and `contributor.quote`, matching the "Contributed by [Name]" byline and pull-quote seen on the detail mock (e.g. Mshatta Façade / Mansoor Alemy)
- [x] Optional fields included: audioUrl (+ duration), pdfUrl, journey (migration path)
- [x] Data utility functions for filtering and accessing artifacts
- [x] Data is easily extensible for additional artifacts

## Technical Notes

```typescript
interface Artifact {
  id: string
  title: string
  type:
    'Architectural' | 'Ceremonial' | 'Decorative' | 'Musical' | 'Playful' | 'Useable' | 'Wearable'
  thumbnail: string // image path/URL
  media: string[] // supplementary images cycled via the "More Images" control on the detail page
  description: string // factual object history (e.g. "The Mshatta Facade is a richly decorated stone wall from an 8th-century Desert Castle of Jordan...")
  contributor?: {
    name: string // e.g. "Mansoor Alemy"
    quote: string // pull-quote, e.g. "These scenes of creatures drinking water from one fountain together; for me, it shows peace."
    story?: string // personal/migration narrative paragraph shown below the factual description
  }
  audioUrl?: string | null
  audioDurationSeconds?: number // drives the "1:03 / 3:00" style elapsed/total display
  pdfUrl?: string | null
  journey?: {
    country: string // e.g. "Myanmar"
    flag: string // ISO country code for flag icon, e.g. "MM"
  }[] // ordered From → To chain rendered by the migration-journey widget (replaces a lat/lng location model — see Story 5.7)
}
```

## Implementation Tasks

1. Define TypeScript interface for Artifact data model
2. Create mock data file with 8-12 artifacts across 3-4 categories
3. Include all required fields and optional fields
4. Create data utility functions for filtering artifacts
5. Create data utility functions for accessing artifacts by ID
6. Test data layer functions with sample queries

## Dependencies

- Story 1.4: Establish Project Folder Structure

## Blocked By

- Story 1.4: Establish Project Folder Structure

## Blocking

- Story 3.1: Create Artifact Thumbnail Component
- Story 3.2: Build Grid View Layout
- Story 3.3: Build List View Layout
- Story 4.2: Add Category Filter Bar

## Definition of Done

- [x] All acceptance criteria met
- [x] TypeScript types are properly defined
- [x] Data layer is tested and functional
- [x] Code committed to repository
- [x] No TypeScript errors

## Implementation Summary

**Status:** ✅ Done  
**Implementation Date:** 2026-07-11  
**Actual Implementation:**

- Added `src/types/artifact.ts`: `Artifact`, `ArtifactContributor`, `ArtifactJourneyStop` interfaces, plus an `ARTIFACT_TYPES` const tuple that both defines and derives the `ArtifactType` union (`(typeof ARTIFACT_TYPES)[number]`), so adding an 8th category later is a one-line change.
- Added `src/data/mock-data.ts`: `mockArtifacts` array with all 12 real artifacts from the Figma board (Wooden Chest, Vyshyvanka, Carnival Mask, Beaded Gown, Mshatta Façade, Lei Po'o, Tatreez Thobe, Mbira, Minbar, Bamboo Pen, Backgammon Board, Jamdani), each with a unique kebab-case `id`, real-world description/contributor/journey content grounded in each object's actual culture of origin, and every one of the 7 categories represented at least once.
- Added `src/lib/data-utils.ts`: `getAllArtifacts`, `getArtifactById`, `getArtifactsByType` (defaults to the UI-level `"All Objects"` sentinel to mean "no filter" — bridges the AC's "All Objects is UI-level, not a stored category" requirement directly into the filtering API instead of leaving it to page code), and `getArtifactCategories` (returns the `ARTIFACT_CATEGORIES` constant, `["All Objects", ...ARTIFACT_TYPES]`, for the future category filter bar, Story 4.2).
- Every artifact explicitly sets `audioUrl`/`pdfUrl` to a path or `null` (never omitted) for a consistent object shape; 5 artifacts carry `audioUrl` + `audioDurationSeconds`, 4 carry `pdfUrl`, and all 12 carry a `journey` array, `contributor.name`, `contributor.quote`, and `contributor.story`.
- Removed the now-obsolete `src/data/.gitkeep` and `src/types/.gitkeep` placeholders from Story 1.4 now that both directories have real content.
- Verified with an ad-hoc `tsx` script exercising `getAllArtifacts`, `getArtifactById` (hit + miss), `getArtifactsByType` (specific category, default, and the `"All Objects"` sentinel), and `getArtifactCategories` — confirmed 12 unique ids, all 7 categories present, and correct filter counts.
- **Self-review pass** (3 finder angles: correctness, cleanup/efficiency, altitude/conventions) found no correctness bugs, but surfaced two worthwhile tightenings applied before commit: (1) `audioUrl`/`pdfUrl` on `Artifact` were still typed optional (`?`) even though the data always sets them to a path or explicit `null` — dropped the `?` so the compiler enforces the "never omitted" invariant the mock data already relies on; (2) `getArtifactsByType` accepted both `undefined` and the `"All Objects"` string as two spellings of "no filter" — simplified to a single default-parameter form (`type: ArtifactTypeFilter = ALL_OBJECTS_FILTER`) and hoisted the category list to a module-level `ARTIFACT_CATEGORIES` constant instead of rebuilding the array on every `getArtifactCategories()` call.

**Deviation from Technical Notes:** the Technical Notes' interface sketch has `audioUrl?: string | null` / `pdfUrl?: string | null` (optional-and-nullable). Implemented as non-optional (`string | null`, no `?`) instead, since the mock data always sets one or the other explicitly — this is a strict tightening (still permits `null`, just disallows omitting the key) that better matches how the AC describes these fields being used by consuming UI.

**Verification:**

- ✅ TypeScript interface defined for Artifact data model
- ✅ Mock data file created with the 12 real artifacts from the Figma board
- ✅ Data includes all required fields: id, title, type, thumbnail, media, description
- ✅ Category (`type`) values are drawn from the real 7-category set
- ✅ Contributor fields included: `contributor.name` and `contributor.quote`
- ✅ Optional fields included: audioUrl (+ duration), pdfUrl, journey (migration path)
- ✅ Data utility functions for filtering and accessing artifacts
- ✅ Data is easily extensible for additional artifacts
- Verified with `pnpm build` (clean), `pnpm ts:check` (clean), `pnpm lint` (clean), and `pnpm format` (clean on new files)
