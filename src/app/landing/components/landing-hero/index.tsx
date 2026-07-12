import styles from './styles.module.css'
import { LandingHeroDisc } from '../landing-hero-disc'
import { LandingHeroContentReveal } from '../landing-hero-content-reveal'

export function LandingHero() {
  return (
    <section className={styles.LandingHero}>
      <LandingHeroDisc />

      <LandingHeroContentReveal className={styles.LandingHero_content}>
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
      </LandingHeroContentReveal>
    </section>
  )
}
