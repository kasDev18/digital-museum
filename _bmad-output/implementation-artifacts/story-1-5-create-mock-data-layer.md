# Story 1.5: Create Mock Data Layer

**Epic:** Epic 1 - Project Setup  
**Status:** Ready for Dev  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** developer  
**I want to** create a JSON-based mock data structure for artifacts  
**So that** content is data-driven and easily maintainable across pages

## Acceptance Criteria
- [ ] TypeScript interface defined for Artifact data model
- [ ] Mock data file created with the 12 real artifacts from the Figma board: Wooden Chest, Vyshyvanka, Carnival Mask, Beaded Gown, Mshatta Façade, Lei Po'o, Tatreez Thobe, Mbira, Minbar, Bamboo Pen, Backgammon Board, Jamdani
- [ ] Data includes all required fields: id, title, type, thumbnail, media, description
- [ ] Category (`type`) values are drawn from the real 7-category set: Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable (with "All Objects" handled as a UI-level "no filter" state, not a stored category)
- [ ] Contributor fields included: `contributor.name` and `contributor.quote`, matching the "Contributed by [Name]" byline and pull-quote seen on the detail mock (e.g. Mshatta Façade / Mansoor Alemy)
- [ ] Optional fields included: audioUrl (+ duration), pdfUrl, journey (migration path)
- [ ] Data utility functions for filtering and accessing artifacts
- [ ] Data is easily extensible for additional artifacts

## Technical Notes
```typescript
interface Artifact {
  id: string;
  title: string;
  type: 'Architectural' | 'Ceremonial' | 'Decorative' | 'Musical' | 'Playful' | 'Useable' | 'Wearable';
  thumbnail: string; // image path/URL
  media: string[]; // supplementary images cycled via the "More Images" control on the detail page
  description: string; // factual object history (e.g. "The Mshatta Facade is a richly decorated stone wall from an 8th-century Desert Castle of Jordan...")
  contributor?: {
    name: string; // e.g. "Mansoor Alemy"
    quote: string; // pull-quote, e.g. "These scenes of creatures drinking water from one fountain together; for me, it shows peace."
    story?: string; // personal/migration narrative paragraph shown below the factual description
  };
  audioUrl?: string | null;
  audioDurationSeconds?: number; // drives the "1:03 / 3:00" style elapsed/total display
  pdfUrl?: string | null;
  journey?: {
    country: string; // e.g. "Myanmar"
    flag: string; // ISO country code for flag icon, e.g. "MM"
  }[]; // ordered From → To chain rendered by the migration-journey widget (replaces a lat/lng location model — see Story 5.7)
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
- [ ] All acceptance criteria met
- [ ] TypeScript types are properly defined
- [ ] Data layer is tested and functional
- [ ] Code committed to repository
- [ ] No TypeScript errors

## Implementation Summary
**Status:** ❌ Not Started  
**Implementation Date:** N/A  
**Actual Implementation:**
- No mock data layer exists
- No TypeScript interfaces defined for Artifact data model
- No data utility functions created
- No mock data file with artifacts

**Verification:**
- ❌ TypeScript interface defined for Artifact data model
- ❌ Mock data file created with the 12 real artifacts from the Figma board
- ❌ Data includes all required fields: id, title, type, thumbnail, media, description
- ❌ Category (`type`) values are drawn from the real 7-category set
- ❌ Contributor fields included: `contributor.name` and `contributor.quote`
- ❌ Optional fields included: audioUrl (+ duration), pdfUrl, journey (migration path)
- ❌ Data utility functions for filtering and accessing artifacts
- ❌ Data is easily extensible for additional artifacts
