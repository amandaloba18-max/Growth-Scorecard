"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { usePeriod } from "@/lib/periodContext"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { PillTabs } from "@/components/PillTabs"

export function PeriodSelector() {
  const { period, setPeriod, compareWithPrevious, setCompareWithPrevious } = usePeriod()
  const [open, setOpen] = useState(false)
  const [customRange, setCustomRange] = useState<DateRange | undefined>()
  const [activePreset, setActivePreset] = useState("30")

  const presets = [
    { id: "7", label: "7 dias", days: 7 },
    { id: "30", label: "30 dias", days: 30 },
    { id: "90", label: "90 dias", days: 90 },
  ]

  const handlePreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      const to = new Date()
      const from = subDays(to, preset.days)
      setPeriod({ from, to })
      setActivePreset(presetId)
    }
  }

  const handleCustomRange = () => {
    if (customRange?.from && customRange?.to) {
      setPeriod({ from: customRange.from, to: customRange.to })
      setOpen(false)
    }
  }

  const displayText =
    period.from && period.to
      ? `${format(period.from, "dd/MM", { locale: ptBR })} - ${format(period.to, "dd/MM", { locale: ptBR })}`
      : "Selecionar período"

  return (
    <div className="flex items-center gap-4">
      <PillTabs
        tabs={presets.map((p) => ({ id: p.id, label: p.label }))}
        activeTab={activePreset}
        onChange={handlePreset}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
            <Calendar className="h-4 w-4" />
            Personalizado
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Período personalizado</Label>
              <CalendarComponent
                mode="range"
                selected={customRange}
                onSelect={setCustomRange}
                numberOfMonths={2}
                locale={ptBR}
              />
              <Button
                className="w-full mt-2 rounded-full"
                size="sm"
                onClick={handleCustomRange}
                disabled={!customRange?.from || !customRange?.to}
              >
                Aplicar período
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Switch checked={compareWithPrevious} onCheckedChange={setCompareWithPrevious} id="compare" />
        <Label htmlFor="compare" className="text-sm cursor-pointer">
          Comparar
        </Label>
      </div>
    </div>
  )
}
