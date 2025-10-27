"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Search, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { AppBrand } from "./AppBrand"

interface AppBarProps {
  title?: string
  onSearchClick?: () => void
}

export function AppBar({ title, onSearchClick }: AppBarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <AppBrand />
          </div>
          {title && <h2 className="text-xl font-semibold text-foreground hidden lg:block">{title}</h2>}
        </div>

        <div className="flex-1 max-w-md">
          <button
            onClick={onSearchClick}
            className="w-full relative flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-left"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Buscar... ⌘K</span>
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 rounded-full px-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004CE6] to-[#6E59F9] flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
