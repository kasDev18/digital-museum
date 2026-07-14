import Image from 'next/image'
import styles from './styles.module.css'

/**
 * Decorative backdrop for the List page: a wide, shallow arc/swoosh motif
 * (`Mask group 1 (1).svg`, a Figma export distinct from the landing page's
 * circular disc rings) that already bakes in its own cream tint and low
 * opacity, so it's rendered as-is rather than recolored via CSS filters —
 * it reads as this page's own atmosphere without competing with the
 * artifact thumbnails rendered above it.
 */
export function ListBackground() {
  return (
    <div className={styles.ListBackground} aria-hidden="true">
      <Image
        src="/assets/list-background-arcs.svg"
        alt=""
        fill
        className={styles.ListBackground_image}
      />
    </div>
  )
}
