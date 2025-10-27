import type { Cliente } from "./mockData"
import { parseISO, isAfter } from "date-fns"

export type ClientStatus = "ativo" | "em_risco" | "inadimplente" | "finalizado" | "cancelado"

/**
 * Resolve o status do cliente com base nas regras de negócio
 * Prioridade: cancelado > finalizado > inadimplente > em_risco > ativo
 */
export function resolveClientStatus(cliente: Cliente): ClientStatus {
  // 1. Cancelado tem prioridade máxima
  if (cliente.status === "cancelado") {
    return "cancelado"
  }

  // 2. Finalizado: data_fim existe E data atual >= data_fim
  if (cliente.data_fim) {
    const dataFim = parseISO(cliente.data_fim)
    const hoje = new Date()
    if (isAfter(hoje, dataFim) || hoje.toDateString() === dataFim.toDateString()) {
      return "finalizado"
    }
  }

  // 3. Inadimplente: status explícito (pode ser expandido com lógica de pagamentos)
  if (cliente.status === "inadimplente") {
    return "inadimplente"
  }

  // 4. Em risco: status explícito ou NPS baixo
  if (cliente.status === "em_risco") {
    return "em_risco"
  }

  // 5. Ativo: padrão
  return "ativo"
}
