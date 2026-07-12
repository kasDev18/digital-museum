import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent, PointerEvent } from 'react'
import { gsap } from '@/lib/gsap-utils'

const DRAG_THRESHOLD_PX = 4

/** iOS `UIScrollView`-style rubber-band constant: the higher this is, the
 * more overshoot tracks the finger 1:1 near the edge; the lower, the more
 * it resists. 0.55 is Apple's own published constant for this formula. */
const RUBBER_BAND_STRENGTH = 0.55
/** However far past the hard bound the pointer travels, the *visible*
 * overshoot asymptotically approaches this many px and never exceeds it. */
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
}

/** `(1 - 1 / ((overshoot * strength) / max + 1)) * max` — Apple's own
 * rubber-band easing (from `UIScrollView`'s bounce): overshoot grows
 * quickly at first and flattens out toward `max`, so dragging further past
 * the edge yields diminishing (never zero, never `max`-exceeding) visible
 * movement instead of either a hard stop or unbounded travel. */
function rubberBand(overshoot: number, max: number) {
  return (1 - 1 / ((overshoot * RUBBER_BAND_STRENGTH) / max + 1)) * max
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
 * Two behaviors happen once the pointer lifts, both satisfying Story 4.1's
 * "loose bounds, no hard edges that abruptly stop" acceptance criterion:
 * a drag that overshoots past the track's hard bound (allowed, with
 * resistance, via `rubberBand` above) springs back to that bound; a drag
 * released while still moving fast, but within bounds, keeps coasting
 * (decelerating) via a lightweight momentum tween instead of stopping dead.
 */
export function useDragPan({ onDragEnd }: UseDragPanOptions = {}) {
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
    // release — the distance between the track's first/last child can't
    // change mid-gesture (see `getMaxOffset` below), so re-measuring it
    // dozens of times per second was pure wasted layout work.
    maxOffset: number
    lastMoveTime: number
    lastMoveX: number
    velocity: number
  } | null>(null)

  const getMaxOffset = useCallback(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return 0

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
  }, [])

  /** Rubber-bands `value` past `max`/`-max` rather than hard-clamping —
   * always, since the sole caller (`onPointerMove`, mid-drag) always wants
   * the loose-bounds feel; a hard clamp is applied separately in `endDrag`
   * once the gesture ends. */
  const applyOffset = useCallback((value: number, max: number) => {
    let next = value
    if (value > max) {
      next = max + rubberBand(value - max, MAX_OVERSHOOT_PX)
    } else if (value < -max) {
      const overshoot = -max - value
      next = -max - rubberBand(overshoot, MAX_OVERSHOOT_PX)
    }

    offsetRef.current = next
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${next}px)`
    }
  }, [])

  /** Animates the track from wherever it currently sits to `target` —
   * used both for the past-the-edge spring-back and for release momentum.
   * Settles instantly (no tween) under `prefers-reduced-motion`. Not routed
   * through `useGSAP`'s `contextSafe` (this project's usual convention for
   * event-triggered tweens, see `useExitFadeNavigation`): `contextSafe` only
   * defers invoking its wrapped function until it's actually called, but
   * the compiler can't see that through an unrecognized third-party
   * wrapper, and flags this hook's own `useRef`-created refs as being read
   * "during render" as a result. The explicit `killTweensOf` cleanup below
   * covers the same "no leaked tween after unmount" guarantee `contextSafe`
   * would otherwise provide via GSAP's context revert. */
  const settle = useCallback(
    (target: number, { duration, ease }: { duration: number; ease: string }) => {
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
            trackRef.current.style.transform = `translateX(${tweenTarget.current.x}px)`
          }
        },
      })
    },
    [],
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
      maxOffset: 0,
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
        state.maxOffset = getMaxOffset()
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
        applyOffset(state.startOffset + dx, state.maxOffset)
      }
    },
    [applyOffset, getMaxOffset],
  )

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = drag.current
      if (!state || state.pointerId !== event.pointerId) return

      drag.current = null
      if (state.moved) setIsDragging(false)
      onDragEnd?.(state.moved)
      if (!state.moved) return

      const max = state.maxOffset
      const current = offsetRef.current
      const outOfBounds = current > max || current < -max
      const velocity =
        performance.now() - state.lastMoveTime > VELOCITY_STALE_MS ? 0 : state.velocity

      if (outOfBounds) {
        settle(Math.min(max, Math.max(-max, current)), { duration: 0.45, ease: 'power2.out' })
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
          hitBound ? { duration: 0.45, ease: 'power2.out' } : { duration: 0.6, ease: 'power3.out' },
        )
      }
    },
    [onDragEnd, settle],
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
