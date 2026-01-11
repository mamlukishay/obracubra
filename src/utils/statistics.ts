import type { Solve, Statistics } from '@/types'

/**
 * Calculate WCA-style average of N
 * Drops the best and worst times, averages the rest
 * @param times Array of times in milliseconds
 * @returns Average or null if not enough times
 */
function calculateAverageOfN(times: number[]): number | null {
  if (times.length < 3) return null

  // Sort and remove best and worst
  const sorted = [...times].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, -1) // Remove first (best) and last (worst)

  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length
}

/**
 * Calculate statistics from solve history
 * @param solves Array of solve records
 * @returns Statistics object
 */
export function calculateStatistics(solves: Solve[]): Statistics {
  if (solves.length === 0) {
    return {
      count: 0,
      best: null,
      worst: null,
      average: null,
      ao5: null,
      ao12: null,
    }
  }

  const times = solves.map((s) => s.time)

  // Basic stats
  const best = Math.min(...times)
  const worst = Math.max(...times)
  const average = times.reduce((a, b) => a + b, 0) / times.length

  // Ao5 (last 5 solves)
  const ao5 = solves.length >= 5 ? calculateAverageOfN(times.slice(0, 5)) : null

  // Ao12 (last 12 solves)
  const ao12 = solves.length >= 12 ? calculateAverageOfN(times.slice(0, 12)) : null

  return {
    count: solves.length,
    best,
    worst,
    average,
    ao5,
    ao12,
  }
}
