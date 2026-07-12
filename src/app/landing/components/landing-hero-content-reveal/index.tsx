'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap-utils'

export function LandingHeroContentReveal({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Hide immediately (not via CSS) so there's no flash of the final
        // state before this reveal runs — see docs/gsap-performance.md.
        // Under reduced motion this callback never runs at all, so the
        // headline/subtext/CTA just render normally, always visible.
        gsap.set(container.current, { autoAlpha: 0 })

        // Finishes well before LandingHeroDisc's continuous rotation
        // starts (that tween's own `delay: 2`), so the headline is fully
        // revealed before the disc visibly begins spinning.
        gsap.to(container.current, {
          delay: 1.8,
          autoAlpha: 1,
          duration: 1.2,
          ease: 'power2.out',
        })
      })

      return () => mm.revert()
    },
    { scope: container },
  )

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  )
}
