'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-utils'
import styles from './styles.module.css'
import { cn } from '@/lib/utils'

const PANELS = ['One', 'Two', 'Three']

export function GsapScrollDemo() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const boxes = gsap.utils.toArray<HTMLElement>('.gsap-demo-box')

        // Hide immediately (not via CSS) so there's no flash of the final
        // state before ScrollTrigger ever gets a chance to animate it in.
        gsap.set(boxes, { autoAlpha: 0, y: 80 })

        // Each `.gsap-demo-box` gets its own trigger via batch() so panels
        // animate independently as they individually scroll into view,
        // rather than all firing together off one shared trigger element.
        ScrollTrigger.batch(boxes, {
          start: 'top 80%',
          onEnter: batch =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              force3D: true,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.15,
              // will-change is set only for the tween's lifetime (not a
              // permanent CSS rule) per docs/gsap-performance.md.
              onStart: () =>
                (batch as HTMLElement[]).forEach(
                  el => (el.style.willChange = 'transform, opacity'),
                ),
              onComplete: () =>
                (batch as HTMLElement[]).forEach(el => (el.style.willChange = 'auto')),
            }),
        })
      })

      return () => mm.revert()
    },
    { scope: container },
  )

  return (
    <div ref={container} className={styles.GsapScrollDemo}>
      <p className={styles.GsapScrollDemo_title}>
        Story 1.3 GSAP + ScrollTrigger smoke test — scroll down to see each panel fade and slide in.
      </p>
      <div className={styles.GsapScrollDemo_directionCont}>
        <p className={styles.GsapScrollDemo_direction}>
          ↓ Keep scrolling to trigger the panels below ↓
        </p>
      </div>
      {PANELS.map(label => (
        <div key={label} className={cn('gsap-demo-box', styles.GsapScrollDemo_panel)}>
          Panel {label}
        </div>
      ))}
    </div>
  )
}
