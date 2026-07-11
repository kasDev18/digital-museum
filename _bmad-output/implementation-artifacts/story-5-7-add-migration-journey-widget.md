# Story 5.7: Add Migration Journey Widget

**Epic:** Epic 5 - Details Page (Stretch/Optional)  
**Status:** Not Started  
**Priority:** Low (Stretch)  
**Story Points:** 1

## User Story
**As a** visitor  
**I want to** see the countries an artifact (or its contributor) has moved through  
**So that** I understand the object's migration story — the core theme of the exhibition

## Correction
The `location widget.png` Figma export is **not** a lat/lng map pin — it's a horizontal chain of country flag icons connected by arrows, e.g. "From Myanmar → To Sri Lanka → To USA → To Myanmar". This directly reflects the site's tagline ("Objects, Voices and Global Journeys" / "a world shaped by migration") and replaces the generic "location" concept used in an earlier draft of this story.

## Acceptance Criteria
- [ ] Widget renders an ordered chain of flag + country-name steps connected by arrow separators, matching `location widget.png`
- [ ] First step is labeled "From [Country]", subsequent steps "To [Country]"
- [ ] Flags render from the artifact's `journey` array (see Story 1.5 data model)
- [ ] If `journey` data is missing or has fewer than 2 steps, the widget is hidden entirely (no broken partial chain)
- [ ] Widget wraps gracefully on narrow viewports (horizontal scroll or wrap to a second line)
- [ ] Widget is visually integrated with the overall detail-page design

## Technical Notes
- Data shape: `journey: { country: string; flag: string }[]` (ordered), rendered as `From {journey[0]} → To {journey[1]} → To {journey[2]}...`
- Use a flag icon set/library keyed by ISO country code, or simple flag emoji as a lightweight fallback
- No map integration needed — this is a flat, iconographic route strip, not geodata
- Handle missing/short journey data gracefully (hide widget)
- Match Figma design for spacing, arrow glyph, and typography

## Implementation Tasks
1. Create MigrationJourneyWidget component
2. Render ordered From/To flag chain from `artifact.journey`
3. Handle missing/short journey data by hiding the widget
4. Match Figma spacing, arrow glyph, and typography
5. Add responsive wrap/scroll behavior for narrow viewports
6. Test with various journey lengths (0, 1, 2, 3+ steps)

## Dependencies
- Story 5.1: Build Detail Page Layout
- Story 1.5: Create Mock Data Layer (provides `journey` field)

## Blocked By
- Story 5.1: Build Detail Page Layout
- **Epic 1-4 completion required before starting Epic 5**

## Blocking
- Story 5.8: Responsive Polish for Detail Page

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Migration journey widget displays correctly
- [ ] Handles missing/short journey data gracefully
- [ ] Code committed to repository
- [ ] No console errors or warnings

## Note
This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.
