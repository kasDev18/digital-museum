import type { ArtifactTypeFilter } from '@/lib/data-utils'
import styles from './styles.module.css'

export interface ListFilteredEmptyStateProps {
  category: ArtifactTypeFilter
  onClear: () => void
}

/**
 * Filtered-results "no matches" fallback for the List page (Story 4.3) —
 * rendered when `CategoryFilter`'s selected category (Story 4.2) narrows
 * the dataset to zero artifacts. Distinct from `ListEmptyState`, which
 * covers the more basic "the underlying artifact array itself is empty"
 * case (Stories 3.2/3.3) and has no notion of an active filter at all.
 *
 * Rendered once by `ListPageContent`, in place of whichever view
 * (Grid/List) is active, rather than duplicated inside both `ArtifactGrid`
 * and `ArtifactList` — the message and "clear filter" action are identical
 * regardless of view mode, and `ListPageContent` is the one place that
 * already holds both the filtered count and the setter needed to reset the
 * category back to `ALL_OBJECTS_FILTER`.
 */
export function ListFilteredEmptyState({ category, onClear }: ListFilteredEmptyStateProps) {
  return (
    <div className={styles.ListFilteredEmptyState}>
      <p className={styles.ListFilteredEmptyState_message}>No {category} artifacts found.</p>
      <p className={styles.ListFilteredEmptyState_hint}>
        Try a different category, or view the full collection.
      </p>
      <button type="button" onClick={onClear} className={styles.ListFilteredEmptyState_action}>
        View all objects
      </button>
    </div>
  )
}
