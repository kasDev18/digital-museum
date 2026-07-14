/**
 * Shared constants + the pre-hydration bootstrap script for the theme/font-scale
 * controls (Story 1.7). The same numbers back both the inline `<script>` that
 * applies the persisted preference before paint (avoiding a flash of the wrong
 * theme/size) and the `ThemeFontControls` lazy `useState` initializers that
 * read the same source afterwards — see
 * `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`
 * ("Syncing with React state") for why the two must agree instead of drifting.
 */

export const THEME_STORAGE_KEY = 'artifacta-theme'
export const FONT_SCALE_STORAGE_KEY = 'artifacta-font-scale'

/** The `.light` class name toggled on `<html>` (Story 1.2's opt-in light theme, `src/app/globals.css`). */
export const LIGHT_THEME_CLASS = 'light'

export const FONT_SCALE_MIN = 0.85
export const FONT_SCALE_MAX = 1.3
export const FONT_SCALE_STEP = 0.15
export const FONT_SCALE_DEFAULT = 1

/**
 * Clamps to bounds and rounds to 2 decimal places. The rounding isn't cosmetic:
 * repeated `+ FONT_SCALE_STEP` (0.15) accumulates IEEE-754 floating point error
 * (e.g. `1 + 0.15 + 0.15 + 0.15 === 1.2999999999999998`), which would make the
 * `>= FONT_SCALE_MAX` disabled-button check miss the true boundary by one click.
 */
export function clampFontScale(scale: number): number {
  const clamped = Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, scale))
  return Math.round(clamped * 100) / 100
}

/**
 * Runs synchronously before the rest of `<head>`/`<body>` paints. Reads
 * `localStorage` directly (no React, no imports) and applies the `.light`
 * class + `--font-scale` custom property so the very first paint already
 * matches the visitor's saved preference instead of flashing the dark-navy
 * default. Keep the clamp logic here in sync with `clampFontScale` above —
 * this string runs standalone and can't import it.
 */
export const THEME_INIT_SCRIPT = `(function () {
  try {
    var root = document.documentElement
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}')
    if (theme === 'light') {
      root.classList.add('${LIGHT_THEME_CLASS}')
    }
    var storedScale = parseFloat(localStorage.getItem('${FONT_SCALE_STORAGE_KEY}'))
    if (!isNaN(storedScale)) {
      var scale = Math.min(${FONT_SCALE_MAX}, Math.max(${FONT_SCALE_MIN}, storedScale))
      root.style.setProperty('--font-scale', String(Math.round(scale * 100) / 100))
    }
  } catch (e) {}
})();`

export const THEME_TOGGLE_BUTTON_ID = 'theme-toggle-button'
export const DECREASE_FONT_BUTTON_ID = 'decrease-font-button'
export const INCREASE_FONT_BUTTON_ID = 'increase-font-button'

/**
 * `ThemeFontControls`'s lazy `useState` initializers read `localStorage` on
 * the client during hydration, same as `THEME_INIT_SCRIPT` — but SSR always
 * renders assuming the *default* theme/scale (no `window` on the server), so
 * a returning visitor with a saved non-default preference gets a
 * `disabled`/`aria-pressed`/`aria-label` mismatch between what the server
 * rendered and what the client computes. `THEME_INIT_SCRIPT` can't fix this
 * itself — it runs in `<head>`, before these buttons exist in the DOM.
 * Render this script as this component's own last child instead (after the
 * buttons, so `getElementById` finds them) to patch the same attributes
 * before hydration's comparison runs, exactly like `THEME_INIT_SCRIPT` does
 * for the theme class + font-scale variable.
 */
export const CONTROLS_SYNC_SCRIPT = `(function () {
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}')
    if (theme === 'light') {
      var themeBtn = document.getElementById('${THEME_TOGGLE_BUTTON_ID}')
      if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', 'true')
        themeBtn.setAttribute('aria-label', 'Switch to dark theme')
      }
    }
    var storedScale = parseFloat(localStorage.getItem('${FONT_SCALE_STORAGE_KEY}'))
    if (!isNaN(storedScale)) {
      var scale = Math.min(${FONT_SCALE_MAX}, Math.max(${FONT_SCALE_MIN}, storedScale))
      if (scale <= ${FONT_SCALE_MIN}) {
        var decBtn = document.getElementById('${DECREASE_FONT_BUTTON_ID}')
        if (decBtn) decBtn.disabled = true
      }
      if (scale >= ${FONT_SCALE_MAX}) {
        var incBtn = document.getElementById('${INCREASE_FONT_BUTTON_ID}')
        if (incBtn) incBtn.disabled = true
      }
    }
  } catch (e) {}
})();`
