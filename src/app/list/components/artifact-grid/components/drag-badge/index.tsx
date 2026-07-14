import { forwardRef } from 'react'
import Image from 'next/image'
import styles from './styles.module.css'

export interface DragBadgeProps {
  x: number
  y: number
  variant: 'idle' | 'active'
}

/**
 * Cursor-following drag affordance for `ArtifactGridRow` (Story 4.1's
 * "Drag cursor affordance shown on hover/drag start" AC), per the Figma
 * `drag icon.png` export — a two-state sprite (idle "Drag" badge / active
 * hand-drag icon once a real drag is underway) cropped into
 * `public/assets/drag-badge-{idle,active}.png`. Mouse/pen only —
 * `ArtifactGridRow` never renders this for touch input: there's no hover
 * state to anchor a cursor-following badge to, and Story 4.5's own
 * touch-specific feedback (a dimming `opacity` + haptic tick) already
 * covers that input mode. `pointer-events: none` so the badge itself can
 * never intercept the drag/click it's illustrating, and `aria-hidden`
 * since it's a purely decorative pointer affordance with no information
 * not already available to keyboard/screen-reader users another way.
 *
 * Forwards its root node's ref so `ArtifactGridRow` can write `transform`
 * to it directly on every `pointermove` instead of round-tripping the
 * cursor position through React state on every pixel of movement — see
 * that component's own comment on `handlePointerMove` for why.
 */
export const DragBadge = forwardRef<HTMLDivElement, DragBadgeProps>(function DragBadge(
  { x, y, variant },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={styles.DragBadge}
      style={{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }}
    >
      <Image
        src={variant === 'idle' ? '/assets/drag-badge-idle.png' : '/assets/drag-badge-active.png'}
        alt=""
        fill
        sizes="64px"
        className={styles.DragBadge_image}
      />
    </div>
  )
})
