"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RecomendacoesList } from "@/components/RecomendacoesList"
import { recomendacoesMock, type Recomendacao } from "@/lib/mockData"
import { Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RecomendacoesPage() {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>(recomendacoesMock)
  const { toast } = useToast()

  const handleToggleResolved = (id: string) => {
    setRecomendacoes(recomendacoes.map((rec) => (rec.id === id ? { ...rec, resolvido: !rec.resolvido } : rec)))
  }

  const handleGenerateRecomendacoes = () => {
    // Simulate reordering/filtering
    const shuffled = [...recomendacoes].sort(() => Math.random() - 0.5)
    setRecomendacoes(shuffled)
    toast({
      title: "Recomendações atualizadas",
      description: "Novas recomendações foram geradas com base nos dados mais recentes.",
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">💡 Recomendações de Crescimento</h1>
          <p className="text-muted-foreground mt-1">Sugestões automáticas baseadas em dados reais do seu negócio.</p>
        </div>
        <Button
          onClick={handleGenerateRecomendacoes}
          className="gap-2 rounded-full bg-gradient-to-r from-[#004CE6] to-[#6E59F9] shadow-soft"
        >
          <Lightbulb className="h-4 w-4" />
          Gerar novas recomendações
        </Button>
      </div>

      {recomendacoes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma recomendação gerada ainda.</p>
        </div>
      ) : (
        <RecomendacoesList recomendacoes={recomendacoes} onToggleResolved={handleToggleResolved} />
      )}
    </div>
  )
}
