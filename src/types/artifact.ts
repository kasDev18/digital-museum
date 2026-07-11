/**
 * The 7 real Figma-board categories. "All Objects" is a UI-level "no filter"
 * state (see `getArtifactsByType` in `lib/data-utils.ts`) and is intentionally
 * not part of this set — it is never a value stored on an artifact.
 */
export const ARTIFACT_TYPES = [
  'Architectural',
  'Ceremonial',
  'Decorative',
  'Musical',
  'Playful',
  'Useable',
  'Wearable',
] as const

export type ArtifactType = (typeof ARTIFACT_TYPES)[number]

export interface ArtifactContributor {
  name: string // e.g. "Mansoor Alemy"
  quote: string // pull-quote, e.g. "These scenes of creatures drinking water from one fountain together; for me, it shows peace."
  story?: string // personal/migration narrative paragraph shown below the factual description
}

export interface ArtifactJourneyStop {
  country: string // e.g. "Myanmar"
  flag: string // ISO 3166-1 alpha-2 country code for flag icon, e.g. "MM"
}

export interface Artifact {
  id: string
  title: string
  type: ArtifactType
  thumbnail: string // image path/URL
  media: string[] // supplementary images cycled via the "More Images" control on the detail page
  description: string // factual object history
  contributor?: ArtifactContributor
  audioUrl: string | null // never omitted — explicit `null` means "no audio", so UI can check it directly without an `in` guard
  audioDurationSeconds?: number // drives the "1:03 / 3:00" style elapsed/total display; only set when audioUrl is non-null
  pdfUrl: string | null // never omitted — same "always present" convention as audioUrl
  journey?: ArtifactJourneyStop[] // ordered From → To chain rendered by the migration-journey widget
}
