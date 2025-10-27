export type FormaPagamento =
  | "à vista"
  | "cartão crédito total"
  | "cartão crédito recorrente"
  | "pix parcelado"
  | "boleto parcelado"

export type Periodicidade = "mensal" | "trimestral" | "anual"

export type Produto = {
  id: string
  nome: string
  descricao?: string
  valor_base: number
  tipo: "serviço" | "produto" | "plano"
  ativo: boolean
  created_at: string
}

export type Interacao = {
  id: string
  data: string // ISO date
  tipo: "Reunião" | "Contato" | "Entrega" | "Feedback" | "Renovação" | "Financeiro" | "Outro"
  titulo: string
  descricao?: string
  autor?: string
}

export type Cliente = {
  id: string
  empresa?: string
  nome_contratante_responsavel: string
  email?: string
  telefone?: string
  cnpj?: string
  origem_lead?: string
  product_id?: string
  valor_contrato?: number
  forma_pagamento?: FormaPagamento
  valor_entrada?: number
  numero_parcelas?: number
  valor_parcela?: number
  periodicidade?: Periodicidade
  data_inicio?: string
  data_fim?: string
  status: "ativo" | "em_risco" | "cancelado" | "inadimplente" | "finalizado"
  nps_manual?: number
  historico_interacoes?: string
  interacoes?: Interacao[]
  created_at: string
}

export type MetricPoint = {
  date: string
  receita_total?: number
  ticket_medio?: number
  ltv?: number
  cac?: number
  mrr?: number
  roi?: number
  taxa_churn?: number
  taxa_upsell?: number
}

export type Recomendacao = {
  id: string
  tipo: "diagnostico" | "recomendacao" | "alerta"
  titulo: string
  conteudo: string
  prioridade: "baixa" | "media" | "alta"
  resolvido: boolean
  data_geracao: string
}

export type Insight = Recomendacao

export const produtos: Produto[] = [
  {
    id: "prod-1",
    nome: "Plano Starter",
    descricao: "Plano básico para pequenas empresas",
    valor_base: 497,
    tipo: "plano",
    ativo: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod-2",
    nome: "Plano Growth",
    descricao: "Plano intermediário com recursos avançados",
    valor_base: 997,
    tipo: "plano",
    ativo: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod-3",
    nome: "Plano Enterprise",
    descricao: "Plano completo para grandes empresas",
    valor_base: 2497,
    tipo: "plano",
    ativo: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod-4",
    nome: "Consultoria Estratégica",
    descricao: "Serviço de consultoria personalizada",
    valor_base: 5000,
    tipo: "serviço",
    ativo: true,
    created_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "prod-5",
    nome: "Treinamento In-Company",
    descricao: "Treinamento customizado para equipes",
    valor_base: 3500,
    tipo: "serviço",
    ativo: false,
    created_at: "2024-03-10T10:00:00Z",
  },
]

