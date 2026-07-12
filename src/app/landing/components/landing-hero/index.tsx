'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, type MouseEvent } from 'react'
import { gsap, useGSAP } from '@/lib/gsap-utils'
import styles from './styles.module.css'
import { LandingHeroDisc } from './components/landing-hero-disc'
import { LandingHeroContentReveal } from './components/landing-hero-content-reveal'

const EXPLORE_HREF = '/list'

export function LandingHero() {
  const router = useRouter()
  const section = useRef<HTMLElement>(null)

  // No entrance/scroll effect needed here (LandingHeroDisc and
  // LandingHeroContentReveal own those) — this context exists solely to
  // scope the click-triggered exit animation below via `contextSafe`, so
  // its tweens get cleaned up correctly if the section unmounts mid-flight.
  const { contextSafe } = useGSAP({ scope: section })

  const handleExploreClick = contextSafe((event: MouseEvent<HTMLAnchorElement>) => {
    // Reduced-motion users skip straight to the destination — nothing to
    // gate navigation behind.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()

    // Found via the clicked element's own DOM position (`closest`), not the
    // `section` ref, so this callback doesn't close over a ref value — the
    // `section` ref is only for `useGSAP`'s `scope` above.
    const root = event.currentTarget.closest<HTMLElement>('[data-landing-hero]')
    const discEl = root?.querySelector<HTMLElement>('[data-disc]')
    const discGroups = gsap.utils.toArray<HTMLElement>('[data-disc-group]', root)
    const headline = root?.querySelector<HTMLElement>('[data-hero-reveal="headline"]')
    const subtext = root?.querySelector<HTMLElement>('[data-hero-reveal="subtext"]')
    const cta = root?.querySelector<HTMLElement>('[data-hero-reveal="cta"]')

    const tl = gsap.timeline({ onComplete: () => router.push(EXPLORE_HREF) })

    // Disc "decompresses": each group drifts outward along its own
    // direction from the shared disc center (measured live via
    // `getBoundingClientRect`, so it's correct at whatever size the disc
    // renders at per breakpoint) while the whole assembly spins counter-
    // clockwise and fades — a coherent piece coming apart at the seams,
    // not a random scatter. The counter-clockwise `rotation` delta is the
    // same for every group so they still read as one disc; only the
    // outward direction/distance differs per group. GSAP's default
    // overwrite behavior hands control of `rotation` from
    // `LandingHeroDisc`'s ambient clockwise spin (a different GSAP
    // context, repeat: -1) to this tween the moment it starts, so the
    // reversal is smooth rather than the two fighting each other.
    if (discEl) {
      const discRect = discEl.getBoundingClientRect()
      const discCenterX = discRect.left + discRect.width / 2
      const discCenterY = discRect.top + discRect.height / 2
      const travel = discRect.width * 0.15

      discGroups.forEach((group, index) => {
        const groupRect = group.getBoundingClientRect()
        const groupCenterX = groupRect.left + groupRect.width / 2
        const groupCenterY = groupRect.top + groupRect.height / 2
        const dx = groupCenterX - discCenterX
        const dy = groupCenterY - discCenterY
        const distance = Math.hypot(dx, dy) || 1

        tl.to(
          group,
          {
            autoAlpha: 0,
            x: `+=${(dx / distance) * travel}`,
            y: `+=${(dy / distance) * travel}`,
            rotation: '-=140',
            scale: 1.08,
            duration: 0.9,
            delay: index * 0.05,
            ease: 'power2.in',
          },
          0,
        )
      })
    }

    // Headline exits left, subtext exits right — a "parting" motion rather
    // than a shared direction, so the two lines read as deliberately
    // diverging instead of just sliding off together.
    if (headline) {
      tl.to(headline, { autoAlpha: 0, x: -60, duration: 0.5, ease: 'power2.in' }, 0)
    }
    if (subtext) {
      tl.to(subtext, { autoAlpha: 0, x: 60, duration: 0.5, ease: 'power2.in' }, 0)
    }

    // CTA just fades in place, no movement, slower than the text so it's
    // the last thing still visible before the page navigates away.
    if (cta) {
      tl.to(cta, { autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, 0)
    }
  })

  return (
    <section ref={section} data-landing-hero className={styles.LandingHero}>
      <LandingHeroDisc />

      <LandingHeroContentReveal className={styles.LandingHero_content}>
        <div className={styles.LandingHero_titleBlock}>
          <h1 data-hero-reveal="headline" className={styles.LandingHero_headline}>
            Objects, Voices
            <br />
            and Global
            <br />
            Journeys
          </h1>
          <p data-hero-reveal="subtext" className={styles.LandingHero_subtext}>
            Exploring identity through objects in a world shaped by migration.
          </p>
        </div>
        <Link
          href={EXPLORE_HREF}
          data-hero-reveal="cta"
          onClick={handleExploreClick}
          className={styles.LandingHero_cta}
        >
          Enter Exhibition
        </Link>
      </LandingHeroContentReveal>
    </section>
  )
}
