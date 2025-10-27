"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RelatoriosPage() {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: "Em breve",
      description: `A funcionalidade de ${action} estará disponível em breve.`,
    })
  }

  const reports = [
    {
      title: "Relatório Mensal",
      description: "Visão completa das métricas do mês",
      icon: FileText,
      action: "relatório mensal",
    },
    {
      title: "Visão Executiva",
      description: "Resumo estratégico para tomada de decisão",
      icon: Download,
      action: "visão executiva",
    },
    {
      title: "Análise de Cohort",
      description: "Comportamento de clientes por período de entrada",
      icon: Calendar,
      action: "análise de cohort",
    },
    {
      title: "Relatório de Churn",
      description: "Análise detalhada de cancelamentos",
      icon: FileText,
      action: "relatório de churn",
    },
    {
      title: "Performance de Produtos",
      description: "Métricas por produto e categoria",
      icon: Download,
      action: "performance de produtos",
    },
    {
      title: "Previsão de Receita",
      description: "Projeções baseadas em dados históricos",
      icon: Calendar,
      action: "previsão de receita",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground mt-1">Gere relatórios personalizados e análises avançadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.title} className="rounded-2xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => handleAction(report.action)}>
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
