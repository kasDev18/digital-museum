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

/** Filters by category. Passing `"All Objects"` (the default) returns every artifact. */
export function getArtifactsByType(type: ArtifactTypeFilter = ALL_OBJECTS_FILTER): Artifact[] {
  if (type === ALL_OBJECTS_FILTER) {
    return mockArtifacts
  }

  return mockArtifacts.filter(artifact => artifact.type === type)
}

/** The filter bar's full category list, in Figma-board order, "All Objects" first. */
export function getArtifactCategories(): ArtifactTypeFilter[] {
  return ARTIFACT_CATEGORIES
}
