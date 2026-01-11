import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { formatTimeShort } from '@/utils/timeFormatter'
import type { Solve } from '@/types'

interface HistoryProps {
  solves: Solve[]
  onDelete: (id: string) => void
}

/**
 * Display history of past solves in a scrollable list
 */
export function History({ solves, onDelete }: HistoryProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">History</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full max-h-[300px] md:max-h-[400px]">
          <div className="px-4 pb-4 space-y-1">
            {solves.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No solves yet
              </p>
            ) : (
              solves.map((solve, index) => (
                <div
                  key={solve.id}
                  className="flex items-center justify-between py-1 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs w-6 text-right">
                      {solves.length - index}.
                    </span>
                    <span className="font-mono text-sm">{formatTimeShort(solve.time)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(solve.id)
                    }}
                  >
                    <span className="text-destructive">×</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