export const clientes: Cliente[] = [
  {
    id: "cli-1",
    empresa: "Tech Solutions Ltda",
    nome_contratante_responsavel: "Carlos Silva",
    email: "carlos@techsolutions.com.br",
    telefone: "(11) 98765-4321",
    cnpj: "12.345.678/0001-90",
    origem_lead: "Indicação",
    product_id: "prod-2",
    valor_contrato: 997,
    forma_pagamento: "cartão crédito recorrente",
    periodicidade: "mensal",
    data_inicio: "2024-01-15T00:00:00Z",
    status: "ativo",
    nps_manual: 9,
    historico_interacoes: "Cliente muito satisfeito, renovou contrato",
    interacoes: [
      {
        id: "int-1",
        data: "2024-03-15T10:00:00Z",
        tipo: "Reunião",
        titulo: "Reunião de alinhamento trimestral",
        descricao: "Discutimos os resultados do Q1 e planejamento para Q2",
        autor: "Equipe CS",
      },
      {
        id: "int-2",
        data: "2024-02-01T10:00:00Z",
        tipo: "Renovação",
        titulo: "Renovação de contrato aprovada",
        descricao: "Cliente renovou por mais 12 meses",
        autor: "Vendas",
      },
    ],
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "cli-2",
    empresa: "Inovação Digital",
    nome_contratante_responsavel: "Ana Paula Costa",
    email: "ana@inovacaodigital.com",
    telefone: "(21) 99876-5432",
    cnpj: "23.456.789/0001-01",
    origem_lead: "Google Ads",
    product_id: "prod-3",
    valor_contrato: 2497,
    forma_pagamento: "cartão crédito recorrente",
    periodicidade: "mensal",
    data_inicio: "2024-02-01T00:00:00Z",
    status: "ativo",
    nps_manual: 10,
    historico_interacoes: "Excelente relacionamento, potencial para upsell",
    interacoes: [
      {
        id: "int-3",
        data: "2024-03-10T14:00:00Z",
        tipo: "Feedback",
        titulo: "Cliente elogiou atendimento",
        descricao: "Feedback muito positivo sobre a equipe de suporte",
        autor: "CS",
      },
    ],
    created_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "cli-3",
    empresa: "StartUp XYZ",
    nome_contratante_responsavel: "Pedro Oliveira",
    email: "pedro@startupxyz.com",
    telefone: "(11) 91234-5678",
    cnpj: "34.567.890/0001-12",
    origem_lead: "LinkedIn",
    product_id: "prod-1",
    valor_contrato: 497,
    forma_pagamento: "pix parcelado",
    valor_entrada: 100,
    numero_parcelas: 12,
    valor_parcela: 41.42,
    periodicidade: "mensal",
    data_inicio: "2024-03-01T00:00:00Z",
    status: "em_risco",
    nps_manual: 6,
    historico_interacoes: "Reclamou sobre suporte, necessita atenção",
    interacoes: [
      {
        id: "int-4",
        data: "2024-03-20T16:00:00Z",
        tipo: "Contato",
        titulo: "Ligação de follow-up",
        descricao: "Cliente relatou dificuldades com a plataforma",
        autor: "Suporte",
      },
    ],
    created_at: "2024-03-01T10:00:00Z",
  },
  {
    id: "cli-4",
    empresa: "Comércio Brasil S.A.",
    nome_contratante_responsavel: "Mariana Santos",
    email: "mariana@comerciobrasil.com.br",
    telefone: "(31) 98765-1234",
    cnpj: "45.678.901/0001-23",
    origem_lead: "Evento",
    product_id: "prod-4",
    valor_contrato: 15000,
    forma_pagamento: "boleto parcelado",
    valor_entrada: 5000,
    numero_parcelas: 10,
    valor_parcela: 1000,
    periodicidade: "mensal",
    data_inicio: "2024-01-20T00:00:00Z",
    data_fim: "2024-11-20T00:00:00Z",
    status: "ativo",
    nps_manual: 8,
    historico_interacoes: "Projeto de consultoria em andamento",
    interacoes: [
      {
        id: "int-5",
        data: "2024-03-05T11:00:00Z",
        tipo: "Entrega",
        titulo: "Entrega da fase 2 do projeto",
        descricao: "Apresentação dos resultados da consultoria",
        autor: "Consultoria",
      },
    ],
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "cli-5",
    empresa: "Varejo Online",
    nome_contratante_responsavel: "Roberto Ferreira",
    email: "roberto@varejoonline.com",
    telefone: "(41) 99123-4567",
    cnpj: "56.789.012/0001-34",
    origem_lead: "Indicação",
    product_id: "prod-2",
    valor_contrato: 997,
    forma_pagamento: "cartão crédito recorrente",
    periodicidade: "mensal",
    data_inicio: "2023-11-01T00:00:00Z",
    data_fim: "2024-03-15T00:00:00Z",
    status: "cancelado",
    nps_manual: 4,
    historico_interacoes: "Cancelou por questões financeiras",
    interacoes: [],
    created_at: "2023-11-01T10:00:00Z",
  },
  {
    id: "cli-6",
    empresa: "Educação Plus",
    nome_contratante_responsavel: "Juliana Almeida",
    email: "juliana@educacaoplus.com.br",
    telefone: "(51) 98234-5678",
    cnpj: "67.890.123/0001-45",
    origem_lead: "Instagram",
    product_id: "prod-1",
    valor_contrato: 497,
    forma_pagamento: "cartão crédito recorrente",
    periodicidade: "mensal",
    data_inicio: "2024-02-15T00:00:00Z",
    status: "ativo",
    nps_manual: 7,
    historico_interacoes: "Cliente regular, sem problemas",
    interacoes: [],
    created_at: "2024-02-15T10:00:00Z",
  },
  {
    id: "cli-7",
    empresa: "Logística Express",
    nome_contratante_responsavel: "Fernando Lima",
    email: "fernando@logisticaexpress.com",
    telefone: "(61) 99345-6789",
    cnpj: "78.901.234/0001-56",
    origem_lead: "Google Ads",
    product_id: "prod-3",
    valor_contrato: 2497,
    forma_pagamento: "à vista",
    periodicidade: "anual",
    data_inicio: "2024-01-10T00:00:00Z",
    status: "ativo",
    nps_manual: 9,
    historico_interacoes: "Pagamento anual à vista, muito satisfeito",
    interacoes: [],
    created_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "cli-8",
    empresa: "Saúde Bem-Estar",
    nome_contratante_responsavel: "Patrícia Rocha",
    email: "patricia@saudebemestar.com.br",
    telefone: "(71) 98456-7890",
    cnpj: "89.012.345/0001-67",
    origem_lead: "Indicação",
    product_id: "prod-2",
    valor_contrato: 997,
    forma_pagamento: "cartão crédito recorrente",
    periodicidade: "mensal",
    data_inicio: "2024-03-10T00:00:00Z",
    status: "ativo",
    nps_manual: 8,
    historico_interacoes: "Novo cliente, engajado",
    interacoes: [],
    created_at: "2024-03-10T10:00:00Z",
  },
]

