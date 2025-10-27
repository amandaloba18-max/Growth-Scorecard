"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle } from "lucide-react"
import { useMemo } from "react"

interface PilarKpi {
  pilar: string
  score: number
  delta: number
  sparklineData: number[]
  lastUpdate?: string
}

interface PrioridadesKpiPanelProps {
  pilares?: PilarKpi[]
}

// Mock sparkline data generator
const generateSparklineData = (baseScore: number, delta: number) => {
  const data = []
  const trend = delta / 30 // Distribute delta over 30 days
  for (let i = 0; i < 30; i++) {
    const noise = Math.random() * 4 - 2 // Random noise between -2 and +2
    const value = Math.max(0, Math.min(100, baseScore - delta + trend * i + noise))
    data.push({ value })
  }
  return data
}

export function PrioridadesKpiPanel({ pilares }: PrioridadesKpiPanelProps) {
  // Default pilares data if not provided
  const defaultPilares: PilarKpi[] = useMemo(
    () => [
      { pilar: "Retenção", score: 74, delta: -4, sparklineData: [], lastUpdate: "2 dias" },
      { pilar: "Conversão", score: 68, delta: 3, sparklineData: [], lastUpdate: "2 dias" },
      { pilar: "Margem", score: 65, delta: 2, sparklineData: [], lastUpdate: "2 dias" },
      { pilar: "Receita", score: 79, delta: 8, sparklineData: [], lastUpdate: "2 dias" },
    ],
    [],
  )

  const pilaresData = useMemo(() => {
    const data = pilares || defaultPilares
    return data.map((p) => ({
      ...p,
      sparklineData: p.sparklineData.length > 0 ? p.sparklineData : generateSparklineData(p.score, p.delta),
    }))
  }, [pilares, defaultPilares])

  const getStatusConfig = (score: number) => {
    if (score < 60) {
      return {
        label: "Crítico",
        emoji: "🔴",
        className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20",
      }
    } else if (score < 80) {
      return {
        label: "Atenção",
        emoji: "🟠",
        className: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20",
      }
    } else {
      return {
        label: "Estável",
        emoji: "🟢",
        className:
          "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20",
      }
    }
  }

  if (!pilaresData.length) {
    return (
      <Card className="rounded-2xl shadow-soft border-border/50">
        <CardContent className="p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
          <p className="text-lg font-medium text-foreground mb-2">Sem prioridades críticas no momento.</p>
          <p className="text-sm text-muted-foreground">Continue acompanhando seus indicadores.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pilaresData.map((pilar, idx) => {
        const statusConfig = getStatusConfig(pilar.score)
        const progressPercentage = pilar.score

        return (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 bg-card"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Header with Status Badge */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{pilar.pilar}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.className}`}
                      >
                        {statusConfig.emoji} {statusConfig.label}
                      </Badge>
                    </div>

                    {/* Score and Delta */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-foreground">{pilar.score}</span>
                      <span className="text-lg text-muted-foreground">/100</span>
                      <Badge
                        variant="outline"
                        className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          pilar.delta >= 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"
                        }`}
                      >
                        {pilar.delta > 0 ? "↑" : "↓"} {Math.abs(pilar.delta)} pts
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9] rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Sparkline Chart */}
                    <div className="h-16 -mx-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={pilar.sparklineData}>
                          <defs>
                            <linearGradient id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#004CE6" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#004CE6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <RechartsTooltip
                            content={({ payload }) => {
                              if (payload && payload.length > 0) {
                                return (
                                  <div className="bg-card border border-border rounded-lg px-2 py-1 text-xs">
                                    {Math.round(payload[0].value as number)}/100
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#004CE6"
                            strokeWidth={2}
                            fill={`url(#gradient-${idx})`}
                            isAnimationActive={true}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Last Update */}
                    {pilar.lastUpdate && (
                      <p className="text-xs text-muted-foreground text-center">
                        Última atualização há {pilar.lastUpdate}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">
                  {pilar.delta < 0
                    ? `Score caiu ${Math.abs(pilar.delta)} pts em relação ao período anterior.`
                    : `Score aumentou ${pilar.delta} pts em relação ao período anterior.`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}
