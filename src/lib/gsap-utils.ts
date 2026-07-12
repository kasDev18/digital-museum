'use client'

import type { MouseEvent, RefObject } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

/**
 * Reveals every element matching `selector` within `scope` as it scrolls
 * into view — a fade + slide-up via `ScrollTrigger.batch()`, per
 * docs/gsap-performance.md's "Batching many similar triggers" section
 * (written with exactly this case in mind: "a list/grid of similar
 * elements, e.g. artifact thumbnails"). One shared hook rather than
 * duplicating this setup across `ArtifactGrid`/`ArtifactList` (Stories
 * 3.2/3.3), which both reveal many `ArtifactThumbnail` cards the same way.
 *
 * Elements already in view on mount (e.g. a grid's first row, sitting
 * right below the fold) fire their reveal immediately as an entrance
 * animation rather than waiting for a scroll that may never come — same
 * "already past `start`" behavior `LandingHeroContentReveal` relies on.
 * Under `prefers-reduced-motion`, the callback never runs at all, so
 * targets stay at their normal, always-visible CSS state.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>, selector: string) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current)

        // Hidden immediately (not via CSS) so there's no flash of the final
        // state before ScrollTrigger ever gets a chance to animate it in.
        gsap.set(targets, { autoAlpha: 0, y: 40 })

        ScrollTrigger.batch(targets, {
          start: 'top 85%',
          onEnter: batch =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              force3D: true,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.12,
              // Once revealed, drop the inline styles this tween wrote so
              // these elements go back to being fully CSS-controlled (e.g.
              // ArtifactThumbnail's own hover transitions) — see the same
              // reasoning in LandingHeroContentReveal.
              clearProps: 'transform,opacity,visibility',
              // will-change is set only for the tween's lifetime, not a
              // permanent CSS rule, per docs/gsap-performance.md.
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
    { scope },
  )
}

/**
 * Returns a click handler — attach it to a container's `onClickCapture`
 * (not `onClick`; see below) and rely on event delegation rather than one
 * listener per link — that intercepts clicks on any `<a
 * href="/detail/...">` inside `scope`, fades/slides the elements matching
 * `revealSelector` out (continuing their entrance reveal's upward motion,
 * just outward this time), then navigates once the animation completes.
 * The List page's equivalent of `LandingHero`'s own click-triggered exit
 * animation before its "Enter Exhibition" CTA navigates — same
 * `contextSafe`-wrapped-handler and reduced-motion-skips-straight-through
 * shape.
 *
 * Must be wired to `onClickCapture`, not `onClick`: `next/link` attaches
 * its own `onClick` directly to the anchor, which runs `router.push`
 * itself unless `event.defaultPrevented` is already true by the time it
 * runs. A delegated *bubble*-phase handler on an ancestor fires *after*
 * that (bubble order is target-to-root, and the anchor is the target), so
 * by the time it calls `preventDefault()` the navigation has already
 * happened. A *capture*-phase handler runs root-to-target, i.e. before the
 * anchor's own listener — calling `stopPropagation()` there keeps the
 * event from ever reaching `next/link`'s handler at all, so this hook
 * fully owns the navigation instead of merely reacting after the fact.
 *
 * Delegating from the container (rather than a handler per
 * `ArtifactThumbnail`) also means it doesn't matter which of a List row's
 * two overlapping links (the "Explore Story" link and its stretched
 * full-row sibling, Story 3.1) was actually clicked — `closest()` finds
 * whichever one the click actually landed on.
 */
export function useExitFadeNavigation(
  scope: RefObject<HTMLElement | null>,
  revealSelector: string,
) {
  const router = useRouter()
  const { contextSafe } = useGSAP({ scope })

  return contextSafe((event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/detail/"]')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href) return

    event.preventDefault()
    event.stopPropagation()

    const targets = gsap.utils.toArray<HTMLElement>(revealSelector, scope.current)

    gsap.to(targets, {
      autoAlpha: 0,
      y: -40,
      force3D: true,
      duration: 0.45,
      ease: 'power2.in',
      stagger: 0.03,
      onComplete: () => router.push(href),
    })
  })
}
