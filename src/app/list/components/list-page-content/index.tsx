'use client'

import { useState } from 'react'
import type { Artifact } from '@/types/artifact'
import { ArtifactGrid } from '@/app/list/components/artifact-grid'
import { ArtifactList } from '@/app/list/components/artifact-list'
import { ViewSwitcher, type ViewMode } from '@/app/list/components/view-switcher'
import styles from './styles.module.css'

export interface ListPageContentProps {
  artifacts: Artifact[]
}

/**
 * Owns the List page's Grid/List `ViewMode` state (Story 3.4) and renders
 * the `ViewSwitcher` pill above whichever view is active. Lives as its own
 * client component (rather than in `page.tsx` directly) so the route's
 * `page.tsx` can stay a Server Component for the `getAllArtifacts()` data
 * fetch, per this project's convention of pushing `'use client'` as far
 * down the tree as the interactive state actually requires.
 *
 * Switching views remounts the freshly-selected one (`key={viewMode}`),
 * which also replays its `useScrollReveal` entrance animation from
 * scratch, and the wrapper's own `fadeIn` (see styles, reduced-motion
 * gated) crossfades the swap itself rather than leaving it an abrupt cut.
 */
export function ListPageContent({ artifacts }: ListPageContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  return (
    <>
      <div className={styles.ListPageContent_toolbar}>
        <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />
      </div>
      <div key={viewMode} className={styles.ListPageContent_view}>
        {viewMode === 'grid' ? (
          <ArtifactGrid artifacts={artifacts} />
        ) : (
          <ArtifactList artifacts={artifacts} />
        )}
      </div>
    </>
  )
}
