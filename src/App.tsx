import { useState, useCallback, useMemo } from 'react'
import { Timer } from '@/components/Timer'
import { Scramble } from '@/components/Scramble'
import { History } from '@/components/History'
import { Statistics } from '@/components/Statistics'
import { useTimer } from '@/hooks/useTimer'
import { useKeyboardControls } from '@/hooks/useKeyboardControls'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { generateScramble } from '@/utils/scrambleGenerator'
import { calculateStatistics } from '@/utils/statistics'
import type { TimerState, Solve } from '@/types'

function App() {
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [currentScramble, setCurrentScramble] = useState(() => generateScramble())
  const [solves, setSolves] = useLocalStorage()
  const { time, start, stop, reset } = useTimer()

  // Calculate statistics from solves
  const stats = useMemo(() => calculateStatistics(solves), [solves])

  // State machine handlers
  const handleHoldStart = useCallback(() => {
    if (timerState === 'idle') {
      setTimerState('holding')
    }
  }, [timerState])

  const handleReady = useCallback(() => {
    if (timerState === 'holding') {
      setTimerState('ready')
    }
  }, [timerState])

  const handleRelease = useCallback(() => {
    if (timerState === 'holding') {
      // Released too early, go back to idle
      setTimerState('idle')
    } else if (timerState === 'ready') {
      // Start the timer
      reset()
      start()
      setTimerState('running')
    } else if (timerState === 'stopped') {
      // Generate new scramble and go to idle
      setCurrentScramble(generateScramble())
      reset()
      setTimerState('idle')
    }
  }, [timerState, reset, start])

  const handleStop = useCallback(() => {
    if (timerState === 'running') {
      const finalTime = stop()
      // Save the solve
      const newSolve: Solve = {
        id: crypto.randomUUID(),
        time: finalTime,
        scramble: currentScramble,
        timestamp: new Date(),
      }
      setSolves((prev) => [newSolve, ...prev])
      setTimerState('stopped')
    }
  }, [timerState, stop, currentScramble, setSolves])

  // Handle solve deletion
  const handleDelete = useCallback(
    (id: string) => {
      setSolves((prev) => prev.filter((s) => s.id !== id))
    },
    [setSolves]
  )

  // Setup keyboard/touch controls
  useKeyboardControls({
    timerState,
    onHoldStart: handleHoldStart,
    onReady: handleReady,
    onRelease: handleRelease,
    onStop: handleStop,
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          {/* Main Timer Area */}
          <main className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] gap-8">
            <Scramble scramble={currentScramble} />
            <Timer time={time} state={timerState} />
          </main>

          {/* Sidebar */}
          <aside className="space-y-4">
            <Statistics stats={stats} />
            <History solves={solves} onDelete={handleDelete} />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
