# Story 5.3: Add Audio Controls (Play/Pause/Listen)

**Epic:** Epic 5 - Details Page (Stretch/Optional)
**Status:** Done
**Priority:** Low (Stretch)
**Story Points:** 2

## User Story

**As a** visitor
**I want to** listen to audio commentary or sound associated with the artifact
**So that** I can have an auditory experience of the artifact

## Acceptance Criteria

- [x] Audio control component matches Figma design (play/pause/listen icons) — circular
      play/pause toggle (pre-existing from Story 5.1) plus the mock's tick-mark
      waveform-style scrubber and a mute/unmute speaker toggle (both new this story);
      see `EPICS_AND_STORIES.md`'s own fuller AC list for this story, which this
      implementation follows exactly
- [x] Play/pause button toggles audio playback (pre-existing, Story 5.1)
- [x] Audio progress is indicated (progress bar or time display) — pre-existing `m:ss / m:ss`
      labels, now paired with the new tick-mark waveform visualization
- [x] Component is visually present even if audioUrl is null (stubbed) (pre-existing)
- [x] If audioUrl is null, button shows disabled or placeholder state — extended to the
      new mute button too
- [x] Audio controls are accessible (keyboard navigable, proper ARIA labels) — mute button
      follows the same `aria-label`-names-the-next-action convention as the play/pause
      toggle
- [x] Audio playback is smooth and does not block UI (pre-existing)

## Technical Notes

- Use HTML5 Audio API or a library
- Match Figma design for controls (play, pause, listen icons)
- Handle missing audio gracefully (disabled state or hidden)
- Consider custom audio player for consistent styling
- Ensure audio doesn't autoplay (user interaction required)

## Implementation Tasks

1. Create AudioControls component
2. Implement play/pause functionality
3. Add audio progress indicator
4. Handle missing audioUrl gracefully
5. Match Figma design for controls
6. Add accessibility features
7. Test audio playback
8. Ensure smooth UI during audio playback

## Dependencies

- Story 5.1: Build Detail Page Layout

## Blocked By

- Story 5.1: Build Detail Page Layout
- **Epic 1-4 completion required before starting Epic 5**

## Blocking

- Story 5.4: Add Zoom Controls (Zoom In/Out)

## Definition of Done

- [x] All acceptance criteria met
- [x] Audio controls work smoothly
- [x] Handles missing audio gracefully
- [ ] Code committed to repository — left uncommitted/unstaged at the implementer's
      explicit request for this pass; ready to commit
- [x] No console errors or warnings (new — see Implementation Summary for the one
      pre-existing, unrelated console item this story's own testing still exercises)

## Note

This is a stretch story. Only implement if Epics 1-4 are complete and time permits before the deadline.

## Implementation Summary

**Status:** ✅ Done
**Implementation Date:** 2026-07-14
**Actual Implementation:**

- Builds directly on Story 5.1's minimal `AudioPlayer` stand-in
  (`src/app/detail/components/audio-player`) rather than replacing it — that
  component's own doc comment explicitly anticipated this story adding the
  mock's tick-mark waveform scrubber and a mute/unmute toggle on top of its
  existing play/pause + seekable range + `m:ss` labels foundation.
- **Waveform scrubber:** a row of 32 evenly-spaced decorative `<span>` ticks
  (`AudioPlayer_waveformTick`) rendered behind the existing native
  `<input type="range">`, whose "played" count tracks `currentTime`/`duration`
  — a stylized readout per the story's own Technical Notes ("evenly-spaced
  ticks... not real waveform analysis"), not an analysis of the actual audio
  signal. The range input itself stays the one real interactive element:
  restyled fully transparent (both `-webkit-slider-thumb`/`-moz-range-thumb`
  and their track counterparts) and positioned directly over the ticks, so
  dragging, clicking, and keyboard seeking all keep working exactly as
  before — only the visual layer changed.
- **Mute/unmute toggle:** a new small icon button next to the time label,
  driving `audio.muted` directly and mirroring it into `isMuted` state for
  the icon swap (`SoundOnIcon`/`SoundOffIcon`, both new in
  `src/components/ui/icons.tsx`, following this file's existing
  `viewBox="0 0 40 40"` + `stroke="currentColor"` convention). No separate
  volume level — matches the mock's two-state `sound.png` asset rather than
  a slider. Disabled together with the rest of the player for
  `audioUrl: null` artifacts, with the same shared `aria-label` explaining
  why.
- **Accessibility:** the mute button's `aria-label` follows the project's
  existing "name the next action" toggle convention (`"Mute audio"` /
  `"Unmute audio"`, matching the play/pause toggle's own
  `"Play audio"`/`"Pause audio"` pattern) rather than `aria-pressed`. The
  waveform ticks are `aria-hidden` — purely decorative, with the real
  seek affordance still on the range input's own
  `aria-label="Seek audio position"`.
- **Deliberately not touched:** the "Listen to his story…" copy-as-CTA
  suggestion in this story's own (and `EPICS_AND_STORIES.md`'s) AC is a
  content/copywriting call about the mock data's description text, not a
  component behavior — none of the 12 mock artifacts' descriptions currently
  use that phrasing, and rewriting artifact copy is outside a component-level
  pass like this one. Flagged here rather than guessed at.
