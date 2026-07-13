import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent, PointerEvent } from 'react'
import { gsap } from '@/lib/gsap-utils'

const DRAG_THRESHOLD_PX = 4

/** iOS `UIScrollView`-style rubber-band constant (bounded mode only — see
 * `UseDragPanOptions.infinite`): the higher this is, the more overshoot
 * tracks the finger 1:1 near the edge; the lower, the more it resists.
 * 0.55 is Apple's own published constant for this formula. */
const RUBBER_BAND_STRENGTH = 0.55
/** However far past the hard bound the pointer travels, the *visible*
 * overshoot asymptotically approaches this many px and never exceeds it
 * (bounded mode only). */
const MAX_OVERSHOOT_PX = 120
/** Below this speed (px/ms) a release doesn't bother with momentum — the
 * drag already came to rest, so an inertia tween would be imperceptible. */
const INERTIA_VELOCITY_THRESHOLD_PX_MS = 0.15
/** Converts release velocity into a projected travel distance, as if that
 * velocity decayed to zero over this many ms of unbounded coasting. */
const INERTIA_PROJECTION_MS = 200
/** If the pointer sat still for longer than this before lifting, treat
 * velocity as zero — otherwise a stale high velocity from before a pause
 * would fling the track on release even though the drag had already stopped. */
const VELOCITY_STALE_MS = 120

export interface UseDragPanOptions {
  /**
   * Called with `true` once a pointer-up follows a real drag (moved past
   * the threshold) — the consumer uses this to suppress the `click` that
   * still fires on release, so panning a row doesn't also trigger
   * navigation to a Detail page.
   */
  onDragEnd?: (didDrag: boolean) => void
  /**
   * Number of real (non-repeated) items in one "set" — only meaningful (and
   * only read) when `infinite` is true, where the row renders several
   * copies of its artifacts back to back (see `ArtifactGridRow`); this is
   * how many of the track's rendered children make up exactly one copy,
   * needed to measure the repeat period (see `getBound`).
   */
  itemsPerSet: number
  /**
   * Selects which of two fundamentally different drag physics this row
   * uses — see this hook's own doc comment for why category-filtered rows
   * (few, sometimes just one or two, real artifacts) use `false` while the
   * unfiltered "All Objects" view uses `true`.
   */
  infinite: boolean
}

/** `(1 - 1 / ((overshoot * strength) / max + 1)) * max` — Apple's own
 * rubber-band easing (from `UIScrollView`'s bounce), used only in bounded
 * mode: overshoot grows quickly at first and flattens out toward `max`, so
 * dragging further past the edge yields diminishing (never zero, never
 * `max`-exceeding) visible movement instead of either a hard stop or
 * unbounded travel. */
function rubberBand(overshoot: number, max: number) {
  return (1 - 1 / ((overshoot * RUBBER_BAND_STRENGTH) / max + 1)) * max
}

/** Wraps `value` into `(-period/2, period/2]` — used only in infinite mode,
 * where the visual position is always equivalent modulo one repeat period
 * since the track's content repeats every `period` px (see
 * `ArtifactGridRow`'s tiled copies). `period <= 0` means the measurement
 * below hasn't found real content yet; returned unchanged rather than
 * dividing by zero. */
function wrapOffset(value: number, period: number) {
  if (period <= 0) return value
  let wrapped = value % period
  if (wrapped > period / 2) wrapped -= period
  else if (wrapped <= -period / 2) wrapped += period
  return wrapped
}

