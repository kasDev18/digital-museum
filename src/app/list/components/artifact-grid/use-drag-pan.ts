import { useCallback, useRef, useState } from 'react'
import type { DragEvent, PointerEvent } from 'react'

const DRAG_THRESHOLD_PX = 4

export interface UseDragPanOptions {
  /**
   * Called with `true` once a pointer-up follows a real drag (moved past
   * the threshold) — the consumer uses this to suppress the `click` that
   * still fires on release, so panning a row doesn't also trigger
   * navigation to a Detail page.
   */
  onDragEnd?: (didDrag: boolean) => void
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
 * `pointermove`, not through React state — a drag gesture firing dozens
 * of moves a second shouldn't force a React re-render on every one of
 * them. Only `isDragging` (which flips at most twice per drag, not once
 * per pixel) goes through `useState`, to drive the grab/grabbing cursor.
 */
export function useDragPan({ onDragEnd }: UseDragPanOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef<{
    pointerId: number
    startX: number
    startOffset: number
    moved: boolean
  } | null>(null)

  const clamp = useCallback((value: number) => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return value

    const first = track.firstElementChild
    const last = track.lastElementChild
    if (!first || !last) return value

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
    const max = Math.max(0, (contentWidth - container.clientWidth) / 2)
    return Math.min(max, Math.max(-max, value))
  }, [])

  const applyOffset = useCallback(
    (value: number) => {
      const next = clamp(value)
      offsetRef.current = next
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${next}px)`
      }
    },
    [clamp],
  )

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
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
        setIsDragging(true)
        // Captured only now, once a real drag is underway: keeps
        // receiving pointermove/pointerup even if the cursor drifts
        // outside the row's bounds mid-drag. Safe to redirect the
        // eventual click's target at this point — a genuine drag's click
        // is suppressed by the consumer (`onDragEnd(true)`) rather than
        // relied on to hit-test anything.
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      if (state.moved) {
        applyOffset(state.startOffset + dx)
      }
    },
    [applyOffset],
  )

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = drag.current
      if (!state || state.pointerId !== event.pointerId) return

      drag.current = null
      if (state.moved) setIsDragging(false)
      onDragEnd?.(state.moved)
    },
    [onDragEnd],
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
