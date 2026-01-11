interface ScrambleProps {
  scramble: string
}

/**
 * Display the current scramble sequence
 * Shows the scramble in a readable, centered format
 */
export function Scramble({ scramble }: ScrambleProps) {
  return (
    <div className="text-center px-4">
      <p className="text-lg md:text-xl font-mono text-muted-foreground tracking-wider">
        {scramble}
      </p>
    </div>
  )
}
