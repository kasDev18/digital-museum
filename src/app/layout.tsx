import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { THEME_INIT_SCRIPT } from '@/lib/theme-script'
import { patuaOne, playfairDisplay } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Artifacta — Objects, Voices and Global Journeys',
  description:
    'A digital museum exploring identity through cultural artifacts in a world shaped by migration.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${patuaOne.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
