import { mockArtifacts } from '@/data/mock-data'
import { ARTIFACT_TYPES, type Artifact, type ArtifactType } from '@/types/artifact'

/** UI-level "no filter" value for the category filter bar (Story 4.2) — never stored on an artifact. */
export const ALL_OBJECTS_FILTER = 'All Objects' as const

export type ArtifactTypeFilter = ArtifactType | typeof ALL_OBJECTS_FILTER

/** The filter bar's full category list, in Figma-board order, "All Objects" first. */
export const ARTIFACT_CATEGORIES: ArtifactTypeFilter[] = [ALL_OBJECTS_FILTER, ...ARTIFACT_TYPES]

export function getAllArtifacts(): Artifact[] {
  return mockArtifacts
}

export function getArtifactById(id: string): Artifact | undefined {
  return mockArtifacts.find(artifact => artifact.id === id)
}

/**
 * The Detail page's "Next story" control (Story 5.1) — always the next
 * artifact in the full mock dataset's own order, wrapping back to the
 * first after the last, regardless of any List page category filter the
 * visitor arrived from. Returns `undefined` only if `currentId` itself
 * isn't a real artifact id, which never happens from the Detail page's own
 * route (it already 404s on an unknown id before rendering anything that
 * could call this).
 */
export function getNextArtifact(currentId: string): Artifact | undefined {
  const currentIndex = mockArtifacts.findIndex(artifact => artifact.id === currentId)
  if (currentIndex === -1) return undefined

  return mockArtifacts[(currentIndex + 1) % mockArtifacts.length]
}

/**
 * Filters an arbitrary artifact list by category (Story 4.2). Passing
 * `"All Objects"` (the default) returns `artifacts` unchanged. Takes the
 * array as a parameter — rather than always reading `mockArtifacts` itself
 * — so client components (`ListPageContent`) can re-filter the exact props
 * they were server-rendered with instead of reaching back into this
 * module's own data source.
 */
export function filterArtifactsByType(
  artifacts: Artifact[],
  type: ArtifactTypeFilter = ALL_OBJECTS_FILTER,
): Artifact[] {
  if (type === ALL_OBJECTS_FILTER) {
    return artifacts
  }

  return artifacts.filter(artifact => artifact.type === type)
}
