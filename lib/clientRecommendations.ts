import type { Cliente } from "./mockData"
import { differenceInMonths, parseISO } from "date-fns"

export type ClienteRecomendacao = {
  tipo: "Upsell" | "Retenção" | "Financeiro" | "Reativação" | "Onboarding" | "Indicação"
  titulo: string
  conteudo: string
  prioridade: "baixa" | "media" | "alta"
}

export function generateClientRecommendations(cliente: Cliente): ClienteRecomendacao[] {
  const recs: ClienteRecomendacao[] = []

  // Calculate derived fields
  const tempo_ativo_meses = cliente.data_inicio
    ? differenceInMonths(cliente.data_fim ? parseISO(cliente.data_fim) : new Date(), parseISO(cliente.data_inicio))
    : 0

  const nps = cliente.nps_manual || 0
  const status = cliente.status

  // Mock data for fields not in the type
  // In a real app, these would come from the database
  const pagamentos_atrasados = 0 // Would be calculated from payment history
  const ultima_interacao_dias = 10 // Would be calculated from interaction history

  // 1. Clientes ativos e satisfeitos (expansão)
  if (status === "ativo" && nps >= 8) {
    recs.push({
      tipo: "Upsell",
      titulo: "Oportunidade de expansão",
      conteudo:
        "Cliente demonstra alta satisfação e estabilidade. Considere oferecer upgrade para um plano mais completo ou serviços complementares.",
      prioridade: "media",
    })
  }

  // 2. Clientes ativos, mas em risco (baixa interação ou queda de NPS)
  if (status === "em_risco" || nps <= 6 || ultima_interacao_dias > 30) {
    recs.push({
      tipo: "Retenção",
      titulo: "Risco de churn detectado",
      conteudo:
        "Cliente com baixa interação recente. Recomenda-se agendar contato de follow-up ou revisar o valor percebido do serviço.",
      prioridade: "alta",
    })
  }

  // 3. Clientes com pagamentos atrasados
  if (pagamentos_atrasados > 0) {
    recs.push({
      tipo: "Financeiro",
      titulo: "Pagamentos pendentes identificados",
      conteudo:
        "Há parcelas em atraso. Considere oferecer renegociação ou facilitar a regularização para evitar cancelamento.",
      prioridade: "alta",
    })
  }

  // 4. Clientes cancelados
  if (status === "cancelado") {
    recs.push({
      tipo: "Reativação",
      titulo: "Cliente cancelado recentemente",
      conteudo:
        "Esse cliente encerrou o contrato. Avalie enviar uma pesquisa de saída ou oferecer condições especiais de retorno.",
      prioridade: "media",
    })
  }

  // 5. Clientes novos (até 60 dias)
  if (tempo_ativo_meses < 2 && status === "ativo") {
    recs.push({
      tipo: "Onboarding",
      titulo: "Cliente em fase inicial",
      conteudo: "Acompanhe de perto o onboarding para garantir boa experiência e reduzir risco de churn precoce.",
      prioridade: "media",
    })
  }

  // 6. Clientes antigos e fiéis
  if (tempo_ativo_meses > 12 && nps >= 8) {
    recs.push({
      tipo: "Indicação",
      titulo: "Cliente fidelizado — ideal para indicações",
      conteudo: "Esse cliente tem longo relacionamento e alta satisfação. Peça indicações ou depoimentos.",
      prioridade: "baixa",
    })
  }

  return recs
}
