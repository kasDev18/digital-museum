import styles from './styles.module.css'

/**
 * Shared "no artifacts" fallback for both the Grid (Story 3.2) and List
 * (Story 3.3) views. Distinct from Story 4.3's filtered-empty-state (which
 * covers "no results for this category") — this one covers the more basic
 * case of the underlying artifact array itself being empty.
 */
export function ListEmptyState() {
  return (
    <div className={styles.ListEmptyState}>
      <p className={styles.ListEmptyState_message}>No artifacts to display right now.</p>
    </div>
  )
}
