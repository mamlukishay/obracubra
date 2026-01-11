import { useState, useCallback, useEffect } from 'react'
import type { Solve } from '@/types'

const STORAGE_KEY = 'obracubra-solves'

/**
 * Serialize solves for localStorage (convert Date to ISO string)
 */
function serializeSolves(solves: Solve[]): string {
  return JSON.stringify(
    solves.map((solve) => ({
      ...solve,
      timestamp: solve.timestamp.toISOString(),
    }))
  )
}

/**
 * Deserialize solves from localStorage (convert ISO string to Date)
 */
function deserializeSolves(json: string): Solve[] {
  try {
    const parsed = JSON.parse(json)
    return parsed.map((solve: { id: string; time: number; scramble: string; timestamp: string }) => ({
      ...solve,
      timestamp: new Date(solve.timestamp),
    }))
  } catch {
    return []
  }
}

/**
 * Hook for persisting solves to localStorage
 */
export function useLocalStorage(): [Solve[], (solves: Solve[] | ((prev: Solve[]) => Solve[])) => void] {
  const [solves, setSolves] = useState<Solve[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY)
      return item ? deserializeSolves(item) : []
    } catch {
      return []
    }
  })

  // Update localStorage whenever solves change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, serializeSolves(solves))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [solves])

  const updateSolves = useCallback((value: Solve[] | ((prev: Solve[]) => Solve[])) => {
    setSolves(value)
  }, [])

  return [solves, updateSolves]
}
