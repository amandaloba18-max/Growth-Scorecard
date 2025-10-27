"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { subDays } from "date-fns"

interface PeriodContextType {
  period: { from: Date; to: Date }
  setPeriod: (period: { from: Date; to: Date }) => void
  compareWithPrevious: boolean
  setCompareWithPrevious: (compare: boolean) => void
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined)

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [compareWithPrevious, setCompareWithPrevious] = useState(true)

  return (
    <PeriodContext.Provider value={{ period, setPeriod, compareWithPrevious, setCompareWithPrevious }}>
      {children}
    </PeriodContext.Provider>
  )
}

export function usePeriod() {
  const context = useContext(PeriodContext)
  if (context === undefined) {
    throw new Error("usePeriod must be used within PeriodProvider")
  }
  return context
}
