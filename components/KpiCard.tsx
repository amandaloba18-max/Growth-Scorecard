import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  delta?: number
  icon?: LucideIcon
  subtitle?: string
}

export function KpiCard({ title, value, delta, icon: Icon, subtitle }: KpiCardProps) {
  const getDeltaIcon = () => {
    if (delta === undefined || delta === 0) return <Minus className="h-3.5 w-3.5" />
    return delta > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />
  }

  const getDeltaColor = () => {
    if (delta === undefined || delta === 0) return "text-muted-foreground bg-muted"
    return delta > 0
      ? "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40"
      : "text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/40"
  }

  return (
    <Card className="rounded-2xl shadow-soft border-border/50 hover:shadow-soft-lg transition-shadow">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004CE6]/10 to-[#6E59F9]/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          <div className="flex items-center gap-2">
            {delta !== undefined && (
              <div
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  getDeltaColor(),
                )}
              >
                {getDeltaIcon()}
                <span>{Math.abs(delta).toFixed(1)}%</span>
              </div>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
