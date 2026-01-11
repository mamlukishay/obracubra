import { useState, useCallback, useEffect } from 'react'
import type { Solve } from '@/types'

const API_URL = '/api'

/**
 * Hook for persisting solves to PostgreSQL via API
 */
export function useSolves(): [Solve[], (solves: Solve[] | ((prev: Solve[]) => Solve[])) => void, boolean] {
  const [solves, setSolves] = useState<Solve[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch solves from API on mount
  useEffect(() => {
    async function fetchSolves() {
      try {
        const response = await fetch(`${API_URL}/solves`)
        if (!response.ok) {
          throw new Error('Failed to fetch solves')
        }
        const data = await response.json()
        // Convert timestamp strings back to Date objects
        const solves = data.map((solve: Solve & { timestamp: string | Date }) => ({
          ...solve,
          timestamp: typeof solve.timestamp === 'string' ? new Date(solve.timestamp) : solve.timestamp,
        }))
        setSolves(solves)
      } catch (error) {
        console.error('Error fetching solves:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolves()
  }, [])

  const updateSolves = useCallback(async (value: Solve[] | ((prev: Solve[]) => Solve[])) => {
    const newSolves = typeof value === 'function' ? value(solves) : value
    const previousSolves = solves

    // Optimistically update UI
    setSolves(newSolves)

    try {
      // Determine what changed
      const added = newSolves.filter(ns => !previousSolves.some(ps => ps.id === ns.id))
      const removed = previousSolves.filter(ps => !newSolves.some(ns => ns.id === ps.id))

      // Handle additions
      for (const solve of added) {
        const response = await fetch(`${API_URL}/solves`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(solve),
        })
        if (!response.ok) {
          throw new Error('Failed to create solve')
        }
      }

      // Handle deletions
      for (const solve of removed) {
        const response = await fetch(`${API_URL}/solves/${solve.id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete solve')
        }
      }

      // Handle clear all (if newSolves is empty but previousSolves had items)
      if (newSolves.length === 0 && previousSolves.length > 0 && removed.length === previousSolves.length) {
        const response = await fetch(`${API_URL}/solves`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to clear solves')
        }
      }
    } catch (error) {
      console.error('Error updating solves:', error)
      // Revert on error
      setSolves(previousSolves)
    }
  }, [solves])

  return [solves, updateSolves, isLoading]
}
