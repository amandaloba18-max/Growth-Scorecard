"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CurrencyInput } from "@/components/CurrencyInput"
import { PillTabs } from "@/components/PillTabs"
import { produtos as initialProdutos, type Produto } from "@/lib/mockData"
import { brl } from "@/lib/format"
import { Plus, Pencil } from "lucide-react"

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  const [formData, setFormData] = useState<Partial<Produto>>({
    nome: "",
    descricao: "",
    valor_base: 0,
    tipo: "plano",
    ativo: true,
  })

  const filteredProdutos = produtos.filter((produto) => {
    if (statusFilter === "todos") return true
    return statusFilter === "ativo" ? produto.ativo : !produto.ativo
  })

  const handleOpenDialog = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto)
      setFormData(produto)
    } else {
      setEditingProduto(null)
      setFormData({
        nome: "",
        descricao: "",
        valor_base: 0,
        tipo: "plano",
        ativo: true,
      })
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingProduto) {
      setProdutos(produtos.map((p) => (p.id === editingProduto.id ? { ...p, ...formData } : p)))
    } else {
      const newProduto: Produto = {
        id: `prod-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
      } as Produto
      setProdutos([...produtos, newProduto])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu catálogo de produtos e serviços</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 rounded-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9] shadow-soft"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription>Preencha as informações do produto</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor Base *</Label>
                <CurrencyInput
                  value={formData.valor_base || 0}
                  onChange={(value) => setFormData({ ...formData, valor_base: value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value as Produto["tipo"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plano">Plano</SelectItem>
                    <SelectItem value="serviço">Serviço</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Produto ativo</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!formData.nome || !formData.valor_base}>
                {editingProduto ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <PillTabs
          tabs={[
            { id: "todos", label: "Todos" },
            { id: "ativo", label: "Ativos" },
            { id: "inativo", label: "Inativos" },
          ]}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Valor Base</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.map((produto, idx) => (
              <TableRow key={produto.id} className={idx % 2 === 0 ? "bg-muted/20" : ""}>
                <TableCell>
                  <div>
                    <div className="font-medium">{produto.nome}</div>
                    {produto.descricao && <div className="text-sm text-muted-foreground">{produto.descricao}</div>}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{produto.tipo}</TableCell>
                <TableCell className="font-medium">{brl(produto.valor_base)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      produto.ativo
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 rounded-full"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300 border-0 rounded-full"
                    }
                  >
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="rounded-full" onClick={() => handleOpenDialog(produto)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
