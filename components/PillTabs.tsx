"use client"

import { cn } from "@/lib/utils"

interface PillTab {
  id: string
  label: string
}

interface PillTabsProps {
  tabs: PillTab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function PillTabs({ tabs, activeTab, onChange, className }: PillTabsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 p-1 bg-muted rounded-full", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
            activeTab === tab.id
              ? "bg-gradient-to-r from-[#004CE6] to-[#6E59F9] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
