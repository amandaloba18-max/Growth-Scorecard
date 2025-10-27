"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useObjective, type Objetivo } from "@/lib/objectiveContext"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { ObjectiveOnboarding } from "@/components/ObjectiveOnboarding"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracoesPage() {
  const { objetivo, setObjetivo, modeloReceita, estagio } = useObjective()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleObjetivoChange = (value: string) => {
    setObjetivo(value as Objetivo)
    toast({
      title: "Objetivo atualizado",
      description: "O dashboard foi adaptado para o novo objetivo.",
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground mt-1">Personalize sua experiência no Growth Scorecard</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Objective Settings */}
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Objetivo Principal</CardTitle>
            <CardDescription>Defina o foco estratégico do seu negócio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo atual</Label>
              <Select value={objetivo || ""} onValueChange={handleObjetivoChange}>
                <SelectTrigger id="objetivo" className="rounded-full">
                  <SelectValue placeholder="Selecione um objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reduzir churn">Reduzir churn</SelectItem>
                  <SelectItem value="Aumentar retenção/recompra">Aumentar retenção/recompra</SelectItem>
                  <SelectItem value="Escalar vendas com lucro">Escalar vendas com lucro</SelectItem>
                  <SelectItem value="Estruturar operação comercial">Estruturar operação comercial</SelectItem>
                  <SelectItem value="Melhorar margem de lucro">Melhorar margem de lucro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {modeloReceita && (
              <div className="space-y-2">
                <Label>Modelo de receita</Label>
                <div className="text-sm text-muted-foreground">{modeloReceita}</div>
              </div>
            )}

            {estagio && (
              <div className="space-y-2">
                <Label>Estágio do negócio</Label>
                <div className="text-sm text-muted-foreground">{estagio}</div>
              </div>
            )}

            <Button variant="outline" onClick={() => setShowOnboarding(true)} className="w-full rounded-full">
              Refazer configuração inicial
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a interface do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Modo escuro</Label>
                <div className="text-sm text-muted-foreground">Ativar tema escuro</div>
              </div>
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Configurações Regionais</CardTitle>
            <CardDescription>Idioma e formato de dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma</Label>
              <Select defaultValue="pt-BR" disabled>
                <SelectTrigger id="idioma" className="rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso horário</Label>
              <Select defaultValue="america-sao-paulo" disabled>
                <SelectTrigger id="timezone" className="rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-sao-paulo">América/São Paulo (BRT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moeda">Moeda</Label>
              <Select defaultValue="BRL" disabled>
                <SelectTrigger id="moeda" className="rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie alertas e lembretes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Alertas por email</Label>
                <div className="text-sm text-muted-foreground">Receber recomendações importantes por email</div>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-report">Relatório semanal</Label>
                <div className="text-sm text-muted-foreground">Resumo semanal das métricas</div>
              </div>
              <Switch id="weekly-report" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="churn-alerts">Alertas de churn</Label>
                <div className="text-sm text-muted-foreground">Notificar quando cliente estiver em risco</div>
              </div>
              <Switch id="churn-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <ObjectiveOnboarding open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  )
}
