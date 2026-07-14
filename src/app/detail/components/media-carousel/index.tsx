'use client'

import { useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, ZoomInIcon, ZoomOutIcon } from '@/components/ui/icons'
import styles from './styles.module.css'

export interface MediaCarouselProps {
  /** Always non-empty in practice — `DetailPageContent` falls back to `[artifact.thumbnail]` before this ever renders an artifact whose own `media` array is empty. */
  media: string[]
  className?: string
  /** True while `DetailPageContent` is playing the exit choreography ahead of a "Next story"/"All Objects" navigation — swaps this frame's mount-in animation for its flip-out one. See that component's own doc comment for why this is plain state instead of React's `<ViewTransition>`. */
  isExiting?: boolean
}

/** Minimum horizontal touch travel (px) before a swipe counts as a slide change, not an incidental tap/scroll jitter. */
const SWIPE_THRESHOLD_PX = 40

/** Story 5.4's zoom range/step — the story's own AC gives "0.5x to 3x" as the example range for these overlay controls. */
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEP = 0.5
const DEFAULT_ZOOM = 1

/**
 * Primary media frame for the Detail page (Story 5.2): a single active
 * slide inside an `overflow: hidden` frame, advanced via a CSS
 * `transform`-driven track (per this story's own Technical Notes) rather
 * than swapping the rendered `<Image>`'s `src` — that keeps the slide
 * change an animatable transform instead of a layout-shifting image swap,
 * and lets a swipe-in-progress preview be added later without restructuring
 * this component.
 *
 * Four independent ways to change slides, per the "isn't a 'More
 * Images'-only interaction on desktop" AC: the "More Images" button
 * (bottom-right, per the detail mock), the dot indicators (click any dot to
 * jump directly — also the current-slide indicator), a left/right
 * `ArrowKey` press while the frame has focus, and a touch swipe. All four
 * wrap around at either end rather than stopping at the first/last image.
 *
 * Single-item media (e.g. the Bamboo Pen's one photo) and the
 * zero-item-after-fallback edge case both render just the image with none
 * of the above controls — advancing to "the next image" is meaningless
 * with nothing to advance to. Story 5.4's zoom in/out overlay is the one
 * exception: it renders regardless of `hasMultiple`, since even a single
 * photo benefits from examining fine detail up close.
 *
 * Zoom (Story 5.4) is a plain CSS `transform: scale(...)` on the *active*
 * slide's image only — applied here rather than on `.MediaCarousel_track`
 * (which drives the shared horizontal slide offset for every slide at
 * once) so scaling one image up never shifts where the others sit. The
 * outer frame's own `overflow-hidden` already clips whatever spills past
 * its bounds, so zooming in just reveals more of the same image within
 * the existing frame rather than requiring any new clipping. Resets to
 * `DEFAULT_ZOOM` on every slide change, per that story's own AC — zooming
 * into one image shouldn't carry over to the next.
 *
 * Flips-while-fading in on mount (`@keyframes` gated behind
 * `prefers-reduced-motion`, same technique as `DetailToolbar`'s border
 * draw) and flips-while-fading out when `isExiting` is set by
 * `DetailPageContent` ahead of a "Next story"/"All Objects" navigation.
 * This is plain CSS + a boolean prop rather than React's
 * `<ViewTransition>` — that API is present in this React/Next version but
 * doesn't actually invoke the browser's View Transitions API here
 * (verified empirically: `document.startViewTransition` never fires, in
 * both dev and a production build), so a real exit animation needs
 * `DetailPageContent` to hold the exit off navigating until the CSS
 * animation below finishes.
 */