- Verified via Playwright (headless Chromium) against `mshatta-facade`
  (`audioUrl` set) and `carnival-mask` (`audioUrl: null`): waveform renders
  32 ticks, mute toggle flips its `aria-label` and icon on click, and the
  disabled state on `carnival-mask` correctly disables both the play/pause
  and mute buttons with the shared "No audio commentary available" label.
  `pnpm lint`, `pnpm build` (TypeScript + Next.js production build), and
  `prettier --check` all pass clean.

**Follow-up (same day):** the user shared the actual Mshatta Façade detail
mock screenshot, confirming the white player-pill chrome initially deferred
above really is the intended design. `AudioPlayer` was restyled to match:
a fixed white rounded-full pill (`bg-white`) regardless of site theme, a
solid navy play/pause circle (`bg-navy text-white`), navy waveform ticks
and time label (`text-navy`), and a navy mute icon — using the same
`bg-navy`/`text-navy` Tailwind theme-color utilities already established
elsewhere in this codebase (`not-found.module.css`, `ViewSwitcher`,
`CategoryFilter`), not new one-off colors. This is a fixed, non-theme-
following surface by design (same reasoning `MediaCarousel`'s dark-on-white
overlays already document, applied here for a different cause: a
deliberate "white card" element, not photo-content unpredictability) — it
renders identically in both the light and dark site themes, confirmed via
Playwright screenshots of both.

**Final review pass (same day):** an 8-angle adversarial review ran against
the full diff before commit and caught two real regressions introduced
during the mock-matching restyle above, both fixed immediately: the
play/pause toggle had shrunk from a uniform 40px touch target to 36px on
mobile (reverted to `h-10 w-10`), and the seek scrubber's
`focus-visible` outline never actually rendered — `outline-none` sets
Tailwind v4's `--tw-outline-style` variable to `none` on the element, and
`focus-visible:outline-2` only reads that variable rather than resetting
it, so the ring stayed invisible even once focused (fixed by using
`outline-0` instead — zero width, but leaves the style variable at its
default `solid`). The review also found `MediaCarousel`'s own pre-existing
focus ring (Story 5.2, untouched by this pass) has the identical bug —
see `deferred-work.md` for that flagged-but-not-fixed follow-up.

**Deferred (see `deferred-work.md`):** the pre-existing gap of every mock
`audioUrl` 404ing (unbacked audio files) remains — this story's mute/
waveform/pill additions were built and verified against that same known-
broken playback, same as Story 5.1's original pass.
