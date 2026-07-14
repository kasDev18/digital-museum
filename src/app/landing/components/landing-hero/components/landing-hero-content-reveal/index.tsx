'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-utils'
import { dispatchLandingReveal } from '@/lib/landing-reveal'

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

      // Under reduced motion the headline/subtext/CTA just render normally,
      // always visible — but header/footer (listening on the other side of
      // `dispatchLandingReveal`) still need to know the hero has "arrived"
      // so they don't stay hidden forever.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        dispatchLandingReveal()
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Reveal order matches DOM/markup order (headline, subtext, CTA in
        // `LandingHero`), same `data-*` targeting precedent as
        // `data-disc-group` on `LandingHeroDisc`.
        const targets = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]', container.current)

        // Hide immediately (not via CSS) so there's no flash of the final
        // state before ScrollTrigger ever gets a chance to animate it in —
        // see docs/gsap-performance.md. The container itself (not just the
        // targets) needs hiding too: `.LandingHero_content::before`'s
        // radial scrim paints from the container, and would otherwise
        // render solid before the text ever appears.
        gsap.set(container.current, { autoAlpha: 0 })
        // `filter: blur(0px)` (not `'none'`) as the starting value so GSAP
        // has a concrete blur length to interpolate away from — animating
        // straight from `'none'` can't be tweened smoothly.
        gsap.set(targets, { y: 28, filter: 'blur(16px)' })

        // The hero fills the viewport on load, so this trigger's `start` is
        // already past on mount — that's intentional here, not the "already
        // past start on load" pitfall docs/gsap-performance.md warns about:
        // it makes the reveal fire immediately as an entrance animation
        // while still going through ScrollTrigger for viewport detection
        // and `once: true`, per Story 2.3's AC. ScrollTrigger's own
        // load/resize-triggered refresh (the same mechanism every other
        // ScrollTrigger in this codebase relies on) re-evaluates `start`
        // if web fonts/images shift the layout after this initial mount
        // measurement, so `onEnter` still fires once that settles.
        ScrollTrigger.create({
          trigger: container.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            // Scrim fades in with the headline's own start (not staggered
            // with it) — it's the shared backdrop, not one of the 3
            // sequenced content elements.
            gsap.to(container.current, { autoAlpha: 1, duration: 1.5, delay: 2, ease: 'none' })

            gsap.to(targets, {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.9,
              ease: 'power2.out',
              // Headline -> subtext -> CTA stagger. Overall pacing (~3s to
              // fully settle) matches this reveal's previous single-block
              // version, so LandingHeroDisc's rotation (delay: 2, 36s per
              // turn) has only turned a few imperceptible degrees by the
              // time the CTA finishes.
              delay: 1.6,
              // Fires once this tween's own `delay` elapses and the
              // headline actually starts blurring into view — the moment
              // `SiteHeader`/`SiteFooter` should fade in and the hero's
              // black backdrop should start clearing, not `onEnter` above
              // (which fires immediately, before any of that is visible).
              onStart: dispatchLandingReveal,
              stagger: 0.25,
              // Once revealed, drop the inline transform/opacity/visibility
              // this tween wrote so these elements go back to being fully
              // CSS-controlled — otherwise that inline style permanently
              // outranks any later CSS rule on the same properties (e.g.
              // the CTA's `hover:scale-*` in styles.module.css) regardless
              // of specificity. Safe here because the end state (opacity 1,
              // visible, no transform, no blur) already matches each
              // element's un-animated CSS default.
              clearProps: 'transform,opacity,visibility,filter',
            })
          },
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
