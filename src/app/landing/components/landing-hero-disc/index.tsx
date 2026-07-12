'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap-utils'
import styles from './styles.module.css'

/**
 * The three texture-cluster groups exported from Figma ("Mask group 1/2/3"),
 * each tightly cropped to its own content. Their `x`/`y`/`width`/`height`
 * are pixel positions within the original 1379x1393 disc composition,
 * recovered by aligning each export against the full disc render (there's
 * no positional metadata in a standalone SVG export) — expressed below as
 * percentages of that shared canvas so they scale with the responsive disc
 * container.
 *
 * Each group runs 3 animations in sequence once motion is allowed: (1) a
 * staggered fly-in from a random offset/rotation on mount, (2) its drop
 * shadow fading in shortly after, then (3) an infinite rotation once it
 * settles. All three groups currently share one rotation speed/direction
 * (the `gsap.to({ rotation: 360, duration: 36, ... })` call below) rather
 * than each spinning independently — each still needs its own
 * `transform-origin` at the shared disc center (see `originOf` below,
 * rather than each group's own bounding-box center) so the assembled disc
 * turns as one piece around that shared point instead of each cluster
 * swinging off to its own side. The rotation tween uses `ease: 'none'`
 * (not the fly-in's `power3.out`) since it repeats forever — any
 * non-linear ease would visibly decelerate to a stop and snap back to
 * speed at each loop boundary instead of spinning at a constant rate.
 */
const DISC_CANVAS = { width: 1379, height: 1393 }
/** Target alpha for the disc groups' drop-shadow once fully faded in
 * (or applied instantly under reduced motion) — see `styles.module.css`'s
 * `--disc-shadow-opacity`-driven `filter: drop-shadow(...)`. */
const DISC_SHADOW_OPACITY = 0.5
const DISC_GROUPS = [
  {
    src: '/assets/disc-ring-floral.svg',
    x: 0,
    y: 132,
    width: 914,
    height: 789,
  },
  {
    src: '/assets/disc-ring-blue-tile.svg',
    x: 839,
    y: 0,
    width: 540,
    height: 1081,
  },
  {
    src: '/assets/disc-ring-stone.svg',
    x: 256,
    y: 667,
    width: 960,
    height: 726,
  },
] as const

/**
 * Each group's own bounding box is off-center within the shared disc canvas,
 * so rotating it about its default origin (its own center) would swing the
 * cluster off to one side instead of orbiting the disc. Expressing the
 * canvas's center as a percentage of the group's own box (which can fall
 * outside 0-100%, a valid CSS transform-origin value) makes every group spin
 * around the same shared point.
 */
function originOf(group: (typeof DISC_GROUPS)[number]) {
  const originX = ((DISC_CANVAS.width / 2 - group.x) / group.width) * 100
  const originY = ((DISC_CANVAS.height / 2 - group.y) / group.height) * 100
  return `${originX}% ${originY}%`
}

export function LandingHeroDisc() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Two conditions instead of one: the fly-in + spin only make sense
      // with motion allowed, but the drop-shadow itself is a static visual
      // (not motion) — reduced-motion users still get it, just applied
      // instantly instead of faded in.
      mm.add(
        {
          motionOK: '(prefers-reduced-motion: no-preference)',
          motionReduced: '(prefers-reduced-motion: reduce)',
        },
        context => {
          const { motionOK } = context.conditions as { motionOK: boolean }

          DISC_GROUPS.forEach((group, index) => {
            const target = `[data-disc-group="${index}"]`

            if (!motionOK) {
              gsap.set(target, { '--disc-shadow-opacity': DISC_SHADOW_OPACITY })
              return
            }

            gsap.fromTo(
              target,
              {
                opacity: 0,
                x: gsap.utils.random(-50, 100),
                y: gsap.utils.random(-50, 100),
                rotation: gsap.utils.random(-30, 30),
                scale: 0.9,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 1.8,
                delay: index * 0.5,
                ease: 'power3.out',
              },
            )

            // Shadow fades in shortly after the fly-in settles (its delay
            // is index-staggered the same way), overlapping with the start
            // of the rotation tween below rather than alongside the fly-in.
            gsap.to(target, {
              '--disc-shadow-opacity': DISC_SHADOW_OPACITY,
              duration: 1.4,
              delay: 1.6 + index * 0.15,
              ease: 'power2.out',
            })

            gsap.to(target, {
              rotation: 360,
              duration: 36,
              delay: 2,
              repeat: -1,
              ease: 'none',
              force3D: true,
            })
          })
        },
      )

      return () => mm.revert()
    },
    { scope: container },
  )

  return (
    <div className={styles.LandingHeroDisc} aria-hidden="true" ref={container}>
      {DISC_GROUPS.map((group, index) => (
        <div
          key={group.src}
          data-disc-group={index}
          className={styles.LandingHeroDisc_group}
          style={{
            left: `${(group.x / DISC_CANVAS.width) * 100}%`,
            top: `${(group.y / DISC_CANVAS.height) * 100}%`,
            width: `${(group.width / DISC_CANVAS.width) * 100}%`,
            height: `${(group.height / DISC_CANVAS.height) * 100}%`,
            transformOrigin: originOf(group),
          }}
        >
          <Image src={group.src} alt="" fill priority className={styles.LandingHeroDisc_ring} />
        </div>
      ))}
    </div>
  )
}
