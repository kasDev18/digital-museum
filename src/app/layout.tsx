import type { Metadata } from 'next'
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
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
