'use client'

import { useState } from 'react'
import { DecreaseFontIcon, IncreaseFontIcon, MoonIcon } from '@/components/ui/icons'
import {
  clampFontScale,
  CONTROLS_SYNC_SCRIPT,
  DECREASE_FONT_BUTTON_ID,
  FONT_SCALE_DEFAULT,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  FONT_SCALE_STORAGE_KEY,
  INCREASE_FONT_BUTTON_ID,
  LIGHT_THEME_CLASS,
  THEME_STORAGE_KEY,
  THEME_TOGGLE_BUTTON_ID,
} from '@/lib/theme-script'
import type { Theme } from '@/types/theme'
import styles from './styles.module.css'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

function readStoredFontScale(): number {
  if (typeof window === 'undefined') return FONT_SCALE_DEFAULT
  const stored = parseFloat(localStorage.getItem(FONT_SCALE_STORAGE_KEY) ?? '')
  return isNaN(stored) ? FONT_SCALE_DEFAULT : clampFontScale(stored)
}

/**
 * Uses lazy `useState` initializers reading the same `localStorage` keys the
 * pre-hydration bootstrap script (`THEME_INIT_SCRIPT`) already applied to the
 * DOM, per the Next.js guide on preventing a flash before hydration
 * (`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`,
 * "Syncing with React state") — both read from the same source, so they
 * always agree and React's initial client render matches the DOM without a
 * `useEffect` + `setState` round trip.
 */
export function ThemeFontControls() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)
  const [fontScale, setFontScale] = useState<number>(readStoredFontScale)

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle(LIGHT_THEME_CLASS, next === 'light')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // localStorage unavailable (e.g. private browsing) — theme still applies for this session
    }
    setTheme(next)
  }

  function adjustFontScale(delta: number) {
    const next = clampFontScale(fontScale + delta)
    document.documentElement.style.setProperty('--font-scale', String(next))
    try {
      localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(next))
    } catch {
      // localStorage unavailable (e.g. private browsing) — scale still applies for this session
    }
    setFontScale(next)
  }

  return (
    <div className={styles.ThemeFontControls}>
      <button
        type="button"
        id={THEME_TOGGLE_BUTTON_ID}
        onClick={toggleTheme}
        aria-pressed={theme === 'light'}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className={styles.ThemeFontControls_themeBtn}
      >
        <MoonIcon className={styles.ThemeFontControls_themeIcon} />
      </button>
      <div className={styles.ThemeFontControls_slider} aria-hidden="true" />
      <button
        type="button"
        id={INCREASE_FONT_BUTTON_ID}
        onClick={() => adjustFontScale(FONT_SCALE_STEP)}
        disabled={fontScale >= FONT_SCALE_MAX}
        aria-label="Increase text size"
        className={styles.ThemeFontControls_fontBtn}
      >
        <IncreaseFontIcon className={styles.ThemeFontControls_themeIcon} />
      </button>
      <button
        type="button"
        id={DECREASE_FONT_BUTTON_ID}
        onClick={() => adjustFontScale(-FONT_SCALE_STEP)}
        disabled={fontScale <= FONT_SCALE_MIN}
        aria-label="Decrease text size"
        className={styles.ThemeFontControls_fontBtn}
      >
        <DecreaseFontIcon className={styles.ThemeFontControls_themeIcon} />
      </button>
      <script dangerouslySetInnerHTML={{ __html: CONTROLS_SYNC_SCRIPT }} />
    </div>
  )
}