/**
 * Click-and-drag (and touch-swipe, via the same pointer events) panning
 * for one row of `ArtifactGrid`'s oversized canvas — a manually
 * transformed track inside an `overflow: hidden` box, not native
 * `overflow-x` scroll. There's never a scrollbar to hide, and a *centered*
 * track's full range — including its left-hand overflow — stays
 * reachable: a native `overflow-x-auto` container can't reach its own
 * left-hand overflow when its content is centered, since `scrollLeft`
 * can't go negative. That's the reason this replaced native scroll here.
 *
 * The pan offset is written directly to `track.style.transform` during
 * `pointermove` (and during the release-time settle tween below), not
 * through React state — a drag gesture firing dozens of moves a second
 * shouldn't force a React re-render on every one of them. Only
 * `isDragging` (which flips at most twice per drag, not once per pixel)
 * goes through `useState`, to drive the grab/grabbing cursor.
 *
 * Two distinct drag physics live behind the `infinite` option:
 *
 * - **`infinite: true`** (the unfiltered "All Objects" grid) — genuinely
 *   infinite dragging, not just a wide-but-finite canvas, per the brief's
 *   own "drag the grid view across the screen with infinite drag."
 *   `ArtifactGridRow` renders several back-to-back copies of its
 *   artifacts, and this hook tracks an ever-growing/shrinking *logical*
 *   offset (used for all the drag-delta/momentum math below, exactly as
 *   if no bound existed) while only ever writing a *wrapped* value (via
 *   `wrapOffset`) to the track's actual `transform` — since the content
 *   repeats every `period` px, wrapping the visual position is
 *   imperceptible, and the pointer can keep dragging in either direction
 *   forever.
 * - **`infinite: false`** (any category-filtered grid) — the original
 *   Story 4.1 "loose bounds" behavior: a single, real copy of the row's
 *   (possibly very few — sometimes just one or two) artifacts, with
 *   dragging past either hard edge allowed with resistance
 *   (`rubberBand`, capped at `MAX_OVERSHOOT_PX`) and a spring-back to that
 *   edge on release. Tiling a category's artifacts to fill an infinite
 *   canvas would be actively misleading here rather than a "free-roaming
 *   gallery" feeling — a 2-artifact category tiled to fill the screen
 *   reads as an obvious, broken-looking loop ("Mshatta Façade, Minbar,
 *   Mshatta Façade, Minbar, …") rather than a large collection, so
 *   filtered rows get the honest, finite affordance instead.
 *
 * Both modes keep release momentum (Story 4.1's "nice to have" inertia): a
 * fast flick keeps coasting and decelerating via a lightweight tween —
 * with nothing to clamp against in infinite mode, clamped to the bound
 * (and softened to the same spring-back easing as an out-of-bounds
 * release, if it lands exactly on that bound) in bounded mode.
 */
