'use client'

import { GridViewIcon, ListViewIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import styles from './styles.module.css'

export type ViewMode = 'grid' | 'list'

export interface ViewSwitcherProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

/**
 * Pill-shaped Grid/List toggle for the List page (Epic 3, Story 3.4), per
 * `view switcher.png`'s dev-mode export: a gray "track" containing a cream
 * circle around the *current* mode's icon (a static indicator, not itself
 * interactive) alongside the *target* mode's icon + a "Switch to {target}"
 * label sitting directly on the track. Both live inside one `<button>`
 * rather than being split into two separately-clickable regions — there
 * are only two mutually exclusive states, so one larger toggle target
 * (simpler, more touch-friendly) covers the interaction without adding a
 * second tab stop.
 *
 * Not a WAI-ARIA "toggle button" (which pairs a *stable* label with
 * `aria-pressed` tracking an on/off state) — this button's own label
 * changes to name whichever view it's about to switch to, so
 * `aria-pressed` would announce a "pressed" state disconnected from what
 * the label just said (e.g. "Switch to grid, pressed" while already in
 * Grid view makes no sense). Same "label always names the next action"
 * shape as a play/pause button; the current mode is instead conveyed via
 * the indicator circle, and the label itself doubles as the accessible
 * name — no separate `aria-label`, so voice-control users can say what
 * they see (WCAG 2.5.3 Label in Name).
 */
export function ViewSwitcher({ viewMode, onChange, className }: ViewSwitcherProps) {
  const isGrid = viewMode === 'grid'
  const targetMode: ViewMode = isGrid ? 'list' : 'grid'
  const label = `Switch to ${targetMode}`
  const CurrentIcon = isGrid ? GridViewIcon : ListViewIcon
  const TargetIcon = isGrid ? ListViewIcon : GridViewIcon

  return (
    <button
      type="button"
      onClick={() => onChange(targetMode)}
      className={cn(styles.ViewSwitcher, className)}
    >
      <span className={styles.ViewSwitcher_indicator}>
        {/* No explicit `key` needed here: `CurrentIcon` is a different
            component (`GridViewIcon`/`ListViewIcon`) each time `isGrid`
            flips, so React already unmounts/remounts this element on its
            own — `.ViewSwitcher_icon`'s pop-in `animation` (not just a
            `transition`, which only animates a change on the *same*
            element) replays for free on every toggle. */}
        <CurrentIcon className={styles.ViewSwitcher_icon} />
      </span>
      {/* This span's own element type never changes (always a `<span>`),
          so unlike the icons above, it needs an explicit `key` to force a
          remount — otherwise React just patches the text node in place
          and the pop-in animation, tied to this element's mount, never
          replays. */}
      <span key={viewMode} className={styles.ViewSwitcher_action}>
        <TargetIcon className={styles.ViewSwitcher_icon} />
        {label}
      </span>
    </button>
  )
}
