import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerReturn {
  time: number
  isRunning: boolean
  start: () => void
  stop: () => number
  reset: () => void
}

/**
 * High-precision timer hook using requestAnimationFrame and performance.now()
 * Provides millisecond-accurate timing for speedcubing
 */
export function useTimer(): UseTimerReturn {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number>(0)
  const rafIdRef = useRef<number>(0)

  const tick = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current
    setTime(elapsed)
    rafIdRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(() => {
    startTimeRef.current = performance.now()
    setIsRunning(true)
    rafIdRef.current = requestAnimationFrame(tick)
  }, [tick])

  const stop = useCallback((): number => {
    cancelAnimationFrame(rafIdRef.current)
    const finalTime = performance.now() - startTimeRef.current
    setTime(finalTime)
    setIsRunning(false)
    return finalTime
  }, [])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current)
    setTime(0)
    setIsRunning(false)
    startTimeRef.current = 0
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  return { time, isRunning, start, stop, reset }
}
