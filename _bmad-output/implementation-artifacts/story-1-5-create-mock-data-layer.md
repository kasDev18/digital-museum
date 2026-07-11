# Story 1.5: Create Mock Data Layer

**Epic:** Epic 1 - Project Setup  
**Status:** Not Started  
**Priority:** High  
**Story Points:** 3

## User Story
**As a** developer  
**I want to** create a JSON-based mock data structure for artifacts  
**So that** content is data-driven and easily maintainable across pages

## Acceptance Criteria
- [ ] TypeScript interface defined for Artifact data model
- [ ] Mock data file created with 8-12 artifacts across 3-4 categories
- [ ] Data includes all required fields: id, title, type, thumbnail, media, description
- [ ] Optional fields included: audioUrl, pdfUrl, location
- [ ] Data utility functions for filtering and accessing artifacts
- [ ] Data is easily extensible for additional artifacts

## Technical Notes
```typescript
interface Artifact {
  id: string;
  title: string;
  type: string; // category for filtering
  thumbnail: string; // image path/URL
  media: string[]; // array of media for detail carousel
  description: string;
  audioUrl?: string | null;
  pdfUrl?: string | null;
  location?: {
    label: string;
    lat: number;
    lng: number;
  };
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
