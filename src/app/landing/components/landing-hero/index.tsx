import Image from 'next/image'
import styles from './styles.module.css'

/**
 * The three texture-cluster groups exported from Figma ("Mask group 1/2/3"),
 * each tightly cropped to its own content. Their `x`/`y`/`width`/`height`
 * are pixel positions within the original 1379x1393 disc composition,
 * recovered by aligning each export against the full disc render (there's
 * no positional metadata in a standalone SVG export) — expressed below as
 * percentages of that shared canvas so they scale with the responsive disc
 * container.
 */
const DISC_CANVAS = { width: 1379, height: 1393 }
const DISC_GROUPS = [
  { src: '/assets/disc-ring-floral.svg', x: 0, y: 132, width: 914, height: 789 },
  { src: '/assets/disc-ring-blue-tile.svg', x: 839, y: 0, width: 540, height: 1081 },
  { src: '/assets/disc-ring-stone.svg', x: 256, y: 667, width: 960, height: 726 },
] as const

export function LandingHero() {
  return (
    <section className={styles.LandingHero}>
      <div className={styles.LandingHero_disc} aria-hidden="true">
        {DISC_GROUPS.map(group => (
          <div
            key={group.src}
            className={styles.LandingHero_discGroup}
            style={{
              left: `${(group.x / DISC_CANVAS.width) * 100}%`,
              top: `${(group.y / DISC_CANVAS.height) * 100}%`,
              width: `${(group.width / DISC_CANVAS.width) * 100}%`,
              height: `${(group.height / DISC_CANVAS.height) * 100}%`,
            }}
          >
            <Image src={group.src} alt="" fill priority className={styles.LandingHero_discRing} />
          </div>
        ))}
      </div>

      <div className={styles.LandingHero_content}>
        <div className={styles.LandingHero_titleBlock}>
          <h1 className={styles.LandingHero_headline}>
            Objects, Voices
            <br />
            and Global
            <br />
            Journeys
          </h1>
          <p className={styles.LandingHero_subtext}>
            Exploring identity through objects in a world shaped by migration.
          </p>
        </div>
        <button type="button" className={styles.LandingHero_cta}>
          Enter Exhibition
        </button>
      </div>
    </section>
  )
}
