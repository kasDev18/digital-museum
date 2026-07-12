import { getAllArtifacts } from '@/lib/data-utils'
import { ArtifactGrid } from './components/artifact-grid'
import { ListBackground } from './components/list-background'
import styles from './styles.module.css'

/**
 * List page route (Epic 3). Renders the Grid view (Story 3.2), matching
 * `Gallery.png`'s primary desktop mockup. The List view (Story 3.3,
 * `ArtifactList`) is fully built and was verified by temporarily swapping
 * it in during development — same manual-verification approach Story 3.1
 * used for its dev-only preview route (removed before finalizing) — and is
 * ready for Story 3.4 to wire in via its client-state-driven pill toggle.
 */
export default function ListPage() {
  const artifacts = getAllArtifacts()

  return (
    <main className={styles.ListPage}>
      <ListBackground />
      <ArtifactGrid artifacts={artifacts} />
    </main>
  )
}
