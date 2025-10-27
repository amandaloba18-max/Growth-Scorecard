"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CurrencyInput } from "@/components/CurrencyInput"
import { StatusBadge } from "@/components/StatusBadge"
import {
  clientes as initialClientes,
  produtos,
  type Cliente,
  type FormaPagamento,
  type Periodicidade,
} from "@/lib/mockData"
import { brl } from "@/lib/format"
import { calcLTV } from "@/lib/calculations"
import { generateClientRecommendations } from "@/lib/clientRecommendations"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Lightbulb,
  ChevronRight,
} from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

type TimelineEvent = {
  id: string
  date: string
  type: "reuniao" | "renovacao" | "feedback" | "pagamento" | "outro"
  description: string
}

type Payment = {
  id: string
  date: string
  value: number
  method: string
  status: "pago" | "pendente" | "atrasado"
}

export default function ClienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [formData, setFormData] = useState<Partial<Cliente>>({})

  // Mock timeline and payments data
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: "evt-1",
      date: "2024-03-15T10:00:00Z",
      type: "reuniao",
      description: "Reunião de alinhamento trimestral",
    },
    {
      id: "evt-2",
      date: "2024-02-01T10:00:00Z",
      type: "renovacao",
      description: "Renovação de contrato aprovada",
    },
    {
      id: "evt-3",
      date: "2024-01-15T10:00:00Z",
      type: "feedback",
      description: "Cliente elogiou atendimento",
    },
  ])

  const [payments, setPayments] = useState<Payment[]>([
    { id: "pay-1", date: "2024-03-01", value: 997, method: "Cartão de crédito", status: "pago" },
    { id: "pay-2", date: "2024-02-01", value: 997, method: "Cartão de crédito", status: "pago" },
    { id: "pay-3", date: "2024-01-01", value: 997, method: "Cartão de crédito", status: "pago" },
  ])

  // Mock NPS history data
  const npsHistory = [
    { month: "Out", nps: 7 },
    { month: "Nov", nps: 8 },
    { month: "Dez", nps: 8 },
    { month: "Jan", nps: 9 },
    { month: "Fev", nps: 9 },
    { month: "Mar", nps: cliente?.nps_manual || 9 },
  ]

  useEffect(() => {
    const foundCliente = initialClientes.find((c) => c.id === params.id)
    if (foundCliente) {
      setCliente(foundCliente)
      setFormData(foundCliente)
    }
  }, [params.id])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  if (!cliente) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Cliente não encontrado</h2>
          <Button onClick={() => router.push("/clientes")} className="mt-4">
            Voltar para Clientes
          </Button>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    setCliente({ ...cliente, ...formData })
    setEditMode(false)
    setHasUnsavedChanges(false)
    toast({
      title: "Dados atualizados",
      description: "As informações do cliente foram atualizadas com sucesso.",
    })
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm("Você tem alterações não salvas. Deseja descartar?")) {
        setFormData(cliente)
        setEditMode(false)
        setHasUnsavedChanges(false)
      }
    } else {
      setEditMode(false)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")) {
        router.push("/clientes")
      }
    } else {
      router.push("/clientes")
    }
  }

  const updateFormData = (updates: Partial<Cliente>) => {
    setFormData({ ...formData, ...updates })
    setHasUnsavedChanges(true)
  }

  const produto = produtos.find((p) => p.id === cliente.product_id)
  const ltv = calcLTV([cliente])
  const ticketMedio = cliente.valor_contrato || 0
  const tempoRelacionamento = cliente.data_inicio
    ? differenceInDays(cliente.data_fim ? parseISO(cliente.data_fim) : new Date(), parseISO(cliente.data_inicio))
    : 0
  const valorTotalContratos = cliente.valor_contrato || 0
  const parcelasRestantes = cliente.numero_parcelas
    ? Math.max(0, cliente.numero_parcelas - payments.filter((p) => p.status === "pago").length)
    : 0

  const showParcelamento =
    formData.forma_pagamento?.includes("parcelado") || formData.forma_pagamento?.includes("recorrente")

  const clientRecommendations = cliente ? generateClientRecommendations(cliente) : []

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={handleBack} className="hover:text-foreground transition-colors">
          Clientes
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{cliente.nome_contratante_responsavel}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{cliente.nome_contratante_responsavel}</h1>
          {cliente.empresa && <p className="text-lg text-muted-foreground mt-1">{cliente.empresa}</p>}
          <div className="mt-3">
            <StatusBadge status={cliente.status} />
          </div>
        </div>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2 rounded-full bg-transparent">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="gap-2 rounded-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9]">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditMode(true)} className="gap-2 rounded-full">
                <Edit className="h-4 w-4" />
                Editar Dados
              </Button>
              <Button variant="outline" onClick={handleBack} className="gap-2 rounded-full bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Clientes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4 text-[#004CE6]" />
            LTV Calculado
          </div>
          <div className="text-2xl font-semibold">{brl(ltv)}</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4 text-[#004CE6]" />
            Ticket Médio
          </div>
          <div className="text-2xl font-semibold">{brl(ticketMedio)}</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Star className="h-4 w-4 text-[#004CE6]" />
            NPS Atual
          </div>
          <div className="text-2xl font-semibold">{cliente.nps_manual || "-"}</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4 text-[#004CE6]" />
            Tempo de Relacionamento
          </div>
          <div className="text-2xl font-semibold">{tempoRelacionamento} dias</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4 text-[#004CE6]" />
            Valor Total
          </div>
          <div className="text-2xl font-semibold">{brl(valorTotalContratos)}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Informações Gerais */}
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Contratante</Label>
                  {editMode ? (
                    <Input
                      value={formData.nome_contratante_responsavel}
                      onChange={(e) => updateFormData({ nome_contratante_responsavel: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{cliente.nome_contratante_responsavel}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  {editMode ? (
                    <Input value={formData.empresa} onChange={(e) => updateFormData({ empresa: e.target.value })} />
                  ) : (
                    <p className="text-sm">{cliente.empresa || "-"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  {editMode ? (
                    <Input value={formData.email} onChange={(e) => updateFormData({ email: e.target.value })} />
                  ) : (
                    <p className="text-sm">{cliente.email || "-"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  {editMode ? (
                    <Input value={formData.telefone} onChange={(e) => updateFormData({ telefone: e.target.value })} />
                  ) : (
                    <p className="text-sm">{cliente.telefone || "-"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  {editMode ? (
                    <Input value={formData.cnpj} onChange={(e) => updateFormData({ cnpj: e.target.value })} />
                  ) : (
                    <p className="text-sm">{cliente.cnpj || "-"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Origem do Lead</Label>
                  {editMode ? (
                    <Input
                      value={formData.origem_lead}
                      onChange={(e) => updateFormData({ origem_lead: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{cliente.origem_lead || "-"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Produto</Label>
                {editMode ? (
                  <Select value={formData.product_id} onValueChange={(value) => updateFormData({ product_id: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos
                        .filter((p) => p.ativo)
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome} - {brl(p.valor_base)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">{produto?.nome || "-"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                {editMode ? (
                  <Select
                    value={formData.forma_pagamento}
                    onValueChange={(value) => updateFormData({ forma_pagamento: value as FormaPagamento })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="à vista">À vista</SelectItem>
                      <SelectItem value="cartão crédito total">Cartão de crédito (total)</SelectItem>
                      <SelectItem value="cartão crédito recorrente">Cartão de crédito (recorrente)</SelectItem>
                      <SelectItem value="pix parcelado">PIX parcelado</SelectItem>
                      <SelectItem value="boleto parcelado">Boleto parcelado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm capitalize">{cliente.forma_pagamento || "-"}</p>
                )}
              </div>

              {showParcelamento && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Parcelas</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={formData.numero_parcelas}
                        onChange={(e) => updateFormData({ numero_parcelas: Number.parseInt(e.target.value) || 1 })}
                      />
                    ) : (
                      <p className="text-sm">{cliente.numero_parcelas || "-"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Valor da Parcela</Label>
                    {editMode ? (
                      <CurrencyInput
                        value={formData.valor_parcela || 0}
                        onChange={(value) => updateFormData({ valor_parcela: value })}
                      />
                    ) : (
                      <p className="text-sm">{brl(cliente.valor_parcela || 0)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Periodicidade</Label>
                    {editMode ? (
                      <Select
                        value={formData.periodicidade}
                        onValueChange={(value) => updateFormData({ periodicidade: value as Periodicidade })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mensal">Mensal</SelectItem>
                          <SelectItem value="trimestral">Trimestral</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm capitalize">{cliente.periodicidade || "-"}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Valor do Contrato</Label>
                {editMode ? (
                  <CurrencyInput
                    value={formData.valor_contrato || 0}
                    onChange={(value) => updateFormData({ valor_contrato: value })}
                  />
                ) : (
                  <p className="text-sm">{brl(cliente.valor_contrato || 0)}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  {editMode ? (
                    <Input
                      type="date"
                      value={formData.data_inicio?.split("T")[0]}
                      onChange={(e) => updateFormData({ data_inicio: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">
                      {cliente.data_inicio
                        ? format(parseISO(cliente.data_inicio), "dd/MM/yyyy", { locale: ptBR })
                        : "-"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  {editMode ? (
                    <Input
                      type="date"
                      value={formData.data_fim?.split("T")[0] || ""}
                      onChange={(e) => updateFormData({ data_fim: e.target.value || undefined })}
                    />
                  ) : (
                    <p className="text-sm">
                      {cliente.data_fim ? format(parseISO(cliente.data_fim), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                {editMode ? (
                  <Textarea
                    value={formData.historico_interacoes}
                    onChange={(e) => updateFormData({ historico_interacoes: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {cliente.historico_interacoes || "Nenhuma observação"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Histórico Financeiro */}
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Pagamentos e Contratos</h2>

            <div className="mb-4 p-4 rounded-xl bg-muted/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo atual</p>
                <p className="text-2xl font-semibold">{brl(valorTotalContratos)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Parcelas restantes</p>
                <p className="text-2xl font-semibold">{parcelasRestantes}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(parseISO(payment.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>{brl(payment.value)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === "pago"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : payment.status === "pendente"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {payment.status === "pago" ? "Pago" : payment.status === "pendente" ? "Pendente" : "Atrasado"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Linha do Tempo */}
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Histórico e Interações</h2>
              <Button size="sm" variant="outline" className="gap-2 rounded-full bg-transparent">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-4">
              {timeline.map((event, idx) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.type === "renovacao"
                          ? "bg-emerald-500"
                          : event.type === "reuniao"
                            ? "bg-blue-500"
                            : event.type === "feedback"
                              ? "bg-amber-500"
                              : "bg-gray-400"
                      }`}
                    />
                    {idx < timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium capitalize">{event.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfação */}
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Satisfação e Relacionamento</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">NPS Atual</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{cliente.nps_manual || "-"}</span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
              </div>
              {editMode && (
                <div className="space-y-2">
                  <Label>Registrar novo NPS</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.nps_manual || ""}
                    onChange={(e) => updateFormData({ nps_manual: Number.parseInt(e.target.value) || undefined })}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Evolução do NPS (últimos 6 meses)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={npsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="nps" stroke="#004CE6" strokeWidth={2} dot={{ fill: "#004CE6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Notas e Recomendações */}
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Observações e Recomendações</h2>

            <div className="space-y-4">
              {clientRecommendations.length > 0 ? (
                clientRecommendations.map((rec, idx) => {
                  const colorClasses = {
                    Upsell: {
                      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
                      border: "border-blue-200 dark:border-blue-800",
                      icon: "text-blue-600 dark:text-blue-400",
                      title: "text-blue-900 dark:text-blue-100",
                      content: "text-blue-700 dark:text-blue-300",
                    },
                    Retenção: {
                      bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
                      border: "border-amber-200 dark:border-amber-800",
                      icon: "text-amber-600 dark:text-amber-400",
                      title: "text-amber-900 dark:text-amber-100",
                      content: "text-amber-700 dark:text-amber-300",
                    },
                    Financeiro: {
                      bg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
                      border: "border-red-200 dark:border-red-800",
                      icon: "text-red-600 dark:text-red-400",
                      title: "text-red-900 dark:text-red-100",
                      content: "text-red-700 dark:text-red-300",
                    },
                    Reativação: {
                      bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
                      border: "border-purple-200 dark:border-purple-800",
                      icon: "text-purple-600 dark:text-purple-400",
                      title: "text-purple-900 dark:text-purple-100",
                      content: "text-purple-700 dark:text-purple-300",
                    },
                    Onboarding: {
                      bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
                      border: "border-emerald-200 dark:border-emerald-800",
                      icon: "text-emerald-600 dark:text-emerald-400",
                      title: "text-emerald-900 dark:text-emerald-100",
                      content: "text-emerald-700 dark:text-emerald-300",
                    },
                    Indicação: {
                      bg: "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20",
                      border: "border-cyan-200 dark:border-cyan-800",
                      icon: "text-cyan-600 dark:text-cyan-400",
                      title: "text-cyan-900 dark:text-cyan-100",
                      content: "text-cyan-700 dark:text-cyan-300",
                    },
                  }

                  const colors = colorClasses[rec.tipo]

                  return (
                    <div key={idx} className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <div className="flex items-start gap-3">
                        <Lightbulb className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium ${colors.title}`}>{rec.titulo}</h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                rec.prioridade === "alta"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : rec.prioridade === "media"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {rec.prioridade === "alta" ? "Alta" : rec.prioridade === "media" ? "Média" : "Baixa"}
                            </span>
                          </div>
                          <p className={`text-sm ${colors.content}`}>{rec.conteudo}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-muted-foreground">{rec.tipo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-6 rounded-xl bg-muted/50 text-center">
                  <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma recomendação específica no momento. Continue acompanhando os indicadores deste cliente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
