/**
 * Format milliseconds to MM:SS.mmm display string
 * @param ms Time in milliseconds
 * @returns Formatted string like "01:23.456"
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor(ms % 1000)

  const pad = (n: number, digits: number): string => n.toString().padStart(digits, '0')

  // For times over an hour, show hours too
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${pad(hours, 2)}:${pad(mins, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`
  }

  return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`
}

/**
 * Format milliseconds to a shorter display (for history list)
 * @param ms Time in milliseconds
 * @returns Formatted string like "1:23.45" (without leading zeros on minutes)
 */
export function formatTimeShort(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10) // Only show 2 decimal places

  const pad = (n: number, digits: number): string => n.toString().padStart(digits, '0')

  if (minutes > 0) {
    return `${minutes}:${pad(seconds, 2)}.${pad(centiseconds, 2)}`
  }

  return `${seconds}.${pad(centiseconds, 2)}`
}
