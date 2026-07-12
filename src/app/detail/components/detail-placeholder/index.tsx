import Image from 'next/image'
import Link from 'next/link'
import type { Artifact } from '@/types/artifact'
import { BackArrowIcon } from '@/components/ui/icons'
import styles from './styles.module.css'

export interface DetailPlaceholderProps {
  artifact: Artifact
}

/**
 * Minimal Detail page (Story 3.5): gives every List page thumbnail a real,
 * chrome-complete landing spot instead of a dead end. The full media
 * carousel and audio/zoom/PDF/comment/migration-journey controls are Epic
 * 5's stretch scope — this covers this story's own "navigates to a
 * placeholder" acceptance criterion with the artifact's actual data rather
 * than a generic stand-in, so it's a real page Epic 5 can extend rather
 * than replace.
 */
export function DetailPlaceholder({ artifact }: DetailPlaceholderProps) {
  return (
    <main className={styles.DetailPlaceholder}>
      <Link href="/list" className={styles.DetailPlaceholder_back}>
        <BackArrowIcon className={styles.DetailPlaceholder_backIcon} />
        Back to Gallery
      </Link>

      <div className={styles.DetailPlaceholder_imageWrap}>
        <Image
          src={artifact.thumbnail}
          // Decorative: the visible title heading right below already
          // gives this image a text description (same rationale as
          // ArtifactThumbnail's own `alt=""`, Story 3.1).
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 720px"
          className={styles.DetailPlaceholder_image}
        />
      </div>

      <p className={styles.DetailPlaceholder_type}>{artifact.type}</p>
      <h1 className={styles.DetailPlaceholder_title}>{artifact.title}</h1>
      <p className={styles.DetailPlaceholder_description}>{artifact.description}</p>

      {artifact.contributor && (
        <blockquote className={styles.DetailPlaceholder_quote}>
          <p>&ldquo;{artifact.contributor.quote}&rdquo;</p>
          <cite className={styles.DetailPlaceholder_quoteCite}>— {artifact.contributor.name}</cite>
        </blockquote>
      )}

      {artifact.contributor?.story && (
        <p className={styles.DetailPlaceholder_description}>{artifact.contributor.story}</p>
      )}
    </main>
  )
}
