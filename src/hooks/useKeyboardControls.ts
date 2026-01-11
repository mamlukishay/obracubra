import { useEffect, useRef, useCallback } from 'react'
import type { TimerState } from '@/types'

const HOLD_THRESHOLD_MS = 550

interface UseKeyboardControlsOptions {
  timerState: TimerState
  onHoldStart: () => void
  onReady: () => void
  onRelease: () => void
  onStop: () => void
  enabled?: boolean
}

/**
 * Hook for handling spacebar (desktop) and touch (mobile) controls
 * Implements WCA-style hold-to-start behavior with 550ms threshold
 */
export function useKeyboardControls({
  timerState,
  onHoldStart,
  onReady,
  onRelease,
  onStop,
  enabled = true,
}: UseKeyboardControlsOptions) {
  const holdTimeoutRef = useRef<number | null>(null)
  const isHoldingRef = useRef(false)

  // Use refs to keep callbacks and state stable for the event listeners
  const stateRef = useRef(timerState)
  const onHoldStartRef = useRef(onHoldStart)
  const onReadyRef = useRef(onReady)
  const onReleaseRef = useRef(onRelease)
  const onStopRef = useRef(onStop)

  // Update refs when props change
  useEffect(() => {
    stateRef.current = timerState
    onHoldStartRef.current = onHoldStart
    onReadyRef.current = onReady
    onReleaseRef.current = onRelease
    onStopRef.current = onStop
  }, [timerState, onHoldStart, onReady, onRelease, onStop])

  const clearHoldTimeout = useCallback(() => {
    if (holdTimeoutRef.current !== null) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
  }, [])

  const handleHoldStart = useCallback(() => {
    if (isHoldingRef.current) return
    isHoldingRef.current = true

    const state = stateRef.current
    if (state === 'idle' || state === 'stopped') {
      onHoldStartRef.current()
      // Set timeout for ready state
      holdTimeoutRef.current = window.setTimeout(() => {
        onReadyRef.current()
      }, HOLD_THRESHOLD_MS)
    } else if (state === 'running') {
      onStopRef.current()
    }
  }, [])

  const handleHoldEnd = useCallback(() => {
    if (!isHoldingRef.current) return
    isHoldingRef.current = false
    clearHoldTimeout()

    const state = stateRef.current
    if (state === 'holding') {
      // Released too early, go back to idle
      onReleaseRef.current()
    } else if (state === 'ready') {
      // Released while ready, start timer
      onReleaseRef.current()
    } else if (state === 'stopped') {
      // Generate new scramble and go to idle
      onReleaseRef.current()
    }
  }, [clearHoldTimeout])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current
      if (e.code === 'Space') {
        e.preventDefault()
        if (!e.repeat) {
          handleHoldStart()
        }
      } else if (state === 'running') {
        // Any key stops the timer
        e.preventDefault()
        onStopRef.current()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleHoldEnd()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const state = stateRef.current
      // Prevent default only when timer is idle or running to allow scrolling in history
      if (state === 'idle' || state === 'running' || state === 'stopped') {
        e.preventDefault()
      }
      handleHoldStart()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const state = stateRef.current
      if (state === 'holding' || state === 'ready' || state === 'stopped') {
        e.preventDefault()
      }
      handleHoldEnd()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      clearHoldTimeout()
    }
  }, [enabled, handleHoldStart, handleHoldEnd, clearHoldTimeout])
}
