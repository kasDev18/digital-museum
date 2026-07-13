import type { Artifact } from '@/types/artifact'
import { AudioPlayer } from '@/app/detail/components/audio-player'
import { cn } from '@/lib/utils'
import styles from './styles.module.css'

export interface ArtifactStoryProps {
  artifact: Artifact
  /** True while `DetailPageContent` is playing the exit choreography ahead of a "Next story"/"All Objects" navigation — swaps the title's/content's mount-in animations for their exit ones. See `MediaCarousel`'s doc comment for why this is plain state instead of React's `<ViewTransition>`. */
  isExiting?: boolean
}

/**
 * Text column of the Detail page (Story 5.1) — the mock's own separate
 * "story component," a sibling of `MediaCarousel`'s "imgs component"
 * rather than markup inlined alongside it in `DetailPageContent`. Pulled
 * out into its own component so the two halves of the two-column layout
 * are genuinely separate, independently readable pieces, matching the
 * source design's own component boundary.
 *
 * Content order follows this story's own AC precisely: title, a divider,
 * the "Contributed by [Name]" byline, another divider, the italicized
 * pull-quote, the audio player slot (Story 5.3), then the factual
 * description paragraph and the contributor's personal/migration
 * narrative paragraph. The entire contributor block (byline + its
 * divider + quote) is conditionally rendered — `artifact.contributor` is
 * optional on the `Artifact` type specifically so this component doesn't
 * crash for an artifact that never got one, even though all 12 real mock
 * artifacts currently have one (Story 1.5).
 *
 * Deliberately doesn't render `artifact.type` (the category badge the old
 * `DetailPlaceholder` used to show) — this story's fuller, Figma-cross-
 * checked AC list in `EPICS_AND_STORIES.md` enumerates the exact content
 * stack above with no category label in it, matching the captured Mshatta
 * Façade detail mock itself (no visible category chip anywhere on that
 * page) — an intentional fidelity call, not a dropped field.
 *
 * Title and the rest of the content get two independently-timed CSS
 * animations (blur-reveal for the title, slide-from-bottom for the rest,
 * see `styles.module.css`) rather than one animation over the whole
 * component, matching the distinct treatment each gets per the detail
 * mock's own navigation choreography. Driven by plain `@keyframes` on
 * mount plus the `isExiting` prop for the reverse — not React's
 * `<ViewTransition>` — see `MediaCarousel`'s doc comment for why.
 */
export function ArtifactStory({ artifact, isExiting }: ArtifactStoryProps) {
  return (
    <div className={styles.ArtifactStory}>
      <h1
        className={cn(styles.ArtifactStory_title, isExiting && styles.ArtifactStory_title_exiting)}
      >
        {artifact.title}
      </h1>

      <div
        className={cn(
          styles.ArtifactStory_content,
          isExiting && styles.ArtifactStory_content_exiting,
        )}
      >
        <hr className={styles.ArtifactStory_divider} />

        {artifact.contributor && (
          <>
            <div className={styles.ArtifactStory_contributor}>
              <p className={styles.ArtifactStory_contributorLabel}>Contributed by</p>
              <p className={styles.ArtifactStory_contributorName}>{artifact.contributor.name}</p>
            </div>
            <hr className={styles.ArtifactStory_divider} />
            <blockquote className={styles.ArtifactStory_quote}>
              <p>&ldquo;{artifact.contributor.quote}&rdquo;</p>
              {/* Visually redundant with "Contributed by [Name]" right
                  above (matching the mock, which doesn't repeat the name
                  under the quote) — `sr-only` so the quote is still
                  self-contained/attributed for a screen-reader user who
                  navigates by element type straight to this blockquote,
                  without duplicating the name visually. */}
              <cite className="sr-only">{artifact.contributor.name}</cite>
            </blockquote>
          </>
        )}

        <AudioPlayer audioUrl={artifact.audioUrl} durationSeconds={artifact.audioDurationSeconds} />

        <p className={styles.ArtifactStory_description}>{artifact.description}</p>
        {artifact.contributor?.story && (
          <p className={styles.ArtifactStory_description}>{artifact.contributor.story}</p>
        )}
      </div>
    </div>
  )
}
