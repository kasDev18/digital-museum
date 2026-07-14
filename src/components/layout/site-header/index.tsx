'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { subscribeToLandingReveal } from '@/lib/landing-reveal'
import { ArtifactaWordmark } from '@/components/ui/icons'
import styles from './styles.module.css'

const SCROLL_GRADIENT_THRESHOLD = 8

export function SiteHeader() {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  // On the landing route the header starts hidden and only fades in once
  // `LandingHeroContentReveal` dispatches the reveal event, in lockstep with
  // the hero text and the hero's own black->theme background fade. Every
  // other route has no such entrance — the header is just always visible,
  // same as before this landing-specific behavior existed.
  const [revealed, setRevealed] = useState(!isLanding)
  const [scrolled, setScrolled] = useState(false)

  // Re-arm the reveal on every transition into the landing route (not just
  // the first mount), so client-side navigation back to `/` replays the
  // fade-in instead of leaving the header stuck visible from before. This
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

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_GRADIENT_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header data-revealed={revealed} data-scrolled={scrolled} className={styles.SiteHeader}>
      <Link href="/" className={styles.SiteHeader_link}>
        <ArtifactaWordmark className={styles.SiteHeader_wordmark} />
        <span className="sr-only">Artifacta</span>
      </Link>
    </header>
  )
}
