"use client"

import { KpiCard } from "@/components/KpiCard"
import { RecomendacoesList } from "@/components/RecomendacoesList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useObjective } from "@/lib/objectiveContext"
import { usePeriod } from "@/lib/periodContext"
import { clientes, metrics30d, metricsPrev30d, recomendacoesMock } from "@/lib/mockData"
import {
  calcTicketMedio,
  calcRetencao,
  calcLTV,
  calcCAC,
  calcHealthScore,
  calcMRR,
  calcChurnRate,
} from "@/lib/calculations"
import { brl, pct } from "@/lib/format"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, parseISO, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo, useEffect, useState } from "react"
import { ObjectiveOnboarding } from "@/components/ObjectiveOnboarding"
import { WelcomeBanner } from "@/components/WelcomeBanner"
import { PeriodSelector } from "@/components/PeriodSelector"
import { DollarSign, Users, TrendingUp, Target, Activity } from "lucide-react"
import { PrioridadesKpiPanel } from "@/components/PrioridadesKpiPanel"

export default function DashboardPage() {
  const { objetivo } = useObjective()
  const { period, compareWithPrevious } = usePeriod()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("growth-scorecard-onboarding-seen")
    if (!hasSeenOnboarding && !objetivo) {
      setShowOnboarding(true)
    }
  }, [objetivo])

  // Filter metrics by period
  const currentMetrics = useMemo(() => {
    return metrics30d.filter((m) => {
      const date = parseISO(m.date)
      return isWithinInterval(date, { start: period.from, end: period.to })
    })
  }, [period])

  const previousMetrics = useMemo(() => {
    if (!compareWithPrevious) return []
    const daysDiff = Math.ceil((period.to.getTime() - period.from.getTime()) / (1000 * 60 * 60 * 24))
    const prevStart = new Date(period.from)
    prevStart.setDate(prevStart.getDate() - daysDiff)
    const prevEnd = new Date(period.from)

    return metricsPrev30d.filter((m) => {
      const date = parseISO(m.date)
      return isWithinInterval(date, { start: prevStart, end: prevEnd })
    })
  }, [period, compareWithPrevious])

  // Calculate KPIs
  const receitaTotal = currentMetrics.reduce((sum, m) => sum + (m.receita_total || 0), 0)
  const receitaPrev = previousMetrics.reduce((sum, m) => sum + (m.receita_total || 0), 0)
  const receitaDelta = receitaPrev > 0 ? ((receitaTotal - receitaPrev) / receitaPrev) * 100 : 0

  const ticketMedio = calcTicketMedio(clientes)
  const retencao = calcRetencao(clientes)
  const ltv = calcLTV(clientes)
  const cac = calcCAC(currentMetrics)
  const mrr = calcMRR(clientes)
  const churnRate = calcChurnRate(clientes)

  const avgNps =
    clientes.filter((c) => c.nps_manual).reduce((sum, c) => sum + (c.nps_manual || 0), 0) /
    clientes.filter((c) => c.nps_manual).length

  const healthScore = calcHealthScore({
    retencao,
    ltv,
    cac,
    nps: avgNps,
    mrr,
  })

  // Adaptive KPIs based on objective
  const getKpiOrder = () => {
    switch (objetivo) {
      case "Reduzir churn":
      case "Aumentar retenção/recompra":
        return [
          { title: "Taxa de Retenção", value: pct(retencao), delta: 2.3, icon: Activity },
          { title: "LTV", value: brl(ltv), delta: 5.1, icon: DollarSign },
          { title: "Taxa de Churn", value: pct(churnRate), delta: -1.8, icon: TrendingUp },
          { title: "NPS Médio", value: avgNps.toFixed(1), delta: 0.5, icon: Users },
          { title: "Health Score", value: healthScore.score.toString(), delta: 1.2, icon: Target },
        ]
      case "Escalar vendas com lucro":
        return [
          { title: "Receita Total", value: brl(receitaTotal), delta: receitaDelta, icon: DollarSign },
          { title: "CAC", value: brl(cac), delta: -3.2, icon: Users },
          { title: "ROI", value: pct(45), delta: 8.5, icon: TrendingUp },
          { title: "Ticket Médio", value: brl(ticketMedio), delta: 4.2, icon: DollarSign },
          { title: "Health Score", value: healthScore.score.toString(), delta: 1.2, icon: Target },
        ]
      case "Melhorar margem de lucro":
        return [
          { title: "Receita Total", value: brl(receitaTotal), delta: receitaDelta, icon: DollarSign },
          { title: "Margem Operacional", value: pct(28), delta: 3.5, icon: TrendingUp },
          { title: "CAC", value: brl(cac), delta: -2.1, icon: Users },
          { title: "Ticket Médio", value: brl(ticketMedio), delta: 4.2, icon: DollarSign },
          { title: "Health Score", value: healthScore.score.toString(), delta: 1.2, icon: Target },
        ]
      default:
        return [
          { title: "Receita Total", value: brl(receitaTotal), delta: receitaDelta, icon: DollarSign },
          { title: "Ticket Médio", value: brl(ticketMedio), delta: 4.2, icon: DollarSign },
          { title: "CAC", value: brl(cac), delta: -3.2, icon: Users },
          { title: "LTV", value: brl(ltv), delta: 5.1, icon: TrendingUp },
          { title: "Health Score", value: healthScore.score.toString(), delta: 1.2, icon: Target },
        ]
    }
  }

  // Chart data
  const chartData = currentMetrics.map((m, idx) => ({
    date: format(parseISO(m.date), "dd/MM", { locale: ptBR }),
    atual: m.receita_total,
    anterior: previousMetrics[idx]?.receita_total,
  }))

  // Filter insights by objective
  const relevantRecomendacoes = useMemo(() => {
    if (objetivo === "Reduzir churn" || objetivo === "Aumentar retenção/recompra") {
      return recomendacoesMock.filter((i) => i.tipo === "alerta" || i.prioridade === "alta").slice(0, 5)
    }
    return recomendacoesMock.slice(0, 5)
  }, [objetivo])

  const pilaresKpiData = useMemo(() => {
    return [
      { pilar: "Retenção", score: 74, delta: -4, sparklineData: [], lastUpdate: "2 dias" },
      { pilar: "Conversão", score: 68, delta: 3, sparklineData: [], lastUpdate: "2 dias" },
      { pilar: "Margem", score: 65, delta: 2, sparklineData: [], lastUpdate: "2 dias" },
      { pilar: "Receita", score: 79, delta: 8, sparklineData: [], lastUpdate: "2 dias" },
    ]
  }, [])

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Visão geral do seu crescimento</p>
          </div>
          <PeriodSelector />
        </div>

        {/* Welcome Banner */}
        <WelcomeBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {getKpiOrder().map((kpi, idx) => (
            <div
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <KpiCard {...kpi} />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="rounded-2xl shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Receita: Período Atual vs Anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => brl(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="atual" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Atual" />
                  {compareWithPrevious && (
                    <Line
                      type="monotone"
                      dataKey="anterior"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Anterior"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Prioridades de Crescimento */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Prioridades de Crescimento</h2>
            <p className="text-sm text-muted-foreground mt-1">Indicadores com maior impacto na performance geral.</p>
          </div>
          <PrioridadesKpiPanel pilares={pilaresKpiData} />
        </div>

        {/* Insights */}
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Principais Recomendações da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <RecomendacoesList recomendacoes={relevantRecomendacoes} compact limit={5} />
          </CardContent>
        </Card>
      </div>

      <ObjectiveOnboarding open={showOnboarding} onOpenChange={setShowOnboarding} />
    </>
  )
}
