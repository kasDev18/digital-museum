'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Artifact } from '@/types/artifact'
import { ArtifactGrid } from '@/app/list/components/artifact-grid'
import { ArtifactList } from '@/app/list/components/artifact-list'
import { CategoryFilter } from '@/app/list/components/category-filter'
import { ListFilteredEmptyState } from '@/app/list/components/list-filtered-empty-state'
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

/** `sessionStorage` keys for Story 4.4's cross-navigation persistence below — prefixed to match `THEME_STORAGE_KEY`/`FONT_SCALE_STORAGE_KEY`'s existing `artifacta-` convention (`src/lib/theme-script.ts`). */
const VIEW_MODE_STORAGE_KEY = 'artifacta-list-view-mode'
const CATEGORY_STORAGE_KEY = 'artifacta-list-category'

function isViewMode(value: string | null): value is ViewMode {
  return value === 'grid' || value === 'list'
}

function isArtifactTypeFilter(value: string | null): value is ArtifactTypeFilter {
  return (ARTIFACT_CATEGORIES as string[]).includes(value ?? '')
}

/** `sessionStorage` can throw in some private-browsing configurations (e.g. Safari private mode's storage quota); every access here is best-effort only. */
function readSessionStorage(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSessionStorage(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Best-effort persistence only — losing it just means the next mount
    // falls back to the Grid/All-Objects default, same as today.
  }
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
 *
 * Story 4.3: when the active category filters the dataset down to zero
 * artifacts, `ListFilteredEmptyState` renders in place of whichever view is
 * active (Grid/List both delegate to this one branch — no per-view
 * duplication) with an action that resets `category` back to
 * `ALL_OBJECTS_FILTER`. This is a distinct case from `ArtifactGrid`/
 * `ArtifactList`'s own `ListEmptyState` fallback, which only fires when
 * `artifacts` itself (the unfiltered prop) is empty — that branch is left
 * alone and still lives inside each view.
 *
 * `ArtifactGrid`'s `infinite` prop is derived directly from `category` here
 * (`true` only for `ALL_OBJECTS_FILTER`): genuinely infinite wrap-around
 * dragging is only appropriate for the full, 12-artifact canvas — tiling a
 * category filtered down to a couple of real artifacts to fill an
 * "infinite" canvas would read as an obvious, broken-looking loop rather
 * than a large collection, so a filtered grid instead gets the original
 * finite, rubber-banded bounds (see `useDragPan`'s own doc comment).
 *
 * Story 4.4: `viewMode`/`category` are also persisted to `sessionStorage`
 * so a full unmount of this component — e.g. navigating to a Detail page
 * and back via "Back to Gallery" — restores the same view/filter instead
 * of always reverting to the Grid/All-Objects default (previously the only
 * option, since neither piece of state lived anywhere but this component's
 * own React state). Restoration happens in a `useEffect`, not a lazy
 * `useState` initializer, so the server-rendered/first-client-render
 * output always matches the Grid/All-Objects default and hydration never
 * mismatches — `sessionStorage` isn't reachable during SSR in the first
 * place. The write side is a single effect keyed on both `[viewMode,
 * category]` (not one effect per key) that skips its own first post-mount
 * run via `skipNextPersist` — that first run's state is either the
 * untouched default or the value just read *from* storage by the restore
 * effect above, so writing it back would only ever be a redundant no-op.
 * `handleViewModeChange` resets the page's scroll position back to
 * the top on every *explicit* Grid⇄List toggle (the two layouts don't
 * share a scroll position that means the same thing), tied directly to the
 * `ViewSwitcher`'s own click rather than a `useEffect` keyed on `viewMode`
 * — that keeps the sessionStorage restore above (which also changes
 * `viewMode`, once, right after mount) from triggering an unwanted scroll
 * jump on page load.
 */
export function ListPageContent({ artifacts }: ListPageContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [category, setCategory] = useState<ArtifactTypeFilter>(ALL_OBJECTS_FILTER)

  // Skips the write effect's first post-mount run — see the doc comment above.
  const skipNextPersist = useRef(true)

  useEffect(() => {
    // One-time sync from an external system (`sessionStorage`) that can
    // only be read on the client, deliberately done here rather than via a
    // lazy `useState` initializer — see the doc comment above for why that
    // would reintroduce a hydration mismatch this effect avoids.
    const storedView = readSessionStorage(VIEW_MODE_STORAGE_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isViewMode(storedView)) setViewMode(storedView)

    const storedCategory = readSessionStorage(CATEGORY_STORAGE_KEY)
    if (isArtifactTypeFilter(storedCategory)) setCategory(storedCategory)
  }, [])

  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false
      return
    }
    writeSessionStorage(VIEW_MODE_STORAGE_KEY, viewMode)
    writeSessionStorage(CATEGORY_STORAGE_KEY, category)
  }, [viewMode, category])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [])

  const handleClearFilter = useCallback(() => setCategory(ALL_OBJECTS_FILTER), [])

  const filteredArtifacts = useMemo(
    () => filterArtifactsByType(artifacts, category),
    [artifacts, category],
  )

  // Guarded on `artifacts.length > 0` too: without it, an empty *unfiltered*
  // dataset combined with a restored non-default category (Story 4.4) would
  // wrongly show this "try a different category" messaging instead of
  // deferring to `ArtifactGrid`/`ArtifactList`'s own `ListEmptyState`, which
  // is the actually-correct fallback when there was never anything to
  // filter in the first place.
  const isFilteredEmpty =
    category !== ALL_OBJECTS_FILTER && artifacts.length > 0 && filteredArtifacts.length === 0

  return (
    <>
      <CategoryFilter categories={ARTIFACT_CATEGORIES} selected={category} onChange={setCategory} />
      <div className={styles.ListPageContent_toolbar}>
        <ViewSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
      </div>
      <div key={`${viewMode}-${category}`} className={styles.ListPageContent_view}>
        {isFilteredEmpty ? (
          <ListFilteredEmptyState category={category} onClear={handleClearFilter} />
        ) : viewMode === 'grid' ? (
          <ArtifactGrid artifacts={filteredArtifacts} infinite={category === ALL_OBJECTS_FILTER} />
        ) : (
          <ArtifactList artifacts={filteredArtifacts} />
        )}
      </div>
    </>
  )
}
