"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Objetivo =
  | "Reduzir churn"
  | "Aumentar retenção/recompra"
  | "Escalar vendas com lucro"
  | "Estruturar operação comercial"
  | "Melhorar margem de lucro"

interface ObjectiveContextType {
  objetivo: Objetivo | null
  setObjetivo: (obj: Objetivo) => void
  modeloReceita: string | null
  setModeloReceita: (modelo: string) => void
  estagio: string | null
  setEstagio: (est: string) => void
}

const ObjectiveContext = createContext<ObjectiveContextType | undefined>(undefined)

export function ObjectiveProvider({ children }: { children: React.ReactNode }) {
  const [objetivo, setObjetivoState] = useState<Objetivo | null>(null)
  const [modeloReceita, setModeloReceitaState] = useState<string | null>(null)
  const [estagio, setEstagioState] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("growth-scorecard-objective")
    const storedModelo = localStorage.getItem("growth-scorecard-modelo")
    const storedEstagio = localStorage.getItem("growth-scorecard-estagio")

    if (stored) setObjetivoState(stored as Objetivo)
    if (storedModelo) setModeloReceitaState(storedModelo)
    if (storedEstagio) setEstagioState(storedEstagio)
  }, [])

  const setObjetivo = (obj: Objetivo) => {
    setObjetivoState(obj)
    if (mounted) {
      localStorage.setItem("growth-scorecard-objective", obj)
    }
  }

  const setModeloReceita = (modelo: string) => {
    setModeloReceitaState(modelo)
    if (mounted) {
      localStorage.setItem("growth-scorecard-modelo", modelo)
    }
  }

  const setEstagio = (est: string) => {
    setEstagioState(est)
    if (mounted) {
      localStorage.setItem("growth-scorecard-estagio", est)
    }
  }

  return (
    <ObjectiveContext.Provider
      value={{
        objetivo,
        setObjetivo,
        modeloReceita,
        setModeloReceita,
        estagio,
        setEstagio,
      }}
    >
      {children}
    </ObjectiveContext.Provider>
  )
}

export function useObjective() {
  const context = useContext(ObjectiveContext)
  if (context === undefined) {
    throw new Error("useObjective must be used within ObjectiveProvider")
  }
  return context
}
