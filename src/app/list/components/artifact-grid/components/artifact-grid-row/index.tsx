'use client'

import { useCallback, useState } from 'react'
import type { PointerEvent } from 'react'
import type { Artifact } from '@/types/artifact'
import { ArtifactThumbnail } from '@/app/list/components/artifact-thumbnail'
import { cn } from '@/lib/utils'
import { useDragPan } from '../../use-drag-pan'
import { DragBadge } from '../drag-badge'
import styles from './styles.module.css'

export interface ArtifactGridRowProps {
  artifacts: Artifact[]
  isFirstRow?: boolean
  isLastRow?: boolean
  /**
   * Whether this row drags with genuinely infinite wrap-around content
   * (the unfiltered "All Objects" grid) or the original Story 4.1
   * loose-bounds-with-rubber-band behavior over a single, real copy of
   * `artifacts` (any category filter) — see `useDragPan`'s doc comment for
   * why a filtered row (sometimes just one or two real artifacts) doesn't
   * get tiled: repeating a couple of items to fill the screen reads as an
   * obvious, broken-looking loop rather than a large collection.
   */
  infinite: boolean
  onDragEnd?: (didDrag: boolean) => void
}

/**
 * How many back-to-back copies of the row's own artifacts to tile in the
 * track when `infinite` is true (see `useDragPan`'s doc comment). Odd, so
 * a single well-defined *middle* copy exists — with `justify-content:
 * center` on the track, tiling `N` identical-width copies puts that middle
 * copy's own center exactly at the flattened row's geometric center, so
 * it's the one visible at rest (offset 0), pixel-identical to this row
 * before tiling existed. Sized generously enough that even a very wide
 * viewport (multi-monitor/ultrawide spans up to roughly 8000px, well past
 * any single real display) never scrolls past the last rendered copy into
 * empty space, for the row with the *fewest* items (and so the narrowest,
 * most quickly-exhausted period) — this is what actually resolves the
 * ultrawide-monitor gap previously logged in `deferred-work.md`.
 */
const TILE_COUNT = 7
const CENTER_TILE_INDEX = Math.floor(TILE_COUNT / 2)

/**
 * One row of the Grid view's oversized canvas (Story 3.2): a
 * click-and-drag pannable strip (mouse "grab", touch swipe — both via
 * `useDragPan`'s pointer events) rather than a native `overflow-x` scroll
 * container, so there's no scrollbar to hide (there's no native scroll at
 * all) and the track can be centered by default without losing reach to
 * its own left-hand overflow.
 *
 * When `infinite` is true, the track renders `TILE_COUNT` copies of
 * `artifacts`, not just one — see `useDragPan` for the infinite-wrap
 * mechanics this enables. Only the `CENTER_TILE_INDEX` copy is a "real,"
 * keyboard/screen-reader-reachable set of links; every other copy is
 * marked `decorative` on `ArtifactThumbnail` (`aria-hidden` + removed from
 * the tab order) so Tab/AT users still encounter exactly one link per
 * artifact regardless of how many times it's tiled, while every copy
 * stays fully mouse/touch clickable. Only the center copy also gets the
 * `artifact-reveal` class — the other copies' "entrance" is dragging them
 * into view, not scrolling, so they render at their normal,
 * always-visible state immediately rather than needlessly running (and
 * being tracked by) `useScrollReveal` seven times over for content that's
 * mostly off-screen horizontally anyway. When `infinite` is false, exactly
 * one real, fully-accessible copy renders — no tiling, no `decorative`
 * marking — matching this row's original, pre-tiling behavior.
 */
export function ArtifactGridRow({
  artifacts,
  isFirstRow,
  isLastRow,
  infinite,
  onDragEnd,
}: ArtifactGridRowProps) {
  const {
    containerRef,
    trackRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onDragStart,
  } = useDragPan({ onDragEnd, itemsPerSet: artifacts.length, infinite })

  // Cursor-following `DragBadge` position, relative to this row's own
  // container — `null` whenever the badge shouldn't render at all (touch
  // input, or the pointer isn't currently over this row).
  const [badgePos, setBadgePos] = useState<{ x: number; y: number } | null>(null)

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerMove(event)
      // Mouse/pen only — there's no hover concept on touch, and Story
      // 4.5's own touch feedback (dimming + haptic) already covers that
      // input mode, so a cursor-following badge would have nowhere
      // meaningful to follow.
      if (event.pointerType === 'mouse') {
        const rect = event.currentTarget.getBoundingClientRect()
        setBadgePos({ x: event.clientX - rect.left, y: event.clientY - rect.top })
      }
    },
    [onPointerMove],
  )

  const handlePointerLeave = useCallback(() => setBadgePos(null), [])

  const tileCount = infinite ? TILE_COUNT : 1
  const centerTileIndex = infinite ? CENTER_TILE_INDEX : 0

  return (
    <div
      ref={containerRef}
      className={cn(
        styles.ArtifactGridRow,
        isDragging && styles.ArtifactGridRow_dragging,
        isFirstRow && styles.ArtifactGridRow_first,
        isLastRow && styles.ArtifactGridRow_last,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={handlePointerLeave}
      onDragStart={onDragStart}
    >
      <div ref={trackRef} className={styles.ArtifactGridRow_track}>
        {Array.from({ length: tileCount }, (_, tileIndex) =>
          artifacts.map((artifact, index) => {
            const isCenterTile = tileIndex === centerTileIndex
            return (
              <ArtifactThumbnail
                key={`${artifact.id}-${tileIndex}`}
                artifact={artifact}
                variant="grid"
                decorative={!isCenterTile}
                // Only the very first card of the very first row's one
                // real (center-tile) copy is above-the-fold on every
                // breakpoint.
                priority={Boolean(isFirstRow) && isCenterTile && index === 0}
                className={isCenterTile ? 'artifact-reveal' : undefined}
              />
            )
          }),
        )}
      </div>
      {badgePos && (
        <DragBadge x={badgePos.x} y={badgePos.y} variant={isDragging ? 'active' : 'idle'} />
      )}
    </div>
  )
}
