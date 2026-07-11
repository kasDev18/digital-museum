import { CopyrightMark, XIcon, YoutubeIcon } from '@/components/ui/icons'
import { ThemeFontControls } from './components/theme-font-controls'
import styles from './styles.module.css'

const SOCIAL_LINKS = [
  { label: 'X (Twitter)', href: 'https://x.com/artifacta', Icon: XIcon },
  { label: 'YouTube', href: 'https://youtube.com/@artifacta', Icon: YoutubeIcon },
] as const

export function SiteFooter() {
  return (
    <footer className={styles.SiteFooter}>
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
