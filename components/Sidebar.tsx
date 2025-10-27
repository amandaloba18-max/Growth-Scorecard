"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, TrendingUp, Lightbulb, FileText, Settings, ChevronRight, Activity } from "lucide-react"
import { useState } from "react"
import { AppBrand } from "./AppBrand"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Produtos", href: "/produtos", icon: TrendingUp },
  { name: "KPIs de Crescimento", href: "/metricas", icon: Activity },
  { name: "Recomendações", href: "/recomendacoes", icon: Lightbulb },
  { name: "Relatórios", href: "/relatorios", icon: FileText },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className={cn("border-b border-border", isCollapsed && "px-1")}>
        <AppBrand collapsed={isCollapsed} />
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors z-10"
        aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        <ChevronRight className={cn("h-3 w-3 transition-transform", !isCollapsed && "rotate-180")} />
      </button>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-gradient-to-r from-[#004CE6] to-[#6E59F9] text-white shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-white")} />
              {!isCollapsed && <span>{item.name}</span>}

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
