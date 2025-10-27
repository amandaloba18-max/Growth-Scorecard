"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Recomendacao } from "@/lib/mockData"
import { AlertCircle, Lightbulb, Activity } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

interface RecomendacoesListProps {
  recomendacoes: Recomendacao[]
  onToggleResolved?: (id: string) => void
  compact?: boolean
  limit?: number
}

export function RecomendacoesList({ recomendacoes, onToggleResolved, compact = false, limit }: RecomendacoesListProps) {
  const [filterTipo, setFilterTipo] = useState<string>("todos")
  const [filterPrioridade, setFilterPrioridade] = useState<string>("todos")

  const getIcon = (tipo: Recomendacao["tipo"]) => {
    switch (tipo) {
      case "alerta":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "recomendacao":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case "diagnostico":
        return <Activity className="h-5 w-5 text-blue-500" />
    }
  }

  const getPrioridadeBadge = (prioridade: Recomendacao["prioridade"]) => {
    const config = {
      alta: { variant: "default" as const, className: "bg-red-500 text-white rounded-full" },
      media: { variant: "secondary" as const, className: "bg-yellow-500 text-white rounded-full" },
      baixa: {
        variant: "outline" as const,
        className: "bg-green-500/10 text-green-700 dark:text-green-300 rounded-full border-green-500",
      },
    }
    const { variant, className } = config[prioridade]
    return (
      <Badge variant={variant} className={className}>
        {prioridade.charAt(0).toUpperCase() + prioridade.slice(1)}
      </Badge>
    )
  }

  const filteredRecomendacoes = recomendacoes
    .filter((rec) => {
      if (filterTipo !== "todos" && rec.tipo !== filterTipo) return false
      if (filterPrioridade !== "todos" && rec.prioridade !== filterPrioridade) return false
      return true
    })
    .slice(0, limit)

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex gap-3">
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="alerta">Alertas</SelectItem>
              <SelectItem value="recomendacao">Recomendações</SelectItem>
              <SelectItem value="diagnostico">Diagnósticos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPrioridade} onValueChange={setFilterPrioridade}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas prioridades</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        {filteredRecomendacoes.map((rec) => (
          <Card key={rec.id} className={`rounded-2xl shadow-soft ${rec.resolvido ? "opacity-60" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1" title="Gerado automaticamente pela IA com base nos seus KPIs.">
                  {getIcon(rec.tipo)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-base">{rec.titulo}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.conteudo}</p>
                    </div>
                    {getPrioridadeBadge(rec.prioridade)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(rec.data_geracao), "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                    {onToggleResolved && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`resolved-${rec.id}`}
                          checked={rec.resolvido}
                          onCheckedChange={() => onToggleResolved(rec.id)}
                        />
                        <label
                          htmlFor={`resolved-${rec.id}`}
                          className="text-sm cursor-pointer select-none text-muted-foreground"
                        >
                          Resolvido
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