// Generate 30 days of metrics data
const generateMetrics = (startDate: Date, daysCount: number): MetricPoint[] => {
  const metrics: MetricPoint[] = []
  const baseReceita = 25000
  const baseCac = 450
  const baseLtv = 8500

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() - (daysCount - 1 - i))

    const variation = Math.sin(i / 5) * 0.15 + Math.random() * 0.1
    const receita = baseReceita * (1 + variation)
    const cac = baseCac * (1 + variation * 0.5)
    const ltv = baseLtv * (1 + variation * 0.3)

    metrics.push({
      date: date.toISOString(),
      receita_total: receita,
      ticket_medio: receita / 8,
      ltv: ltv,
      cac: cac,
      mrr: receita * 0.7,
      roi: ((receita - cac * 5) / (cac * 5)) * 100,
      taxa_churn: 3 + Math.random() * 2,
      taxa_upsell: 8 + Math.random() * 4,
    })
  }

  return metrics
}

export const metrics30d: MetricPoint[] = generateMetrics(new Date(), 30)
export const metricsPrev30d: MetricPoint[] = generateMetrics(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 30)

export const recomendacoesMock: Recomendacao[] = [
  {
    id: "rec-1",
    tipo: "alerta",
    titulo: "Taxa de churn acima da média",
    conteudo:
      "A taxa de churn dos últimos 30 dias está 15% acima da média histórica. Recomenda-se revisar a experiência do cliente no segundo mês de contrato.",
    prioridade: "alta",
    resolvido: false,
    data_geracao: "2024-03-20T10:00:00Z",
  },
  {
    id: "rec-2",
    tipo: "recomendacao",
    titulo: "Oportunidade de upsell identificada",
    conteudo:
      "3 clientes do Plano Starter estão usando recursos avançados. Considere oferecer upgrade para o Plano Growth com desconto especial.",
    prioridade: "media",
    resolvido: false,
    data_geracao: "2024-03-19T10:00:00Z",
  },
  {
    id: "rec-3",
    tipo: "diagnostico",
    titulo: "CAC em tendência de queda",
    conteudo:
      "O custo de aquisição de clientes reduziu 12% no último mês. As campanhas de indicação estão trazendo leads mais qualificados.",
    prioridade: "baixa",
    resolvido: false,
    data_geracao: "2024-03-18T10:00:00Z",
  },
  {
    id: "rec-4",
    tipo: "alerta",
    titulo: "Cliente em risco de cancelamento",
    conteudo:
      "StartUp XYZ (NPS 6) não teve interações nos últimos 15 dias e está com pagamento atrasado. Ação imediata recomendada.",
    prioridade: "alta",
    resolvido: false,
    data_geracao: "2024-03-21T10:00:00Z",
  },
  {
    id: "rec-5",
    tipo: "recomendacao",
    titulo: "Otimizar estratégia de retenção",
    conteudo:
      "Clientes que recebem onboarding personalizado têm 40% mais chance de renovação. Considere implementar processo estruturado.",
    prioridade: "media",
    resolvido: false,
    data_geracao: "2024-03-17T10:00:00Z",
  },
  {
    id: "rec-6",
    tipo: "diagnostico",
    titulo: "LTV crescendo consistentemente",
    conteudo:
      "O Lifetime Value médio aumentou 18% nos últimos 90 dias, indicando melhor retenção e maior valor por cliente.",
    prioridade: "baixa",
    resolvido: false,
    data_geracao: "2024-03-16T10:00:00Z",
  },
  {
    id: "rec-7",
    tipo: "recomendacao",
    titulo: "Expandir canais de aquisição",
    conteudo:
      "LinkedIn e Indicações têm o melhor ROI. Considere aumentar investimento nesses canais em 30% no próximo trimestre.",
    prioridade: "media",
    resolvido: false,
    data_geracao: "2024-03-15T10:00:00Z",
  },
  {
    id: "rec-8",
    tipo: "alerta",
    titulo: "Margem de lucro abaixo do ideal",
    conteudo:
      "A margem operacional está em 22%, abaixo da meta de 30%. Revisar custos operacionais e estrutura de preços.",
    prioridade: "alta",
    resolvido: false,
    data_geracao: "2024-03-14T10:00:00Z",
  },
]

export const insightsMock = recomendacoesMock
