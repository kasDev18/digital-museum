'use client'

import { useMemo, useState } from 'react'
import type { Artifact } from '@/types/artifact'
import { ArtifactGrid } from '@/app/list/components/artifact-grid'
import { ArtifactList } from '@/app/list/components/artifact-list'
import { CategoryFilter } from '@/app/list/components/category-filter'
import { ViewSwitcher, type ViewMode } from '@/app/list/components/view-switcher'
import {
  ALL_OBJECTS_FILTER,
  ARTIFACT_CATEGORIES,
  filterArtifactsByType,
  type ArtifactTypeFilter,
} from '@/lib/data-utils'
import styles from './styles.module.css'

export interface ListPageContentProps {
  artifacts: Artifact[]
}

/**
 * Owns the List page's Grid/List `ViewMode` state (Story 3.4) and category
 * filter state (Story 4.2), rendering `CategoryFilter` and the
 * `ViewSwitcher` pill above whichever view is active. Lives as its own
 * client component (rather than in `page.tsx` directly) so the route's
 * `page.tsx` can stay a Server Component for the `getAllArtifacts()` data
 * fetch, per this project's convention of pushing `'use client'` as far
 * down the tree as the interactive state actually requires.
 *
 * Both pieces of state are siblings here (not nested inside one another),
 * which is what makes the category filter survive a Grid⇄List toggle for
 * free — switching `viewMode` alone doesn't touch `category`.
 *
 * The active view remounts on *either* state changing (`key={viewMode}-
 * {category}`), which also replays its `useScrollReveal` entrance
 * animation from scratch, and the wrapper's own `fadeIn` (see styles,
 * reduced-motion gated) crossfades the swap itself rather than leaving it
 * an abrupt cut. Remounting on a category change isn't just cosmetic: each
 * `ArtifactGridRow` keeps its own pan offset (`useDragPan`) for as long as
 * it stays mounted, keyed only by row index — without the remount, picking
 * a category with fewer/narrower cards would leave a row's *old* pan
 * offset applied to its new, narrower content, rendering it partially or
 * fully outside the row's `overflow: hidden` bounds until the next drag.
 */
export function ListPageContent({ artifacts }: ListPageContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [category, setCategory] = useState<ArtifactTypeFilter>(ALL_OBJECTS_FILTER)

  const filteredArtifacts = useMemo(
    () => filterArtifactsByType(artifacts, category),
    [artifacts, category],
  )

  return (
    <>
      <CategoryFilter categories={ARTIFACT_CATEGORIES} selected={category} onChange={setCategory} />
      <div className={styles.ListPageContent_toolbar}>
        <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />
      </div>
      <div key={`${viewMode}-${category}`} className={styles.ListPageContent_view}>
        {viewMode === 'grid' ? (
          <ArtifactGrid artifacts={filteredArtifacts} />
        ) : (
          <ArtifactList artifacts={filteredArtifacts} />
        )}
      </div>
    </>
  )
}
