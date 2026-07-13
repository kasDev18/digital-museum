'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { BackArrowIcon, ExploreStoryArrowIcon } from '@/components/ui/icons'
import styles from './styles.module.css'

/**
 * One-shot `sessionStorage` marker set by the "Next story" click below,
 * read (and immediately cleared) by the next `DetailToolbar` mount so it
 * can skip its own entrance animation for that specific hop — "going to
 * details" (from `/list`, a direct URL, or browser back/forward) still
 * plays it. Plain `sessionStorage` rather than a prop/context because
 * this bar fully remounts as a brand-new component instance on every
 * navigation (confirmed empirically, no shared-layout persistence), so
 * nothing in this component's own tree can carry the "how did I get
 * here" answer across that remount other than storage.
 *
 * Stores a timestamp, not just `'1'` — if the click's own navigation
 * never actually completes (e.g. the visitor types a different URL
 * during the exit hold, abandoning this one mid-flight), no future
 * `DetailToolbar` mount ever reads and clears the flag, so it would
 * otherwise sit in `sessionStorage` for the rest of the tab session and
 * wrongly suppress some unrelated later visit's entrance. Honoring it
 * only within `SKIP_ENTRANCE_MAX_AGE_MS` makes that self-healing.
 */
const SKIP_ENTRANCE_KEY = 'detail-toolbar-skip-entrance'
const SKIP_ENTRANCE_MAX_AGE_MS = 3000

export interface DetailToolbarProps {
  /**
   * Always `/list` — a plain link, not a query-param round trip. The List
   * page already restores its own `viewMode`/`category` from
   * `sessionStorage` on mount (Story 4.4), which covers this story's own
   * "back navigation preserves previous filter/view mode" AC for free: a
   * Detail page visit is exactly the "full unmount and remount" case that
   * mechanism was built for.
   */
  backHref: string
  /** `/detail/[id]` of the next artifact in the mock dataset's own order (see `getNextArtifact`, Story 5.1's "Next story" AC). */
  nextHref: string
  /** Intercepts both links' navigation so `DetailPageContent` can play its exit choreography before actually pushing the route. `isNextStory` lets it tell the two apart — see `isExiting` below. */
  onNavigate: (href: string, isNextStory: boolean) => void
  /**
   * True only while actually leaving the Detail page (via "All Objects"),
   * not while hopping to another artifact via "Next story" — this bar
   * doesn't visually change across that hop (same reasoning as
   * `SKIP_ENTRANCE_KEY` above), so its own exit stays reserved for the
   * "genuinely leaving" case. `MediaCarousel`/`ArtifactStory` still get a
   * broader `isExiting` from `DetailPageContent` that's `true` for both
   * links, since their content DOES change on a "Next story" hop.
   */
  isExiting?: boolean
}

/**
 * Detail page top bar (Story 5.1): "All Objects" back-link (left, plain
 * muted text) and "Next story" (right, the mock's own filled cream/light
 * pill button) — sequential browsing without a round trip through the
 * List page for every artifact.
 *
 * A client component (not a Server Component like the rest of this story
 * anticipated) because both links now go through `onNavigate` instead of
 * a plain `<Link>` click — `DetailPageContent` needs to run its exit
 * animation before the route actually changes, which means intercepting
 * the click. Still renders real `<Link>`s (so hover/viewport prefetch
 * keeps working) with `preventDefault` + `onNavigate` layered on top.
 *
 * Entrance animation (top/bottom border draws in from each edge toward
 * the center, mirroring `SiteFooter`'s own border reveal, then the two
 * links fade in once it settles) is plain CSS `@keyframes` gated behind
 * `prefers-reduced-motion`, not JS/`data-revealed` state like
 * `SiteFooter` — that state only exists there to wait for the landing
 * hero's GSAP timeline. Here the animation can just auto-play on mount:
 * the App Router fully remounts this component on every `/detail/[id]`
 * navigation (confirmed empirically, no shared-layout persistence), so
 * a CSS `animation` replays for free every time — except specifically
 * after a "Next story" click, which sets `SKIP_ENTRANCE_KEY` so the next
 * bar's mount renders already-settled instead of replaying the reveal
 * (this bar itself doesn't move/change across that hop, only the media/
 * story below it do, so re-playing its own entrance there read as
 * unnecessary flicker rather than an arrival).
 *
 * Exit (`isExiting`) is the literal reverse: the links fade out and the
 * border retreats back toward the edges it drew in from, both playing
 * concurrently rather than the entrance's sequenced "border settles,
 * then links catch up" — exits read better snappy/simultaneous than
 * arrivals do, same asymmetry `MediaCarousel`/`ArtifactStory` already
 * use (slower ease-out entrance, quicker ease-in exit). Only plays for
 * "All Objects," not "Next story" — see the prop's own doc comment.
 */
export function DetailToolbar({ backHref, nextHref, onNavigate, isExiting }: DetailToolbarProps) {
  const [skipEntrance] = useState(() => {
    if (typeof window === 'undefined') return false
    const setAt = Number(window.sessionStorage.getItem(SKIP_ENTRANCE_KEY))
    return Number.isFinite(setAt) && Date.now() - setAt < SKIP_ENTRANCE_MAX_AGE_MS
  })

  // Cleared unconditionally on mount (not just when `skipEntrance` came
  // back `true`) — whatever this mount read is all it'll ever read, and
  // an abandoned "Next story" click's now-stale flag (see above) needs
  // removing too, not just ignoring, so it can't also affect whatever
  // mounts after this one.
  useEffect(() => {
    window.sessionStorage.removeItem(SKIP_ENTRANCE_KEY)
  }, [])

  const handleClick = (href: string, isNextStory: boolean) => (event: MouseEvent) => {
    // Only intercept plain left-clicks — a modified click (cmd/ctrl/shift/
    // middle-click, "open in new tab" etc.) should behave like a normal
    // link, not get held back for an animation that a new tab never sees.
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (isNextStory) window.sessionStorage.setItem(SKIP_ENTRANCE_KEY, String(Date.now()))
    onNavigate(href, isNextStory)
  }

  return (
    <nav
      aria-label="Artifact navigation"
      className={styles.DetailToolbar}
      data-skip-entrance={skipEntrance ? 'true' : undefined}
      data-exiting={isExiting ? 'true' : undefined}
    >
      <span className={styles.DetailToolbar_borderTopLeft} aria-hidden="true" />
      <span className={styles.DetailToolbar_borderTopRight} aria-hidden="true" />
      <span className={styles.DetailToolbar_borderBottomLeft} aria-hidden="true" />
      <span className={styles.DetailToolbar_borderBottomRight} aria-hidden="true" />
      <Link
        href={backHref}
        onClick={handleClick(backHref, false)}
        className={styles.DetailToolbar_link}
      >
        <BackArrowIcon className={styles.DetailToolbar_icon} />
        All Objects
      </Link>
      <Link
        href={nextHref}
        onClick={handleClick(nextHref, true)}
        className={styles.DetailToolbar_next}
      >
        Next story
        <ExploreStoryArrowIcon className={styles.DetailToolbar_icon} />
      </Link>
    </nav>
  )
}
