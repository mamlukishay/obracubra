/**
 * Timer state machine states
 * - idle: Waiting for spacebar, showing scramble
 * - holding: Spacebar held, timer red (not ready yet)
 * - ready: After 550ms hold, timer green (ready to start)
 * - running: Timer counting
 * - stopped: Timer stopped, showing result
 */
export type TimerState = 'idle' | 'holding' | 'ready' | 'running' | 'stopped'

/**
 * A single solve record
 */
export interface Solve {
  id: string
  time: number // Time in milliseconds
  scramble: string
  timestamp: Date
}

/**
 * Calculated statistics from solve history
 */
export interface Statistics {
  count: number
  best: number | null
  worst: number | null
  average: number | null
  ao5: number | null // Average of 5 (WCA-style: drop best & worst)
  ao12: number | null // Average of 12 (WCA-style: drop best & worst)
}
