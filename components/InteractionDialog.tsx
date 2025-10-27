"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import type { Interacao, Cliente } from "@/lib/mockData"
import { resolveClientStatus } from "@/lib/clientStatus"

interface InteractionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (interacao: Omit<Interacao, "id">) => void
  cliente: Cliente
  editingInteraction?: Interacao | null
}

export function InteractionDialog({ open, onOpenChange, onSave, cliente, editingInteraction }: InteractionDialogProps) {
  const [formData, setFormData] = useState<Omit<Interacao, "id">>({
    data: new Date().toISOString().split("T")[0],
    tipo: "Contato",
    titulo: "",
    descricao: "",
    autor: "",
  })
  const [errors, setErrors] = useState<{ data?: string; titulo?: string }>({})

  const clientStatus = resolveClientStatus(cliente)
  const isClienteFinalizado = clientStatus === "finalizado"
  const isClienteInadimplente = clientStatus === "inadimplente"

  useEffect(() => {
    if (editingInteraction) {
      setFormData({
        data: editingInteraction.data.split("T")[0],
        tipo: editingInteraction.tipo,
        titulo: editingInteraction.titulo,
        descricao: editingInteraction.descricao || "",
        autor: editingInteraction.autor || "",
      })
    } else {
      setFormData({
        data: new Date().toISOString().split("T")[0],
        tipo: "Contato",
        titulo: "",
        descricao: "",
        autor: "",
      })
    }
    setErrors({})
  }, [editingInteraction, open])

  // Auto-suggest text for Financeiro type if client is Inadimplente
  useEffect(() => {
    if (formData.tipo === "Financeiro" && isClienteInadimplente && !editingInteraction) {
      setFormData((prev) => ({
        ...prev,
        titulo: prev.titulo || "Contato sobre regularização de pagamento",
      }))
    }
  }, [formData.tipo, isClienteInadimplente, editingInteraction])

  const validate = () => {
    const newErrors: { data?: string; titulo?: string } = {}

    // Data não pode ser futura
    const selectedDate = new Date(formData.data)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    if (selectedDate > today) {
      newErrors.data = "Data no futuro não permitida"
    }

    // Título obrigatório
    if (!formData.titulo.trim()) {
      newErrors.titulo = "Título é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave({
        ...formData,
        data: new Date(formData.data).toISOString(),
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>{editingInteraction ? "Editar Interação" : "Adicionar Interação"}</DialogTitle>
          <DialogDescription>
            {editingInteraction ? "Atualize os detalhes da interação" : "Registre uma nova interação com o cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.data && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.data}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value as Interacao["tipo"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Reunião">Reunião</SelectItem>
                <SelectItem value="Contato">Contato</SelectItem>
                <SelectItem value="Entrega">Entrega</SelectItem>
                <SelectItem value="Feedback">Feedback</SelectItem>
                <SelectItem value="Renovação" disabled={isClienteFinalizado}>
                  Renovação {isClienteFinalizado && "(Bloqueado)"}
                </SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {isClienteFinalizado && formData.tipo === "Renovação" && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Contrato finalizado — crie uma nova proposta antes de renovar.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder={
                formData.tipo === "Financeiro" && isClienteInadimplente
                  ? "Contato sobre regularização de pagamento"
                  : "Ex: Reunião de alinhamento"
              }
            />
            {errors.titulo && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.titulo}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Detalhes adicionais sobre a interação..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autor">Autor (opcional)</Label>
            <Input
              id="autor"
              value={formData.autor}
              onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
              placeholder="Nome do responsável"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="rounded-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9]">
            {editingInteraction ? "Salvar Alterações" : "Adicionar Interação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
