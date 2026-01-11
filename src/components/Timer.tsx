import { cn } from '@/lib/utils'
import { formatTime } from '@/utils/timeFormatter'
import type { TimerState } from '@/types'

interface TimerProps {
  time: number
  state: TimerState
}

/**
 * Large timer display with color states
 * - idle: default color
 * - holding: red (not ready yet)
 * - ready: green (ready to start)
 * - running: green (counting)
 * - stopped: default color
 */
export function Timer({ time, state }: TimerProps) {
  const getInstructionText = (): string => {
    switch (state) {
      case 'idle':
        return 'Hold SPACE to start'
      case 'holding':
        return 'Keep holding...'
      case 'ready':
        return 'Release to start!'
      case 'running':
        return ''
      case 'stopped':
        return 'Press SPACE for next solve'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={cn(
          'font-mono text-7xl md:text-9xl font-bold tabular-nums transition-colors duration-150 select-none',
          state === 'idle' && 'text-foreground',
          state === 'holding' && 'text-red-500',
          state === 'ready' && 'text-green-500',
          state === 'running' && 'text-green-500',
          state === 'stopped' && 'text-foreground'
        )}
      >
        {formatTime(time)}
      </div>
      <p className="text-muted-foreground text-sm md:text-base h-6">
        {getInstructionText()}
      </p>
    </div>
  )
}
