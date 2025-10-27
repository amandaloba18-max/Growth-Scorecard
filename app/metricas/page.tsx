"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePeriod } from "@/lib/periodContext"
import { metrics30d, metricsPrev30d, clientes } from "@/lib/mockData"
import { brl, pct } from "@/lib/format"
import { calcTicketMedio, calcRetencao, calcChurnRate } from "@/lib/calculations"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, parseISO, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo } from "react"
import { RefreshCw, Upload, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MetricasPage() {
  const { period, compareWithPrevious } = usePeriod()
  const { toast } = useToast()

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

  const clientesAtivos = clientes.filter((c) => c.status === "ativo")
  const clientesComMultiplasCompras = clientesAtivos.filter((c) => c.numero_parcelas && c.numero_parcelas > 1).length
  const percentualMultiplasCompras =
    clientesAtivos.length > 0 ? (clientesComMultiplasCompras / clientesAtivos.length) * 100 : 0

  const ltvMedio = currentMetrics.reduce((sum, m) => sum + (m.ltv || 0), 0) / (currentMetrics.length || 1)
  const ticketMedio = calcTicketMedio(clientesAtivos)
  const retencao = calcRetencao(clientes)
  const churnRate = calcChurnRate(clientes)

  const ltvData = currentMetrics.map((m, idx) => ({
    date: format(parseISO(m.date), "dd/MM", { locale: ptBR }),
    ltv: m.ltv,
    anterior: previousMetrics[idx]?.ltv,
  }))

  const retencaoData = currentMetrics.map((m, idx) => ({
    date: format(parseISO(m.date), "dd/MM", { locale: ptBR }),
    retencao: 100 - (m.taxa_churn || 0),
    anterior: previousMetrics[idx] ? 100 - (previousMetrics[idx].taxa_churn || 0) : undefined,
  }))

  const handleRefresh = () => {
    toast({
      title: "Dados atualizados",
      description: "Os KPIs foram recalculados com sucesso.",
    })
  }

  const handleImport = () => {
    toast({
      title: "Em breve",
      description: "A funcionalidade de importação estará disponível em breve.",
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">KPIs de Crescimento</h1>
          <p className="text-muted-foreground mt-1">Indicadores-chave de performance do seu negócio.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2 rounded-full bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Atualizar dados
          </Button>
          <Button variant="outline" onClick={handleImport} className="gap-2 rounded-full bg-transparent">
            <Upload className="h-4 w-4" />
            Importar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">LTV Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{brl(ltvMedio)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {pct(percentualMultiplasCompras)} de clientes com mais de 1 compra ou renovação
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{brl(ticketMedio)}</div>
            <p className="text-xs text-muted-foreground mt-2">Valor médio dos contratos ativos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Retenção
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      <strong>Taxa de Churn:</strong> (Clientes perdidos / Clientes iniciais) × 100
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Exemplo:</strong> 100 clientes → 10 cancelaram → 10% de churn
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pct(retencao)}</div>
            <p className="text-xs text-muted-foreground mt-2">% de clientes ativos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Churn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">{pct(churnRate)}</div>
            <p className="text-xs text-muted-foreground mt-2">% de clientes perdidos no período</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{clientesAtivos.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Total de clientes ativos atualmente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Evolução de LTV (R$)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ltvData}>
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
                <Line type="monotone" dataKey="ltv" stroke="hsl(var(--chart-1))" strokeWidth={2} name="LTV" />
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

        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Evolução de Retenção (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={retencaoData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value: number) => pct(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="retencao" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Retenção" />
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

      <p className="text-sm text-muted-foreground text-center">
        Esses indicadores mostram a saúde e o potencial de crescimento da base de clientes.
      </p>
    </div>
  )
}
