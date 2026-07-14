'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { subscribeToLandingReveal } from '@/lib/landing-reveal'
import { CopyrightMark, XIcon, YoutubeIcon } from '@/components/ui/icons'
import { ThemeFontControls } from './components/theme-font-controls'
import styles from './styles.module.css'

const SOCIAL_LINKS = [
  { label: 'X (Twitter)', href: 'https://x.com/artifacta', Icon: XIcon },
  { label: 'YouTube', href: 'https://youtube.com/@artifacta', Icon: YoutubeIcon },
] as const

export function SiteFooter() {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  // Mirrors `SiteHeader`: hidden until the landing hero reveal fires, always
  // visible immediately on every other route. The top border (the two
  // `SiteFooter_border*` spans below) shares this same flag, so it draws in
  // from both edges toward the center in lockstep with the fade rather than
  // just appearing as a static line the instant opacity hits 1.
  const [revealed, setRevealed] = useState(!isLanding)

  // Re-arm the reveal on every transition into the landing route (not just
  // the first mount), so client-side navigation back to `/` replays the
  // fade-in instead of leaving the footer stuck visible from before. This
  // adjusts state during render (React's documented pattern for resetting
  // state when a prop changes) rather than in an effect.
  const [prevIsLanding, setPrevIsLanding] = useState(isLanding)
  if (isLanding !== prevIsLanding) {
    setPrevIsLanding(isLanding)
    setRevealed(!isLanding)
  }

  useEffect(() => {
    if (revealed) return
    return subscribeToLandingReveal(() => setRevealed(true))
  }, [revealed])

  return (
    <footer data-revealed={revealed} className={styles.SiteFooter}>
      <span className={styles.SiteFooter_borderLeft} aria-hidden="true" />
      <span className={styles.SiteFooter_borderRight} aria-hidden="true" />

      <p className={styles.SiteFooter_copyright}>
        <CopyrightMark className={styles.SiteFooter_copyrightIcon} />
        <span className="sr-only">Copyright ©2025 Artifacta</span>
      </p>

      <div className={styles.SiteFooter_links}>
        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={styles.SiteFooter_link}
          >
            <Icon className={styles.SiteFooter_linkIcon} />
          </a>
        ))}
        <ThemeFontControls />
      </div>
    </footer>
  )
}