export function MediaCarousel({ media, className, isExiting }: MediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  // Tracks which slide indices 404ed/failed to load, so a missing media
  // asset (the mock dataset's `media` images beyond each artifact's own
  // `thumbnail.jpg` aren't backed by real files yet — see `deferred-work.md`)
  // degrades to the frame's plain `bg-background-elevated` backdrop instead
  // of the browser's broken-image icon, same "hide on error" convention
  // `ArtifactThumbnail` already uses for its own thumbnail image.
  const [erroredIndices, setErroredIndices] = useState<ReadonlySet<number>>(new Set())
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  // Tracks the slide index zoom was last reset for — compared against the
  // current `index` during render (React's own recommended pattern for
  // "reset state when a prop/value changes", see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // rather than a `useEffect`, which would commit the stale-zoom frame
  // first and only reset one render later.
  const [zoomResetForIndex, setZoomResetForIndex] = useState(index)

  const hasMultiple = media.length > 1

  // Slide change (any of the four navigation paths below) always resets
  // zoom — per Story 5.4's own AC — rather than only the explicit
  // "More Images"/dot/arrow handlers each remembering to do it.
  if (index !== zoomResetForIndex) {
    setZoomResetForIndex(index)
    setZoom(DEFAULT_ZOOM)
  }

  const zoomIn = () =>
    setZoom(current => Math.min(MAX_ZOOM, Math.round((current + ZOOM_STEP) * 100) / 100))
  const zoomOut = () =>
    setZoom(current => Math.max(MIN_ZOOM, Math.round((current - ZOOM_STEP) * 100) / 100))

  // Plain functions, not `useCallback` — nothing downstream is memoized
  // against their identity, so wrapping them would only add hooks with no
  // benefit. `goToNext`/`goToPrev` use the functional `setIndex` form so
  // they never read `index` from a closure (no stale-value risk if a
  // render is skipped/batched); `goTo` doesn't depend on the current index
  // at all, since every caller (dots) already passes an absolute target.
  const goTo = (target: number) => setIndex(((target % media.length) + media.length) % media.length)
  const goToNext = () => setIndex(current => (current + 1) % media.length)
  const goToPrev = () => setIndex(current => (current - 1 + media.length) % media.length)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrev()
    }
  }

  // Ignores touches that start on the "More Images"/dot buttons — those
  // are real descendants of this container (so their touchstart/touchend
  // also bubble up here), and without this guard a tap that drifts more
  // than SWIPE_THRESHOLD_PX while landing on a button would both fire the
  // button's own onClick *and* register as a swipe, advancing two slides
  // for what the visitor experienced as one tap.
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current
    touchStartX.current = null
    if (startX === null || !hasMultiple) return

    const delta = event.changedTouches[0].clientX - startX
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return

    if (delta < 0) goToNext()
    else goToPrev()
  }

  if (media.length === 0) return null

  return (
    <div
      className={cn(styles.MediaCarousel, isExiting && styles.MediaCarousel_exiting, className)}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Artifact images"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.MediaCarousel_track}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {media.map((src, i) => (
          <div key={src} className={styles.MediaCarousel_slide} aria-hidden={i !== index}>
            {!erroredIndices.has(i) && (
              <Image
                src={src}
                // Decorative: the title heading beside this frame already
                // gives it a text description, same convention as
                // ArtifactThumbnail's own `alt=""` (Story 3.1).
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={styles.MediaCarousel_image}
                style={i === index ? { transform: `scale(${zoom})` } : undefined}
                onError={() => setErroredIndices(prev => new Set(prev).add(i))}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.MediaCarousel_zoom}>
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className={styles.MediaCarousel_zoomButton}
        >
          <ZoomOutIcon className={styles.MediaCarousel_zoomIcon} />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className={styles.MediaCarousel_zoomButton}
        >
          <ZoomInIcon className={styles.MediaCarousel_zoomIcon} />
        </button>
      </div>

      {hasMultiple && (
        <>
          <button type="button" onClick={goToNext} className={styles.MediaCarousel_more}>
            More Images
            <ChevronDownIcon className={styles.MediaCarousel_moreIcon} />
          </button>

          <div className={styles.MediaCarousel_dots} role="tablist" aria-label="Image slides">
            {media.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to image ${i + 1} of ${media.length}`}
                onClick={() => goTo(i)}
                className={cn(
                  styles.MediaCarousel_dot,
                  i === index && styles.MediaCarousel_dotActive,
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
