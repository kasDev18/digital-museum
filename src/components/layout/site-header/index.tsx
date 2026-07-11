import Image from 'next/image'
import Link from 'next/link'
import { ArtifactaWordmark } from '@/components/ui/icons'
import styles from './styles.module.css'

export function SiteHeader() {
  return (
    <header className={styles.SiteHeader}>
      <Link href="/" className={styles.SiteHeader_link}>
        <Image src="/assets/logo-mark.svg" alt="" width={32} height={32} priority />
        <ArtifactaWordmark className={styles.SiteHeader_wordmark} />
        <span className="sr-only">Artifacta</span>
      </Link>
    </header>
  )
}
