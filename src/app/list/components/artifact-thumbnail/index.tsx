'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Artifact } from '@/types/artifact'
import { cn } from '@/lib/utils'
import { ExploreStoryArrowIcon } from '@/components/ui/icons'
import styles from './styles.module.css'

export interface ArtifactThumbnailProps {
  artifact: Artifact
  variant: 'grid' | 'list'
  /**
   * Optional side-effect fired with the artifact's id when the thumbnail is
   * activated (e.g. analytics). Purely a notification hook — it runs
   * alongside the `Link`'s own navigation and cannot cancel or redirect it.
   */
  onClick?: (id: string) => void
  /** Marks this instance for eager/LCP-priority loading — set by the consuming Grid/List layout (Story 3.2/3.3) for above-the-fold thumbnails. */
  priority?: boolean
  className?: string
}

/**
 * Thumbnail used by both the Grid and List views of the List page (Epic 3;
 * both views render from the same page/route, switched via view-mode state
 * in Story 3.4 — not separate route segments — hence living under this
 * page's own `app/list/components/`). Routes to `/detail/[id]` (Story 3.5
 * builds that route out; until then Next's built-in not-found page serves
 * as the "or placeholder" fallback called out in the story's acceptance
 * criteria).
 */
export function ArtifactThumbnail({
  artifact,
  variant,
  onClick,
  priority,
  className,
}: ArtifactThumbnailProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageErrored, setImageErrored] = useState(false)

  useEffect(() => {
    // Already-cached images can resolve before the `onLoad` handler below is
    // attached, so check the native `complete` state on mount too.
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true)
    }
  }, [artifact.thumbnail])

  const href = `/detail/${artifact.id}`
  const handleClick = onClick ? () => onClick(artifact.id) : undefined

  const image = (
    <span className={styles.ArtifactThumbnail_imageWrap}>
      {(!imageLoaded || imageErrored) && (
        <span aria-hidden="true" className={styles.ArtifactThumbnail_skeleton} />
      )}
      <Image
        ref={imgRef}
        src={artifact.thumbnail}
        // Decorative: the visible title caption right next to this image
        // already gives it a text description, so a repeated alt would
        // just double-announce the same title to screen readers.
        alt=""
        fill
        priority={priority}
        sizes={
          variant === 'grid'
            ? '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px'
            : '(max-width: 640px) 64px, 80px'
        }
        className={cn(
          styles.ArtifactThumbnail_image,
          imageErrored && styles.ArtifactThumbnail_imageHidden,
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageErrored(true)}
      />
    </span>
  )

  const title = <span className={styles.ArtifactThumbnail_title}>{artifact.title}</span>

  if (variant === 'grid') {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={cn(styles.ArtifactThumbnail, styles.ArtifactThumbnail_grid, className)}
      >
        {image}
        {title}
      </Link>
    )
  }

  return (
    <div className={cn(styles.ArtifactThumbnail_list, className)}>
      {image}
      {title}
      <Link
        href={href}
        onClick={handleClick}
        className={cn(styles.ArtifactThumbnail, styles.ArtifactThumbnail_explore)}
      >
        Explore Story
        <ExploreStoryArrowIcon className={styles.ArtifactThumbnail_exploreIcon} />
      </Link>
      {/* Stretched full-row hit target so the whole row is clickable too,
          per the "whole row/card, plus the explicit Explore Story link"
          acceptance criteria — a sibling, not a nested `<a>` (invalid
          HTML), and excluded from the accessibility tree so keyboard/screen
          reader users land on exactly one meaningful link per row (the
          "Explore Story" link above). */}
      <Link
        href={href}
        onClick={handleClick}
        aria-hidden="true"
        tabIndex={-1}
        className={styles.ArtifactThumbnail_stretchedLink}
      />
    </div>
  )
}
