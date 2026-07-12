'use client'

import type { Artifact } from '@/types/artifact'
import { ArtifactThumbnail } from '@/app/list/components/artifact-thumbnail'
import { cn } from '@/lib/utils'
import { useDragPan } from '../../use-drag-pan'
import styles from './styles.module.css'

export interface ArtifactGridRowProps {
  artifacts: Artifact[]
  isFirstRow?: boolean
  isLastRow?: boolean
  onDragEnd?: (didDrag: boolean) => void
}

/**
 * One row of the Grid view's oversized canvas (Story 3.2): a
 * click-and-drag pannable strip (mouse "grab", touch swipe — both via
 * `useDragPan`'s pointer events) rather than a native `overflow-x` scroll
 * container, so there's no scrollbar to hide (there's no native scroll at
 * all) and the track can be centered by default without losing reach to
 * its own left-hand overflow.
 */
export function ArtifactGridRow({
  artifacts,
  isFirstRow,
  isLastRow,
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
  } = useDragPan({ onDragEnd })

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
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDragStart={onDragStart}
    >
      <div ref={trackRef} className={styles.ArtifactGridRow_track}>
        {artifacts.map((artifact, index) => (
          <ArtifactThumbnail
            key={artifact.id}
            artifact={artifact}
            variant="grid"
            // Only the very first card of the very first row is
            // above-the-fold on every breakpoint.
            priority={Boolean(isFirstRow) && index === 0}
            className="artifact-reveal"
          />
        ))}
      </div>
    </div>
  )
}
