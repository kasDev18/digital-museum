'use client'

import { useRef } from 'react'
import type { Artifact } from '@/types/artifact'
import { ArtifactThumbnail } from '@/app/list/components/artifact-thumbnail'
import { ListEmptyState } from '@/app/list/components/list-empty-state'
import { useExitFadeNavigation, useScrollReveal } from '@/lib/gsap-utils'
import styles from './styles.module.css'

export interface ArtifactListProps {
  artifacts: Artifact[]
}

/**
 * List view of the List page (Epic 3, Story 3.3): a vertical stack of
 * `ArtifactThumbnail` rows (`variant="list"`), each with its own divider
 * rule (`ArtifactThumbnail_list`'s `border-b`, Story 3.1). No drag/pan or
 * overflow container — this view scrolls with the page's own native
 * scroll, per this story's "standard scrollable container" Technical
 * Note. Rows fade/slide in as they scroll into view, and fade/slide out
 * just before navigating to a Detail page — see `useScrollReveal` and
 * `useExitFadeNavigation`.
 */
export function ArtifactList({ artifacts }: ArtifactListProps) {
  const container = useRef<HTMLUListElement>(null)
  useScrollReveal(container, '.artifact-reveal')
  const handleExitClick = useExitFadeNavigation(container, '.artifact-reveal')

  if (artifacts.length === 0) {
    return <ListEmptyState />
  }

  return (
    <ul ref={container} className={styles.ArtifactList} onClickCapture={handleExitClick}>
      {artifacts.map((artifact, index) => (
        <li key={artifact.id}>
          <ArtifactThumbnail
            artifact={artifact}
            variant="list"
            priority={index === 0}
            className="artifact-reveal"
          />
        </li>
      ))}
    </ul>
  )
}
