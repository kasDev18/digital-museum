import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './not-found.module.css'

/**
 * Without this, the `<title>` for any `notFound()`-triggered render (e.g.
 * an unknown `/detail/[id]`) falls back to the root layout's own default
 * title ("Artifacta — Objects, Voices and Global Journeys") — confirmed
 * via a direct request — rather than anything describing a 404, since
 * `generateMetadata` on the segment that called `notFound()` is not used
 * for this render.
 */
export const metadata: Metadata = {
  title: 'Artifact Not Found — Artifacta',
}

/**
 * Site-wide 404 (Story 3.5) — renders inside `RootLayout`, so it keeps the
 * `SiteHeader`/`SiteFooter` chrome, unlike Next's built-in default 404 page
 * (which bypasses custom layouts entirely). Reached when `notFound()` is
 * thrown for an unknown `/detail/[id]`, and for any other unmatched route.
 */
export default function NotFound() {
  return (
    <main className={styles.NotFound}>
      <p className={styles.NotFound_eyebrow}>404</p>
      <h1 className={styles.NotFound_title}>We couldn&apos;t find that artifact</h1>
      <p className={styles.NotFound_message}>
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <Link href="/list" className={styles.NotFound_link}>
        Back to Gallery
      </Link>
    </main>
  )
}
