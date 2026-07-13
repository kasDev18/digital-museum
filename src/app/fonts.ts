import { Noto_Sans, Patua_One, Playfair_Display } from 'next/font/google'

export const patuaOne = Patua_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-patua-one',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})

// Detail page body copy (contributor byline, pull-quote, description) per
// the PSD's own "story component" spec — distinct from `playfairDisplay`,
// which the PSD reserves for the title/headings. `700` is loaded
// alongside the default `400` for the audio player's bold time labels
// (the PSD's "Noto Sans Display" isn't a separate Google Fonts family —
// just this same font at a heavier weight).
export const notoSans = Noto_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})
