"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { usePeriod } from "@/lib/periodContext"
import { differenceInDays } from "date-fns"

export function WelcomeBanner() {
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("Usuário")
  const { period } = usePeriod()
  const [subtitle, setSubtitle] = useState("Acompanhe o desempenho do seu negócio")

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem("clientName")
    if (storedName) {
      setUserName(storedName)
    }

    // Determine time-based greeting
    const hour = new Date().getHours()
    let timeGreeting = "Bom dia"
    if (hour >= 12 && hour < 18) {
      timeGreeting = "Boa tarde"
    } else if (hour >= 18) {
      timeGreeting = "Boa noite"
    }

    // Randomly pick a complementary phrase
    const phrases = [
      "Excelente ter você de volta!",
      "Que bom te ver por aqui novamente.",
      "Vamos otimizar seu crescimento hoje?",
      "Continue evoluindo — seus dados estão prontos.",
    ]
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]

    // Combine greeting
    setGreeting(`${timeGreeting}, ${storedName || "Usuário"}! ${randomPhrase}`)
  }, [])

  useEffect(() => {
    const days = differenceInDays(period.to, period.from)

    if (days === 7) {
      setSubtitle("Desempenho da semana")
    } else if (days === 30) {
      setSubtitle("Desempenho do mês")
    } else if (days === 90) {
      setSubtitle("Desempenho do trimestre")
    } else if (days > 0 && days !== 7 && days !== 30 && days !== 90) {
      setSubtitle("Desempenho no período selecionado")
    } else {
      setSubtitle("Acompanhe o desempenho do seu negócio")
    }
  }, [period])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#004CE6]/10 via-[#6E59F9]/10 to-[#22D3EE]/10 p-6 shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6E59F9]/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#22D3EE]/20 to-transparent rounded-full blur-2xl" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004CE6] to-[#6E59F9] flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">{greeting}</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
