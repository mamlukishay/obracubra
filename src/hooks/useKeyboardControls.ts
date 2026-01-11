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

  const clearHoldTimeout = useCallback(() => {
    if (holdTimeoutRef.current !== null) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
  }, [])

  const handleHoldStart = useCallback(() => {
    if (isHoldingRef.current) return
    isHoldingRef.current = true

    if (timerState === 'idle') {
      onHoldStart()
      // Set timeout for ready state
      holdTimeoutRef.current = window.setTimeout(() => {
        onReady()
      }, HOLD_THRESHOLD_MS)
    } else if (timerState === 'running') {
      onStop()
    } else if (timerState === 'stopped') {
      // Will transition to idle on release
    }
  }, [timerState, onHoldStart, onReady, onStop])

  const handleHoldEnd = useCallback(() => {
    if (!isHoldingRef.current) return
    isHoldingRef.current = false
    clearHoldTimeout()

    if (timerState === 'holding') {
      // Released too early, go back to idle
      onRelease()
    } else if (timerState === 'ready') {
      // Released while ready, start timer
      onRelease()
    } else if (timerState === 'stopped') {
      // Generate new scramble and go to idle
      onRelease()
    }
  }, [timerState, onRelease, clearHoldTimeout])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!e.repeat) {
          handleHoldStart()
        }
      } else if (timerState === 'running') {
        // Any key stops the timer
        e.preventDefault()
        onStop()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleHoldEnd()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      // Prevent default only when timer is idle or running to allow scrolling in history
      if (timerState === 'idle' || timerState === 'running' || timerState === 'stopped') {
        e.preventDefault()
      }
      handleHoldStart()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (timerState === 'holding' || timerState === 'ready' || timerState === 'stopped') {
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
  }, [enabled, timerState, handleHoldStart, handleHoldEnd, onStop, clearHoldTimeout])
}
