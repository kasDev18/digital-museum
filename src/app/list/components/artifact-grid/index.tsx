'use client'

import { useCallback, useRef } from 'react'
import type { MouseEvent } from 'react'
import type { Artifact } from '@/types/artifact'
import { ListEmptyState } from '@/app/list/components/list-empty-state'
import { useExitFadeNavigation, useScrollReveal } from '@/lib/gsap-utils'
import { ArtifactGridRow } from './components/artifact-grid-row'
import styles from './styles.module.css'

export interface ArtifactGridProps {
  artifacts: Artifact[]
}

/**
 * Row item counts, summing to the full 12-artifact mock dataset (Story 1.5)
 * with every artifact appearing exactly once — no repeats/filler. Each row
 * is its own independently pannable strip (see `ArtifactGridRow`), and a
 * row's differing item count gives it a different total content width, so
 * different rows reveal different amounts of "more to see" — the
 * oversized-canvas effect, scoped per row.
 */
const ROW_SIZES = [5, 4, 3]

/**
 * Grid view of the List page (Epic 3, Story 3.2): a dense, oversized canvas
 * of `ArtifactThumbnail` cards (`variant="grid"`), laid out as rows
 * (`ArtifactGridRow`) rather than a uniform CSS Grid, per the Figma
 * "Gallery" frame's own auto-layout. Each row pans horizontally on its own
 * via click-and-drag/touch-swipe (no native scroll, no scrollbar — see
 * `useDragPan`) rather than the whole canvas sharing one scroll; the
 * canvas's own rows simply stack vertically, so panning down is just the
 * page's native scroll. Cards fade/slide in as they scroll into view, and
 * fade/slide out (continuing upward) just before navigating to a Detail
 * page — see `useScrollReveal` and `useExitFadeNavigation`.
 */
export function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  const container = useRef<HTMLDivElement>(null)
  useScrollReveal(container, '.artifact-reveal')
  const exitFadeClick = useExitFadeNavigation(container, '.artifact-reveal')

  // A drag that moved past ArtifactGridRow's threshold still fires an
  // ordinary `click` on release — this suppresses exactly that one click
  // so panning a row doesn't also trigger exit-fade-navigation to a
  // Detail page. Set by whichever row's drag just ended; consumed (and
  // reset) by the very next click, wherever it lands.
  const suppressNextClick = useRef(false)

  const handleClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (suppressNextClick.current) {
        suppressNextClick.current = false
        event.preventDefault()
        event.stopPropagation()
        return
      }
      exitFadeClick(event)
    },
    [exitFadeClick],
  )

  const handleRowDragEnd = useCallback((didDrag: boolean) => {
    if (didDrag) suppressNextClick.current = true
  }, [])

  if (artifacts.length === 0) {
    return <ListEmptyState />
  }

  const rows: Artifact[][] = []
  let cursor = 0
  let rowIndex = 0
  while (cursor < artifacts.length) {
    const size = ROW_SIZES[rowIndex % ROW_SIZES.length]
    rows.push(artifacts.slice(cursor, cursor + size))
    cursor += size
    rowIndex += 1
  }

  return (
    <div ref={container} className={styles.ArtifactGrid_canvas} onClickCapture={handleClickCapture}>
      {rows.map((row, rIndex) => (
        <ArtifactGridRow
          key={rIndex}
          artifacts={row}
          isFirstRow={rIndex === 0}
          isLastRow={rIndex === rows.length - 1}
          onDragEnd={handleRowDragEnd}
        />
      ))}
    </div>
  )
}
