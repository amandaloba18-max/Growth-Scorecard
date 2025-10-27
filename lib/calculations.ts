import type { Cliente, MetricPoint } from "./mockData"
import { differenceInMonths, parseISO } from "date-fns"

export function calcTicketMedio(clientes: Cliente[]): number {
  const clientesAtivos = clientes.filter((c) => c.status === "ativo" && c.valor_contrato)
  if (clientesAtivos.length === 0) return 0

  const total = clientesAtivos.reduce((sum, c) => sum + (c.valor_contrato || 0), 0)
  return total / clientesAtivos.length
}

export function calcRetencao(clientes: Cliente[]): number {
  const total = clientes.length
  if (total === 0) return 0

  const ativos = clientes.filter((c) => c.status === "ativo").length
  return (ativos / total) * 100
}

export function calcLTV(clientes: Cliente[]): number {
  const clientesComDatas = clientes.filter((c) => c.data_inicio && c.valor_contrato)
  if (clientesComDatas.length === 0) return 0

  let totalMeses = 0
  let totalValor = 0

  clientesComDatas.forEach((cliente) => {
    const inicio = parseISO(cliente.data_inicio!)
    const fim = cliente.data_fim ? parseISO(cliente.data_fim) : new Date()
    const meses = Math.max(1, differenceInMonths(fim, inicio))

    totalMeses += meses
    totalValor += cliente.valor_contrato! * meses
  })

  const tempoMedioMeses = totalMeses / clientesComDatas.length
  const ticketMedio = calcTicketMedio(clientes)

  return ticketMedio * tempoMedioMeses
}

export function calcAscensao(cliente: Cliente): number | null {
  // Simulated: in a real app, we'd compare historical contract values
  // For mock purposes, we'll return null or a random value for some clients
  if (!cliente.valor_contrato) return null

  // Simulate that some clients had upgrades
  if (cliente.product_id === "prod-3" && cliente.status === "ativo") {
    return 25 // 25% increase
  }

  return null
}

export function calcCAC(metrics: MetricPoint[]): number {
  if (metrics.length === 0) return 0

  const recentMetrics = metrics.slice(-7) // Last 7 days
  const avgCac = recentMetrics.reduce((sum, m) => sum + (m.cac || 0), 0) / recentMetrics.length

  return avgCac
}

export interface HealthScoreParams {
  retencao: number
  ltv: number
  cac: number
  nps?: number
  mrr: number
}

export interface HealthScoreResult {
  score: number
  classification: "high" | "medium" | "low"
  color: "green" | "yellow" | "red"
}

export function calcHealthScore(params: HealthScoreParams): HealthScoreResult {
  const { retencao, ltv, cac, nps, mrr } = params

  // Weighted calculation
  let score = 0

  // Retention (30%)
  score += (retencao / 100) * 30

  // LTV/CAC ratio (30%)
  const ltvCacRatio = cac > 0 ? ltv / cac : 0
  const ltvCacScore = Math.min(ltvCacRatio / 3, 1) * 30 // Target ratio is 3:1
  score += ltvCacScore

  // MRR growth indicator (20%)
  const mrrScore = mrr > 10000 ? 20 : (mrr / 10000) * 20
  score += mrrScore

  // NPS (20%)
  if (nps !== undefined) {
    score += (nps / 10) * 20
  } else {
    score += 10 // Default mid-score if no NPS
  }

  const finalScore = Math.round(score)

  let classification: "high" | "medium" | "low"
  let color: "green" | "yellow" | "red"

  if (finalScore >= 80) {
    classification = "high"
    color = "green"
  } else if (finalScore >= 60) {
    classification = "medium"
    color = "yellow"
  } else {
    classification = "low"
    color = "red"
  }

  return { score: finalScore, classification, color }
}

export function calcMRR(clientes: Cliente[]): number {
  return clientes
    .filter((c) => c.status === "ativo" && c.forma_pagamento?.includes("recorrente"))
    .reduce((sum, c) => {
      if (!c.valor_contrato) return sum

      // Convert to monthly
      if (c.periodicidade === "anual") {
        return sum + c.valor_contrato / 12
      } else if (c.periodicidade === "trimestral") {
        return sum + c.valor_contrato / 3
      }

      return sum + c.valor_contrato
    }, 0)
}

export function calcChurnRate(clientes: Cliente[]): number {
  const total = clientes.length
  if (total === 0) return 0

  const cancelados = clientes.filter((c) => c.status === "cancelado").length
  return (cancelados / total) * 100
}
