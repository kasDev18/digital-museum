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
