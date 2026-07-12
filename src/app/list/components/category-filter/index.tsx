'use client'

import type { ArtifactTypeFilter } from '@/lib/data-utils'
import { cn } from '@/lib/utils'
import styles from './styles.module.css'

export interface CategoryFilterProps {
  categories: ArtifactTypeFilter[]
  selected: ArtifactTypeFilter
  onChange: (category: ArtifactTypeFilter) => void
  className?: string
}

/**
 * Category filter bar for the List page (Story 4.2), per `categories
 * bar.png`'s dev-mode export: a gray pill "track" (the same one
 * `ViewSwitcher`, Story 3.4, uses) holding every category as plain text,
 * with the *currently selected* one set apart in its own cream pill.
 *
 * Not a WAI-ARIA "radiogroup" — that pattern expects roving-tabindex
 * arrow-key navigation between options, which this bar doesn't implement
 * (each button is its own separate tab stop, simple Tab/Shift+Tab like any
 * other button group). `role="group"` + `aria-pressed` on each button
 * describes the actual keyboard behavior instead of promising a stronger
 * one it doesn't deliver — same "don't claim ARIA semantics you haven't
 * built the interaction model for" call `ViewSwitcher` makes about the
 * toggle-button pattern.
 */
export function CategoryFilter({ categories, selected, onChange, className }: CategoryFilterProps) {
  return (
    <div className={cn(styles.CategoryFilter, className)}>
      <div
        className={styles.CategoryFilter_track}
        role="group"
        aria-label="Filter artifacts by category"
      >
        {categories.map(category => {
          const isSelected = category === selected

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(category)}
              className={cn(
                styles.CategoryFilter_item,
                isSelected && styles.CategoryFilter_item_selected,
              )}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
