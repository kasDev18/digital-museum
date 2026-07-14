'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Artifact } from '@/types/artifact'
import { ArtifactStory } from '@/app/detail/components/artifact-story'
import { DetailToolbar } from '@/app/detail/components/detail-toolbar'
import { MediaCarousel } from '@/app/detail/components/media-carousel'
import styles from './styles.module.css'

export interface DetailPageContentProps {
  artifact: Artifact
  /** Id of the next artifact in the mock dataset's own order (`getNextArtifact`), fed to `DetailToolbar`'s "Next story" link. */
  nextArtifactId: string
}

/**
 * How long the exit choreography plays before the route actually changes
 * — must be >= the longest individual exit animation below (`MediaCarousel`'s
 * 0.7s flip-out is the longest) so nothing gets cut off mid-animation.
 */
const EXIT_ANIMATION_MS = 720

/**
 * Detail page layout (Story 5.1): a two-column desktop layout — media left
 * (`MediaCarousel`, Story 5.2), story text right (`ArtifactStory`) —
 * stacking to media-above-text on mobile via a single-column grid below
 * the `lg` breakpoint, matching the Mshatta Façade detail mock.
 * Supersedes Story 3.5's `DetailPlaceholder` stopgap (that component's own
 * doc comment anticipated exactly this replacement) now that Epic 1-4's
 * required scope is complete and this stretch epic's layout story is in
 * progress.
 *
 * The two columns are genuinely separate components — `MediaCarousel` and
 * `ArtifactStory` — matching the source design's own "imgs component" /
 * "story component" split, rather than one inlined next to the other in
 * this file. This component's own job is just laying the two out side by
 * side (or stacked) and owning the artifact-to-`media`-array fallback
 * below.
 *
 * A client component now (not a Server Component, as this story
 * originally anticipated) because it owns the exit-choreography state
 * for "Next story"/"All Objects" navigation: `DetailToolbar`'s links are
 * intercepted via `onNavigate` below, which flips `isExiting` to `true`
 * (playing `MediaCarousel`/`ArtifactStory`'s exit animations for either
 * link) and only calls `router.push` once those animations finish. This
 * is the lowest common ancestor of all three pieces that need to share
 * that state, so it's the right place for `'use client'` to start, per
 * this project's "push `'use client'` as far down as the interactive
 * state actually requires" convention (see `ListPageContent`'s own doc
 * comment) — it was originally lower (nowhere) before this animation
 * requirement existed.
 *
 * `isLeavingDetails` is a second, narrower flag fed only to
 * `DetailToolbar`'s own `isExiting` prop: it's `true` only for "All
 * Objects" (genuinely leaving the Detail page), not "Next story" (the
 * bar itself doesn't change across that hop — see `DetailToolbar`'s own
 * doc comment for why its exit is scoped this way while
 * `MediaCarousel`/`ArtifactStory`'s isn't).
 *
 * Reaches for a plain `setTimeout`-delayed `router.push` rather than
 * React's `<ViewTransition>` — that API exists in this React/Next
 * version but doesn't actually invoke the browser's View Transitions API
 * here (verified empirically with a `document.startViewTransition`
 * monkey-patch that never fired, in both dev and a production build), so
 * a real exit animation needs this manual hold-then-navigate instead.
 * Skips the delay entirely under `prefers-reduced-motion: reduce`, since
 * `MediaCarousel`/`ArtifactStory` don't play the (would-be invisible)
 * animation in that case either.
 */
export function DetailPageContent({ artifact, nextArtifactId }: DetailPageContentProps) {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const [isLeavingDetails, setIsLeavingDetails] = useState(false)

  // Falls back to the thumbnail as a single-item "carousel" for the
  // theoretical case of an artifact whose own `media` array is empty —
  // `MediaCarousel` itself also guards against an empty array (returns
  // `null`), so this is belt-and-suspenders rather than the only guard.
  const media = artifact.media.length > 0 ? artifact.media : [artifact.thumbnail]

  const handleNavigate = (href: string, isNextStory: boolean) => {
    if (isExiting) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      router.push(href)
      return
    }

    setIsExiting(true)
    if (!isNextStory) setIsLeavingDetails(true)
    window.setTimeout(() => router.push(href), EXIT_ANIMATION_MS)
  }

  return (
    <main className={styles.DetailPage}>
      <DetailToolbar
        backHref="/list"
        nextHref={`/detail/${nextArtifactId}`}
        onNavigate={handleNavigate}
        isExiting={isLeavingDetails}
      />

      <div className={styles.DetailPage_layout}>
        <MediaCarousel media={media} isExiting={isExiting} />
        <ArtifactStory artifact={artifact} isExiting={isExiting} />
      </div>
    </main>
  )
}
