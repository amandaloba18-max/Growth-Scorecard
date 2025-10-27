"use client"

import { cn } from "@/lib/utils"
import { BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AppBrandProps {
  collapsed?: boolean
  className?: string
}

export function AppBrand({ collapsed = false, className }: AppBrandProps) {
  return (
    <div className={cn("flex items-center gap-3 py-4 px-3", className)}>
      {/* Logo Icon with Gradient Background */}
      <div
        className={cn(
          "relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#004CE6] to-[#6E59F9] flex items-center justify-center shadow-md transition-all duration-300",
          "hover:shadow-[0_0_20px_rgba(0,76,230,0.4)] hover:scale-105",
          collapsed && "group",
        )}
      >
        <BarChart3 className="h-5 w-5 text-white" strokeWidth={2.5} />

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Growth Scorecard
          </div>
        )}
      </div>

      {/* Brand Text - Hidden when collapsed */}
      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">Growth Scorecard</h1>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-4 border-[#004CE6] text-[#004CE6] dark:border-[#6E59F9] dark:text-[#6E59F9]"
            >
              BETA
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">Growth Stack Suite</p>
        </div>
      )}
    </div>
  )
}