export function useDragPan({ onDragEnd, itemsPerSet, infinite }: UseDragPanOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  // Plain object (not React state) so the settle tween below can animate it
  // with `gsap.to` and write straight into `offsetRef`/the track's transform
  // on every tick, same "skip React re-renders" reasoning as pointermove.
  const tweenTarget = useRef({ x: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef<{
    pointerId: number
    startX: number
    startOffset: number
    moved: boolean
    // Snapshotted once a real drag starts (see onPointerMove) rather than
    // re-measured via `getBoundingClientRect` on every move and again on
    // release — the relevant distance (repeat period in infinite mode,
    // max offset in bounded mode) can't change mid-gesture (see
    // `getBound` below), so re-measuring it dozens of times per second was
    // pure wasted layout work.
    bound: number
    lastMoveTime: number
    lastMoveX: number
    velocity: number
  } | null>(null)

  const getBound = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0

    if (infinite) {
      // The distance between the first item of one tiled copy and the
      // first item of the next is the repeat period — measuring it via
      // the *second* copy's own rendered position (rather than, say, the
      // track's own `scrollWidth`) works regardless of the track's
      // `justify-content: center` centering, for the same reason bounded
      // mode's own measurement below does: a *centered* flex box's own
      // box doesn't grow to reflect symmetric left/right overflow, so
      // measuring the box itself (or its `scrollWidth`) silently
      // under-reports the real content width. `transform` moves every
      // child by the same amount, so this distance stays correct at any
      // current drag offset.
      if (itemsPerSet <= 0) return 0
      const first = track.children.item(0)
      const nextCopyStart = track.children.item(itemsPerSet)
      if (!first || !nextCopyStart) return 0
      return nextCopyStart.getBoundingClientRect().left - first.getBoundingClientRect().left
    }

    const container = containerRef.current
    if (!container) return 0
    const first = track.firstElementChild
    const last = track.lastElementChild
    if (!first || !last) return 0

    // `track.scrollWidth` can't be used here: browsers only extend
    // `scrollWidth` to cover overflow in the forward (right) direction
    // from the track's own box, not the backward (left) overflow a
    // *centered* track also has — measured directly, this under-reports
    // the true content width by roughly half the total overflow, which
    // silently clamped dragging well short of actually revealing the
    // first/last card (caught via Playwright: after dragging as far as
    // this formula allowed, the edge card was still ~260px off-screen on
    // a 5-card row). It's the exact same "can't represent negative
    // scroll" limitation this drag-based approach was built to route
    // around in the first place — just resurfacing here in the bounds
    // math instead of in `scrollLeft` itself.
    //
    // Measuring the first/last child's own rendered position instead
    // works regardless of overflow direction, and stays correct at any
    // current drag offset: `transform` moves every child by the same
    // amount, so the *distance* between the first and last child (unlike
    // their absolute positions) doesn't change as the track is dragged.
    const contentWidth = last.getBoundingClientRect().right - first.getBoundingClientRect().left
    return Math.max(0, (contentWidth - container.clientWidth) / 2)
  }, [infinite, itemsPerSet])

  /** Infinite mode: wraps `value` into the visual transform, storing the
   * unwrapped logical `value` in `offsetRef` so drag-delta math stays
   * simple. Bounded mode: rubber-bands `value` past `bound`/`-bound`
   * rather than hard-clamping (a hard clamp is applied separately in
   * `endDrag` once the gesture ends) and stores that (already-visual)
   * value directly in `offsetRef`. */
  const applyOffset = useCallback(
    (value: number, bound: number) => {
      if (infinite) {
        offsetRef.current = value
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${wrapOffset(value, bound)}px)`
        }
        return
      }

      let next = value
      if (value > bound) {
        next = bound + rubberBand(value - bound, MAX_OVERSHOOT_PX)
      } else if (value < -bound) {
        next = -bound - rubberBand(-bound - value, MAX_OVERSHOOT_PX)
      }

      offsetRef.current = next
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${next}px)`
      }
    },
    [infinite],
  )

  /** Animates the track from wherever it currently sits to `target` —
   * used for release momentum (both modes) and, in bounded mode only, the
   * past-the-edge spring-back. Settles instantly (no tween) under
   * `prefers-reduced-motion`. Not routed through `useGSAP`'s
   * `contextSafe` (this project's usual convention for event-triggered
   * tweens, see `useExitFadeNavigation`): `contextSafe` only defers
   * invoking its wrapped function until it's actually called, but the
   * compiler can't see that through an unrecognized third-party wrapper,
   * and flags this hook's own `useRef`-created refs as being read "during
   * render" as a result. The explicit `killTweensOf` cleanup below covers
   * the same "no leaked tween after unmount" guarantee `contextSafe` would
   * otherwise provide via GSAP's context revert. */
  const settle = useCallback(
    (target: number, bound: number, { duration, ease }: { duration: number; ease: string }) => {
      gsap.killTweensOf(tweenTarget.current)
      tweenTarget.current.x = offsetRef.current
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.to(tweenTarget.current, {
        x: target,
        duration: reduced ? 0 : duration,
        ease,
        onUpdate: () => {
          offsetRef.current = tweenTarget.current.x
          if (trackRef.current) {
            const visual = infinite
              ? wrapOffset(tweenTarget.current.x, bound)
              : tweenTarget.current.x
            trackRef.current.style.transform = `translateX(${visual}px)`
          }
        },
      })
    },
    [infinite],
  )

  useEffect(() => {
    const tween = tweenTarget.current
    return () => {
      gsap.killTweensOf(tween)
    }
  }, [])

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
      bound: 0,
      lastMoveTime: performance.now(),
      lastMoveX: event.clientX,
      velocity: 0,
    }
    // Deliberately *not* capturing the pointer here yet (see onPointerMove)
    // — every plain click starts with a pointerdown too, and capturing
    // immediately would redirect that click's own event target to this
    // container instead of whatever was actually under the cursor (the
    // thumbnail's `<a>`), breaking `useExitFadeNavigation`'s
    // `closest('a[href^="/detail/"]')` lookup for every click, not just
    // drags — verified via a Playwright trace showing the `click` event's
    // target become this row's own `<div>` the moment capture was
    // unconditional.
    //
    // The in-flight spring-back/momentum tween (if any) is likewise left
    // running here, not killed — see onPointerMove for why.
  }, [])

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = drag.current
      if (!state || state.pointerId !== event.pointerId) return

      const dx = event.clientX - state.startX

      // Only commit to "this is a drag" (and only then start moving the
      // track, and only then capture the pointer) once past the
      // threshold — an ordinary click/tap also fires
      // pointerdown+pointermove+pointerup, and shouldn't flash the
      // grabbing cursor, nudge the track, or capture the pointer for a
      // few stray pixels of movement.
      if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD_PX) {
        state.moved = true
        state.bound = getBound()
        // A real drag always wins over any in-flight spring-back/momentum
        // tween from a previous release — killed here, not at
        // `onPointerDown` (before a drag vs. a plain click is even known):
        // killing it unconditionally on every pointerdown would leave a
        // tap that lands mid-tween with no way to finish settling (the
        // tween's dead, and a non-drag pointerup never calls `settle`
        // either), freezing the track wherever the tween happened to be
        // interrupted. Re-anchoring `startOffset` to wherever the track
        // actually is *right now* (not wherever it was at pointerdown)
        // avoids a visible jump if this drag just interrupted a tween that
        // had already moved the track further in the meantime.
        gsap.killTweensOf(tweenTarget.current)
        state.startOffset = offsetRef.current
        setIsDragging(true)
        // Best-effort haptic confirmation that a drag actually engaged
        // (Story 4.5's "touch feedback ... if available" AC) — Android
        // Chrome supports the Vibration API, iOS Safari doesn't define
        // `navigator.vibrate` at all, so this silently no-ops there rather
        // than needing its own feature branch. Wrapped in `try` too: some
        // embedding contexts (e.g. a `Permissions-Policy: vibrate=()`
        // cross-origin iframe) throw instead of no-opping, and this must
        // never block the `setPointerCapture` call right below it.
        try {
          navigator.vibrate?.(8)
        } catch {
          // Best-effort only — a blocked/throwing Vibration API shouldn't
          // interrupt the drag it was just confirming.
        }
        // Captured only now, once a real drag is underway: keeps
        // receiving pointermove/pointerup even if the cursor drifts
        // outside the row's bounds mid-drag. Safe to redirect the
        // eventual click's target at this point — a genuine drag's click
        // is suppressed by the consumer (`onDragEnd(true)`) rather than
        // relied on to hit-test anything.
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      const now = performance.now()
      const dt = now - state.lastMoveTime
      if (dt > 0) {
        // Lightly smoothed (not raw instantaneous) so one jittery event
        // doesn't dominate the velocity used for release momentum.
        const instantVelocity = (event.clientX - state.lastMoveX) / dt
        state.velocity = state.velocity * 0.7 + instantVelocity * 0.3
      }
      state.lastMoveTime = now
      state.lastMoveX = event.clientX

      if (state.moved) {
        applyOffset(state.startOffset + dx, state.bound)
      }
    },
    [applyOffset, getBound],
  )

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = drag.current
      if (!state || state.pointerId !== event.pointerId) return

      drag.current = null
      if (state.moved) setIsDragging(false)
      onDragEnd?.(state.moved)
      if (!state.moved) return

      const current = offsetRef.current
      const velocity =
        performance.now() - state.lastMoveTime > VELOCITY_STALE_MS ? 0 : state.velocity

      if (infinite) {
        // Nothing to clamp against — the track can coast as far as the
        // projected velocity carries it, wrapping seamlessly through the
        // tiled copies the whole way (see `settle`'s `onUpdate`).
        if (Math.abs(velocity) <= INERTIA_VELOCITY_THRESHOLD_PX_MS) return
        const projected = current + velocity * INERTIA_PROJECTION_MS
        settle(projected, state.bound, { duration: 0.6, ease: 'power3.out' })
        return
      }

      const max = state.bound
      const outOfBounds = current > max || current < -max

      if (outOfBounds) {
        settle(Math.min(max, Math.max(-max, current)), max, { duration: 0.45, ease: 'power2.out' })
        return
      }

      if (Math.abs(velocity) > INERTIA_VELOCITY_THRESHOLD_PX_MS) {
        const rawProjected = current + velocity * INERTIA_PROJECTION_MS
        const projected = Math.min(max, Math.max(-max, rawProjected))
        if (projected === current) return

        // A fast flick that lands exactly on the bound uses the same
        // softer spring-back treatment as an out-of-bounds release
        // (above), instead of the punchier momentum ease — otherwise a
        // flick hitting the edge stops abruptly, the exact "hard edge"
        // feel this story's bounds are meant to avoid.
        const hitBound = rawProjected !== projected
        settle(
          projected,
          max,
          hitBound ? { duration: 0.45, ease: 'power2.out' } : { duration: 0.6, ease: 'power3.out' },
        )
      }
    },
    [infinite, onDragEnd, settle],
  )

  const onDragStart = useCallback((event: DragEvent<HTMLDivElement>) => {
    // Blocks the browser's native image/link drag-to-copy gesture, which
    // would otherwise fight with the pointer-based pan above.
    event.preventDefault()
  }, [])

  return {
    containerRef,
    trackRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onDragStart,
  }
}
