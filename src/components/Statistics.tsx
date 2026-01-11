import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTimeShort } from '@/utils/timeFormatter'
import type { Statistics as StatsType } from '@/types'

interface StatisticsProps {
  stats: StatsType
}

/**
 * Display solve statistics in a card
 */
export function Statistics({ stats }: StatisticsProps) {
  const formatStat = (value: number | null): string => {
    if (value === null) return '-'
    return formatTimeShort(value)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Solves</span>
          <span className="font-mono">{stats.count}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Best</span>
          <span className="font-mono text-green-500">{formatStat(stats.best)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Worst</span>
          <span className="font-mono text-red-500">{formatStat(stats.worst)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Average</span>
          <span className="font-mono">{formatStat(stats.average)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ao5</span>
          <span className="font-mono">{formatStat(stats.ao5)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ao12</span>
          <span className="font-mono">{formatStat(stats.ao12)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
