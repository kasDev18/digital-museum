import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtifactById } from '@/lib/data-utils'
import { DetailPlaceholder } from '@/app/detail/components/detail-placeholder'

interface DetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params
  const artifact = getArtifactById(id)

  // The `!artifact` branch's title is never actually rendered — confirmed
  // via a direct request — since the page body below calls `notFound()`
  // for that same case, and Next.js uses `app/not-found.tsx`'s own
  // `metadata` export for that render instead of this segment's. Kept
  // anyway so this function is total or a valid `Metadata` regardless of
  // whether `artifact` resolves.
  return {
    title: artifact ? `${artifact.title} — Artifacta` : 'Artifact Not Found — Artifacta',
  }
}

/**
 * Detail page route (Epic 3, Story 3.5): `/detail/[id]`, wired up from
 * every `ArtifactThumbnail` (grid card, list row, and its "Explore Story"
 * link — Story 3.1). An unknown `id` calls `notFound()` rather than
 * rendering nothing, which renders the site's own `app/not-found.tsx`
 * (full header/footer chrome) instead of Next's bare default 404.
 */
export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const artifact = getArtifactById(id)

  if (!artifact) {
    notFound()
  }

  return <DetailPlaceholder artifact={artifact} />
}
