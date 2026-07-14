import { getAllArtifacts } from '@/lib/data-utils'
import { ListPageContent } from './components/list-page-content'
import { ListBackground } from './components/list-background'
import styles from './styles.module.css'

/**
 * List page route (Epic 3). Data fetching stays here in the Server
 * Component; `ListPageContent` (Story 3.4) owns the Grid/List `ViewMode`
 * client state and switches between `ArtifactGrid` (Story 3.2) and
 * `ArtifactList` (Story 3.3) via its pill toggle.
 */
export default function ListPage() {
  const artifacts = getAllArtifacts()

  return (
    <main className={styles.ListPage}>
      <ListBackground />
      <ListPageContent artifacts={artifacts} />
    </main>
  )
}
