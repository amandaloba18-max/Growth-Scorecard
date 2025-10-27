"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useObjective, type Objetivo } from "@/lib/objectiveContext"
import { Target, DollarSign, TrendingUp } from "lucide-react"

interface ObjectiveOnboardingProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ObjectiveOnboarding({ open: controlledOpen, onOpenChange }: ObjectiveOnboardingProps) {
  const [step, setStep] = useState(1)
  const [selectedObjetivo, setSelectedObjetivo] = useState<Objetivo | null>(null)
  const [selectedModelo, setSelectedModelo] = useState<string | null>(null)
  const [selectedEstagio, setSelectedEstagio] = useState<string | null>(null)
  const { objetivo, setObjetivo, setModeloReceita, setEstagio } = useObjective()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen

  useEffect(() => {
    if (!isControlled && !objetivo) {
      const hasSeenOnboarding = localStorage.getItem("growth-scorecard-onboarding-seen")
      if (!hasSeenOnboarding) {
        setInternalOpen(true)
      }
    }
  }, [objetivo, isControlled])

  const objetivos: Objetivo[] = [
    "Reduzir churn",
    "Aumentar retenção/recompra",
    "Escalar vendas com lucro",
    "Estruturar operação comercial",
    "Melhorar margem de lucro",
  ]

  const modelos = ["Recorrência (MRR/ARR)", "Transacional (vendas únicas)", "Híbrido", "Serviços sob demanda"]

  const estagios = ["Validação (0-10 clientes)", "Tração (10-50 clientes)", "Escala (50+ clientes)", "Maturidade"]

  const handleNext = () => {
    if (step === 1 && selectedObjetivo) {
      setStep(2)
    } else if (step === 2 && selectedModelo) {
      setStep(3)
    }
  }

  const handleFinish = () => {
    if (selectedObjetivo && selectedModelo && selectedEstagio) {
      setObjetivo(selectedObjetivo)
      setModeloReceita(selectedModelo)
      setEstagio(selectedEstagio)
      localStorage.setItem("growth-scorecard-onboarding-seen", "true")
      setOpen(false)
      setStep(1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {step === 1 && (
              <>
                <Target className="h-5 w-5 text-primary" />
                Qual é o seu objetivo principal?
              </>
            )}
            {step === 2 && (
              <>
                <DollarSign className="h-5 w-5 text-primary" />
                Qual é o seu modelo de receita?
              </>
            )}
            {step === 3 && (
              <>
                <TrendingUp className="h-5 w-5 text-primary" />
                Em que estágio está o seu negócio?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Vamos personalizar o Growth Scorecard para o seu contexto."}
            {step === 2 && "Isso nos ajuda a calcular as métricas mais relevantes."}
            {step === 3 && "Entender o seu estágio nos permite dar insights mais precisos."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 1 && (
            <RadioGroup
              value={selectedObjetivo || ""}
              onValueChange={(value) => setSelectedObjetivo(value as Objetivo)}
            >
              <div className="space-y-3">
                {objetivos.map((obj) => (
                  <div
                    key={obj}
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedObjetivo(obj)}
                  >
                    <RadioGroupItem value={obj} id={obj} />
                    <Label htmlFor={obj} className="flex-1 cursor-pointer">
                      {obj}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {step === 2 && (
            <RadioGroup value={selectedModelo || ""} onValueChange={setSelectedModelo}>
              <div className="space-y-3">
                {modelos.map((modelo) => (
                  <div
                    key={modelo}
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedModelo(modelo)}
                  >
                    <RadioGroupItem value={modelo} id={modelo} />
                    <Label htmlFor={modelo} className="flex-1 cursor-pointer">
                      {modelo}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {step === 3 && (
            <RadioGroup value={selectedEstagio || ""} onValueChange={setSelectedEstagio}>
              <div className="space-y-3">
                {estagios.map((estagio) => (
                  <div
                    key={estagio}
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedEstagio(estagio)}
                  >
                    <RadioGroupItem value={estagio} id={estagio} />
                    <Label htmlFor={estagio} className="flex-1 cursor-pointer">
                      {estagio}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={(step === 1 && !selectedObjetivo) || (step === 2 && !selectedModelo)}
            >
              Próximo
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={!selectedEstagio}>
              Finalizar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
