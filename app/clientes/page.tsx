"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/CurrencyInput"
import { StatusBadge } from "@/components/StatusBadge"
import { PillTabs } from "@/components/PillTabs"
import {
  clientes as initialClientes,
  produtos,
  type Cliente,
  type FormaPagamento,
  type Periodicidade,
} from "@/lib/mockData"
import { brl } from "@/lib/format"
import { calcLTV, calcAscensao } from "@/lib/calculations"
import { Plus, Search, Eye, TrendingUp, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [produtoFilter, setProdutoFilter] = useState<string>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingClienteId, setEditingClienteId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState<Partial<Cliente>>({
    nome_contratante_responsavel: "",
    empresa: "",
    email: "",
    telefone: "",
    cnpj: "",
    origem_lead: "",
    product_id: "",
    valor_contrato: 0,
    forma_pagamento: "à vista",
    valor_entrada: 0,
    numero_parcelas: 1,
    valor_parcela: 0,
    periodicidade: "mensal",
    data_inicio: new Date().toISOString().split("T")[0],
    status: "ativo",
    nps_manual: undefined,
    historico_interacoes: "",
  })

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nome_contratante_responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter
    const matchesProduto = produtoFilter === "todos" || cliente.product_id === produtoFilter
    return matchesSearch && matchesStatus && matchesProduto
  })

  const getPagamentoStatus = (cliente: Cliente) => {
    // Simulate payment status
    if (cliente.status === "cancelado") return <div className="text-sm text-destructive">Cancelado</div>
    if (cliente.status === "em_risco") return <div className="text-sm text-secondary">Atrasado</div>
    if (cliente.forma_pagamento === "à vista") return <div className="text-sm text-default">Pago</div>
    return <div className="text-sm text-outline">Recorrente</div>
  }

  const handleAddCliente = () => {
    const newCliente: Cliente = {
      id: `cli-${Date.now()}`,
      ...formData,
      created_at: new Date().toISOString(),
    } as Cliente

    setClientes([...clientes, newCliente])
    setDialogOpen(false)
    resetForm()
  }

  const handleEditCliente = (cliente: Cliente) => {
    setFormData({
      nome_contratante_responsavel: cliente.nome_contratante_responsavel,
      empresa: cliente.empresa,
      email: cliente.email,
      telefone: cliente.telefone,
      cnpj: cliente.cnpj,
      origem_lead: cliente.origem_lead,
      product_id: cliente.product_id,
      valor_contrato: cliente.valor_contrato,
      forma_pagamento: cliente.forma_pagamento,
      valor_entrada: cliente.valor_entrada,
      numero_parcelas: cliente.numero_parcelas,
      valor_parcela: cliente.valor_parcela,
      periodicidade: cliente.periodicidade,
      data_inicio: cliente.data_inicio?.split("T")[0],
      data_fim: cliente.data_fim?.split("T")[0],
      status: cliente.status,
      nps_manual: cliente.nps_manual,
      historico_interacoes: cliente.historico_interacoes,
    })
    setEditingClienteId(cliente.id)
    setEditMode(true)
    setDialogOpen(true)
  }

  const handleDeleteCliente = (clienteId: string) => {
    setClientes(clientes.filter((c) => c.id !== clienteId))
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    })
  }

  const handleSaveCliente = () => {
    if (editMode && editingClienteId) {
      // Update existing client
      setClientes(
        clientes.map((c) =>
          c.id === editingClienteId
            ? {
                ...c,
                ...formData,
              }
            : c,
        ),
      )
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      })
    } else {
      // Add new client
      const newCliente: Cliente = {
        id: `cli-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
      } as Cliente

      setClientes([...clientes, newCliente])
      toast({
        title: "Cliente adicionado",
        description: "O novo cliente foi adicionado com sucesso.",
      })
    }

    setDialogOpen(false)
    setEditMode(false)
    setEditingClienteId(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome_contratante_responsavel: "",
      empresa: "",
      email: "",
      telefone: "",
      cnpj: "",
      origem_lead: "",
      product_id: "",
      valor_contrato: 0,
      forma_pagamento: "à vista",
      valor_entrada: 0,
      numero_parcelas: 1,
      valor_parcela: 0,
      periodicidade: "mensal",
      data_inicio: new Date().toISOString().split("T")[0],
      status: "ativo",
      nps_manual: undefined,
      historico_interacoes: "",
    })
  }

  const showParcelamento =
    formData.forma_pagamento?.includes("parcelado") || formData.forma_pagamento?.includes("recorrente")

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie sua base de clientes</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) {
              setEditMode(false)
              setEditingClienteId(null)
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9] shadow-soft">
              <Plus className="h-4 w-4" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editMode ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              <DialogDescription>
                {editMode ? "Atualize as informações do cliente" : "Preencha as informações do cliente"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Contratante Responsável *</Label>
                  <Input
                    id="nome"
                    value={formData.nome_contratante_responsavel}
                    onChange={(e) => setFormData({ ...formData, nome_contratante_responsavel: e.target.value })}
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Empresa Ltda"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origem">Origem do Lead</Label>
                  <Input
                    id="origem"
                    value={formData.origem_lead}
                    onChange={(e) => setFormData({ ...formData, origem_lead: e.target.value })}
                    placeholder="Google Ads, Indicação..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="produto">Produto *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos
                      .filter((p) => p.ativo)
                      .map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome} - {brl(produto.valor_base)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Contrato *</Label>
                <CurrencyInput
                  value={formData.valor_contrato || 0}
                  onChange={(value) => setFormData({ ...formData, valor_contrato: value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pagamento">Forma de Pagamento *</Label>
                <Select
                  value={formData.forma_pagamento}
                  onValueChange={(value) => setFormData({ ...formData, forma_pagamento: value as FormaPagamento })}
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
              </div>

              {showParcelamento && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entrada">Valor de Entrada</Label>
                      <CurrencyInput
                        value={formData.valor_entrada || 0}
                        onChange={(value) => setFormData({ ...formData, valor_entrada: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parcelas">Número de Parcelas</Label>
                      <Input
                        id="parcelas"
                        type="number"
                        value={formData.numero_parcelas}
                        onChange={(e) =>
                          setFormData({ ...formData, numero_parcelas: Number.parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_parcela">Valor da Parcela</Label>
                      <CurrencyInput
                        value={formData.valor_parcela || 0}
                        onChange={(value) => setFormData({ ...formData, valor_parcela: value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodicidade">Periodicidade</Label>
                    <Select
                      value={formData.periodicidade}
                      onValueChange={(value) => setFormData({ ...formData, periodicidade: value as Periodicidade })}
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
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_inicio">Data de Início</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio?.split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_fim">Data de Fim (opcional)</Label>
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim?.split("T")[0] || ""}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value || undefined })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Cliente["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="em_risco">Em Risco</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nps">NPS Manual (0-10)</Label>
                  <Input
                    id="nps"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.nps_manual || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nps_manual: Number.parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="historico">Histórico de Interações</Label>
                <Textarea
                  id="historico"
                  value={formData.historico_interacoes}
                  onChange={(e) => setFormData({ ...formData, historico_interacoes: e.target.value })}
                  placeholder="Notas sobre o cliente..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  setEditMode(false)
                  setEditingClienteId(null)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCliente}
                disabled={!formData.nome_contratante_responsavel || !formData.product_id}
              >
                {editMode ? "Salvar Alterações" : "Adicionar Cliente"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full bg-muted/50 border-0"
          />
        </div>
        <PillTabs
          tabs={[
            { id: "todos", label: "Todos" },
            { id: "ativo", label: "Ativos" },
            { id: "em_risco", label: "Em Risco" },
            { id: "cancelado", label: "Cancelados" },
          ]}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
        <Select value={produtoFilter} onValueChange={setProdutoFilter}>
          <SelectTrigger className="w-[200px] rounded-full">
            <SelectValue placeholder="Produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os produtos</SelectItem>
            {produtos.map((produto) => (
              <SelectItem key={produto.id} value={produto.id}>
                {produto.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Produto</TableHead>
                <TableHead className="font-semibold">Valor do Contrato</TableHead>
                <TableHead className="font-semibold">Forma de Pagamento</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">NPS</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente, idx) => {
                const produto = produtos.find((p) => p.id === cliente.product_id)
                return (
                  <TableRow key={cliente.id} className={idx % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell>
                      <div className="break-words">
                        <div className="font-medium">{cliente.nome_contratante_responsavel}</div>
                        {cliente.empresa && <div className="text-sm text-muted-foreground">{cliente.empresa}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="break-words">{produto?.nome || "-"}</TableCell>
                    <TableCell>
                      <div className="font-medium">{brl(cliente.valor_contrato || 0)}</div>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{cliente.forma_pagamento}</TableCell>
                    <TableCell>
                      <StatusBadge status={cliente.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {cliente.nps_manual !== undefined ? cliente.nps_manual : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => router.push(`/clientes/${cliente.id}`)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => handleEditCliente(cliente)}
                          title="Editar cliente"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Deseja remover este cliente?")) {
                              handleDeleteCliente(cliente.id)
                            }
                          }}
                          title="Remover cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:w-[520px] md:w-[640px] lg:w-[760px] xl:w-[880px] z-50 p-0 flex flex-col">
          {selectedCliente && (
            <>
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl break-words">
                      {selectedCliente.nome_contratante_responsavel}
                    </SheetTitle>
                    <SheetDescription className="break-words">{selectedCliente.empresa}</SheetDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        nome_contratante_responsavel: selectedCliente.nome_contratante_responsavel,
                        empresa: selectedCliente.empresa,
                        email: selectedCliente.email,
                        telefone: selectedCliente.telefone,
                        cnpj: selectedCliente.cnpj,
                        origem_lead: selectedCliente.origem_lead,
                        product_id: selectedCliente.product_id,
                        valor_contrato: selectedCliente.valor_contrato,
                        forma_pagamento: selectedCliente.forma_pagamento,
                        valor_entrada: selectedCliente.valor_entrada,
                        numero_parcelas: selectedCliente.numero_parcelas,
                        valor_parcela: selectedCliente.valor_parcela,
                        periodicidade: selectedCliente.periodicidade,
                        data_inicio: selectedCliente.data_inicio?.split("T")[0],
                        data_fim: selectedCliente.data_fim?.split("T")[0],
                        status: selectedCliente.status,
                        nps_manual: selectedCliente.nps_manual,
                        historico_interacoes: selectedCliente.historico_interacoes,
                      })
                      setEditingClienteId(selectedCliente.id)
                      setEditMode(true)
                    }}
                    className="rounded-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 py-6">
                {!editMode ? (
                  // Read-only view
                  <div className="space-y-6">
                    <div
                      className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50"
                      aria-label="Métricas"
                    >
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Métricas
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-card shadow-sm">
                          <div className="text-sm text-muted-foreground">LTV Calculado</div>
                          <div className="text-2xl font-semibold mt-1">{brl(calcLTV([selectedCliente]))}</div>
                        </div>
                        {calcAscensao(selectedCliente) && (
                          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                            <div className="text-sm text-emerald-700 dark:text-emerald-300">Ascensão</div>
                            <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                              +{calcAscensao(selectedCliente)}%
                            </div>
                          </div>
                        )}
                        {selectedCliente.status === "em_risco" && (
                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                Cliente em Risco
                              </div>
                              <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                Atenção necessária para evitar cancelamento
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div aria-label="Informações de Contato">
                      <h3 className="font-semibold mb-3">Informações de Contato</h3>
                      <div className="space-y-2 text-sm break-words">
                        {selectedCliente.email && (
                          <div>
                            <span className="text-muted-foreground">Email:</span> {selectedCliente.email}
                          </div>
                        )}
                        {selectedCliente.telefone && (
                          <div>
                            <span className="text-muted-foreground">Telefone:</span> {selectedCliente.telefone}
                          </div>
                        )}
                        {selectedCliente.cnpj && (
                          <div>
                            <span className="text-muted-foreground">CNPJ:</span> {selectedCliente.cnpj}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedCliente.historico_interacoes && (
                      <div aria-label="Histórico">
                        <h3 className="font-semibold mb-3">Histórico</h3>
                        <p className="text-sm text-muted-foreground break-words">
                          {selectedCliente.historico_interacoes}
                        </p>
                      </div>
                    )}

                    <div aria-label="Detalhes do Contrato">
                      <h3 className="font-semibold mb-3">Detalhes do Contrato</h3>
                      <div className="space-y-2 text-sm break-words">
                        <div>
                          <span className="text-muted-foreground">Início:</span>{" "}
                          {selectedCliente.data_inicio &&
                            format(parseISO(selectedCliente.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        {selectedCliente.data_fim && (
                          <div>
                            <span className="text-muted-foreground">Fim:</span>{" "}
                            {format(parseISO(selectedCliente.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        )}
                        {selectedCliente.origem_lead && (
                          <div>
                            <span className="text-muted-foreground">Origem:</span> {selectedCliente.origem_lead}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-nome">Nome do Contratante Responsável *</Label>
                        <Input
                          id="edit-nome"
                          value={formData.nome_contratante_responsavel}
                          onChange={(e) => setFormData({ ...formData, nome_contratante_responsavel: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-empresa">Empresa</Label>
                        <Input
                          id="edit-empresa"
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-telefone">Telefone</Label>
                        <Input
                          id="edit-telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-cnpj">CNPJ</Label>
                        <Input
                          id="edit-cnpj"
                          value={formData.cnpj}
                          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-produto">Produto *</Label>
                        <Select
                          value={formData.product_id}
                          onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {produtos
                              .filter((p) => p.ativo)
                              .map((produto) => (
                                <SelectItem key={produto.id} value={produto.id}>
                                  {produto.nome} - {brl(produto.valor_base)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-valor">Valor do Contrato *</Label>
                      <CurrencyInput
                        value={formData.valor_contrato || 0}
                        onChange={(value) => setFormData({ ...formData, valor_contrato: value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-pagamento">Forma de Pagamento *</Label>
                      <Select
                        value={formData.forma_pagamento}
                        onValueChange={(value) =>
                          setFormData({ ...formData, forma_pagamento: value as FormaPagamento })
                        }
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
                    </div>

                    {showParcelamento && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-entrada">Valor de Entrada</Label>
                            <CurrencyInput
                              value={formData.valor_entrada || 0}
                              onChange={(value) => setFormData({ ...formData, valor_entrada: value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-parcelas">Número de Parcelas</Label>
                            <Input
                              id="edit-parcelas"
                              type="number"
                              value={formData.numero_parcelas}
                              onChange={(e) =>
                                setFormData({ ...formData, numero_parcelas: Number.parseInt(e.target.value) || 1 })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-valor-parcela">Valor da Parcela</Label>
                            <CurrencyInput
                              value={formData.valor_parcela || 0}
                              onChange={(value) => setFormData({ ...formData, valor_parcela: value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-periodicidade">Periodicidade</Label>
                          <Select
                            value={formData.periodicidade}
                            onValueChange={(value) =>
                              setFormData({ ...formData, periodicidade: value as Periodicidade })
                            }
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
                        </div>
                      </>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-data-inicio">Data de Início</Label>
                        <Input
                          id="edit-data-inicio"
                          type="date"
                          value={formData.data_inicio?.split("T")[0]}
                          onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-data-fim">Data de Fim (opcional)</Label>
                        <Input
                          id="edit-data-fim"
                          type="date"
                          value={formData.data_fim?.split("T")[0] || ""}
                          onChange={(e) => setFormData({ ...formData, data_fim: e.target.value || undefined })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value as Cliente["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="em_risco">Em Risco</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-nps">NPS Manual (0-10)</Label>
                        <Input
                          id="edit-nps"
                          type="number"
                          min="0"
                          max="10"
                          value={formData.nps_manual || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, nps_manual: Number.parseInt(e.target.value) || undefined })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-historico">Observações</Label>
                      <Textarea
                        id="edit-historico"
                        value={formData.historico_interacoes}
                        onChange={(e) => setFormData({ ...formData, historico_interacoes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false)
                      setEditingClienteId(null)
                      resetForm()
                    }}
                    className="rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setClientes(
                        clientes.map((c) =>
                          c.id === editingClienteId
                            ? {
                                ...c,
                                ...formData,
                              }
                            : c,
                        ),
                      )
                      toast({
                        title: "Cliente atualizado",
                        description: "As informações do cliente foram atualizadas com sucesso.",
                      })
                      setSheetOpen(false)
                      setEditMode(false)
                      setEditingClienteId(null)
                      resetForm()
                    }}
                    disabled={!formData.nome_contratante_responsavel || !formData.product_id}
                    className="rounded-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9]"
                  >
                    Salvar alterações
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
