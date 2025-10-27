"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PeriodSelector } from "@/components/PeriodSelector"
import { useObjective } from "@/lib/objectiveContext"
import { useState, useEffect } from "react"
import { ObjectiveOnboarding } from "@/components/ObjectiveOnboarding"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { objetivo } = useObjective()
  const [mounted, setMounted] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {objetivo && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium">Foco atual:</span>
              <span className="text-muted-foreground">{objetivo}</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowOnboarding(true)}>
            Alterar objetivo
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <PeriodSelector />

          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </header>

      <ObjectiveOnboarding open={showOnboarding} onOpenChange={setShowOnboarding} />
    </>
  )
}
