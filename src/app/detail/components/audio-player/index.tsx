'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { PauseIcon, PlayIcon } from '@/components/ui/icons'
import styles from './styles.module.css'

export interface AudioPlayerProps {
  audioUrl: string | null
  /** Seeds the "total" side of the `m:ss / m:ss` display before the browser has loaded the real `<audio>` metadata, so the label doesn't flash `0:00` first. */
  durationSeconds?: number
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const secs = whole % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Detail page audio player. Story 5.1's own layout AC requires this
 * control to appear in the description stack even before Story 5.3 (its
 * own dedicated story) builds the mock's exact tick-mark waveform scrubber
 * and mute toggle — this is a deliberately minimal but fully working
 * stand-in: native HTML5 `<audio>` playback, a play/pause toggle, and a
 * real seekable progress bar with `m:ss` elapsed/total labels, so the
 * layout never ships a dead or unstyled placeholder in that slot. See
 * `deferred-work.md` for exactly what Story 5.3 still owns on top of this.
 *
 * `audioUrl: null` (roughly a third of the mock dataset — e.g. Carnival
 * Mask, Beaded Gown) renders a visually-present but disabled state — a
 * `disabled` flag threaded through one shared render below rather than a
 * second, hand-duplicated JSX branch — matching Story 5.3's own AC that
 * this control stays visible either way.
 *
 * The native `<input type="range">` scrubber is used instead of a
 * hand-rolled click-to-seek element — it's draggable, clickable, and
 * keyboard-operable (arrow keys) for free, which a custom
 * pointer-coordinate implementation would have to reimplement from
 * scratch to match.
 */
export function AudioPlayer({ audioUrl, durationSeconds }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(durationSeconds ?? 0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    // `isPlaying` is derived entirely from the element's own `play`/`pause`
    // events, not set optimistically inside `handleToggle` below — `play()`
    // returns a promise that can reject well after the click handler
    // returns (e.g. the mock dataset's still-unbacked audio files, see
    // deferred-work.md, reject with a `NotSupportedError`), and an
    // optimistic toggle left the button stuck showing "Pause" forever with
    // no audio actually playing and no later event to correct it.
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  const disabled = !audioUrl

  const handleToggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      // Only ever fires from this direct click handler — never on mount or
      // any other effect — so this stays within the "no autoplay, requires
      // a user gesture" AC. Deliberately not awaited/`.catch()`-handled: a
      // rejection just means the `play`/`pause` listeners above never see a
      // `play` event, so `isPlaying` correctly never flips to true.
      void audio.play()
    }
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    const value = Number(event.target.value)
    if (audio) audio.currentTime = value
    setCurrentTime(value)
  }

  return (
    <div className={styles.AudioPlayer} data-disabled={disabled || undefined}>
      {/* Omitted entirely (not just hidden) for `audioUrl: null` — same
          "never render a dead element" convention as MediaCarousel's own
          `More Images` button, so there's no real `<audio>` node for a
          disabled player to ever have to account for. */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={
          disabled
            ? 'No audio commentary available for this artifact'
            : isPlaying
              ? 'Pause audio'
              : 'Play audio'
        }
        className={styles.AudioPlayer_toggle}
      >
        {isPlaying ? (
          <PauseIcon className={styles.AudioPlayer_icon} />
        ) : (
          <PlayIcon className={styles.AudioPlayer_icon} />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={handleSeek}
        disabled={disabled || duration === 0}
        aria-label="Seek audio position"
        className={styles.AudioPlayer_track}
      />
      <span className={styles.AudioPlayer_time}>
        {disabled ? '--:-- / --:--' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </span>
    </div>
  )
}
